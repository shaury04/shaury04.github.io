export type NasaDemoRecord = {
  cycle: number;
  predictedRul: number;
  groundTruthRul?: number;
  warningState: boolean;
};

export type NasaTrajectory = {
  id: string;
  engineId: number;
  datasetSubset: "FD001" | "FD004";
  split: "test";
  modelLabel: "XGBoost";
  outcome: "detected" | "missed";
  selectionNote: string;
  firstConfirmedCycle: number | null;
  firstConfirmedGroundTruthRul: number | null;
  records: NasaDemoRecord[];
};

export type NasaDemoData = {
  schemaVersion: 1;
  provenance: {
    sourceRepository: string;
    sourceCommit: string;
    sourceFiles: string[];
    exporter: string;
  };
  warningRule: {
    horizonCycles: number;
    consecutivePredictions: number;
    comparison: string;
    confirmation: string;
  };
  trajectories: NasaTrajectory[];
};

function object(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
  return value as Record<string, unknown>;
}

function finite(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${label} must be finite`);
  }
  return value;
}

export function validateNasaDemo(value: unknown): NasaDemoData {
  const data = object(value, "NASA demo");
  if (data.schemaVersion !== 1) throw new Error("Unsupported NASA demo schema version");
  const provenance = object(data.provenance, "provenance");
  if (typeof provenance.sourceRepository !== "string" || !provenance.sourceRepository.startsWith("https://github.com/")) {
    throw new Error("provenance.sourceRepository must be a GitHub URL");
  }
  if (typeof provenance.sourceCommit !== "string" || !/^[a-f0-9]{40}$/.test(provenance.sourceCommit)) {
    throw new Error("provenance.sourceCommit must be a full Git SHA");
  }
  if (!Array.isArray(provenance.sourceFiles) || provenance.sourceFiles.some((path) => typeof path !== "string")) {
    throw new Error("provenance.sourceFiles must be a string array");
  }
  if (typeof provenance.exporter !== "string") throw new Error("provenance.exporter is required");
  const rule = object(data.warningRule, "warningRule");
  const horizon = finite(rule.horizonCycles, "warningRule.horizonCycles");
  const persistence = finite(rule.consecutivePredictions, "warningRule.consecutivePredictions");
  if (!Number.isInteger(persistence) || persistence < 1) throw new Error("Warning persistence must be a positive integer");
  if (!Array.isArray(data.trajectories) || data.trajectories.length === 0) {
    throw new Error("At least one trajectory is required");
  }
  const ids = new Set<string>();
  for (const [trajectoryIndex, candidate] of data.trajectories.entries()) {
    const trajectory = object(candidate, `trajectory ${trajectoryIndex}`);
    if (typeof trajectory.id !== "string" || ids.has(trajectory.id)) throw new Error("Trajectory IDs must be unique strings");
    ids.add(trajectory.id);
    const engineId = finite(trajectory.engineId, `${trajectory.id}.engineId`);
    if (!Number.isInteger(engineId) || engineId < 1) throw new Error(`${trajectory.id} has an invalid engine ID`);
    if (trajectory.datasetSubset !== "FD001" && trajectory.datasetSubset !== "FD004") throw new Error(`${trajectory.id} has an invalid subset`);
    if (trajectory.id !== `${trajectory.datasetSubset}-${engineId}`) throw new Error(`${trajectory.id} is inconsistent with its subset or engine`);
    if (trajectory.split !== "test" || trajectory.modelLabel !== "XGBoost") {
      throw new Error(`${trajectory.id} has inconsistent split or model metadata`);
    }
    if (trajectory.outcome !== "detected" && trajectory.outcome !== "missed") throw new Error(`${trajectory.id} has an invalid outcome`);
    if (typeof trajectory.selectionNote !== "string" || trajectory.selectionNote.length === 0) throw new Error(`${trajectory.id} needs a selection note`);
    if (!Array.isArray(trajectory.records) || trajectory.records.length === 0) throw new Error(`${trajectory.id} has no records`);
    let previousCycle = -Infinity;
    let streak = 0;
    let firstConfirmedCycle: number | null = null;
    for (const [recordIndex, recordValue] of trajectory.records.entries()) {
      const record = object(recordValue, `${trajectory.id} record ${recordIndex}`);
      const cycle = finite(record.cycle, `${trajectory.id}.cycle`);
      const predicted = finite(record.predictedRul, `${trajectory.id}.predictedRul`);
      if (record.groundTruthRul !== undefined) finite(record.groundTruthRul, `${trajectory.id}.groundTruthRul`);
      if (typeof record.warningState !== "boolean") throw new Error(`${trajectory.id}.warningState must be boolean`);
      if (!Number.isInteger(cycle) || cycle <= previousCycle) throw new Error(`${trajectory.id} cycles must be unique and sorted`);
      previousCycle = cycle;
      streak = predicted <= horizon ? streak + 1 : 0;
      const expectedWarning = streak >= persistence;
      if (record.warningState !== expectedWarning) throw new Error(`${trajectory.id} warning state disagrees with the declared rule`);
      if (expectedWarning && firstConfirmedCycle === null) firstConfirmedCycle = cycle;
    }
    if (trajectory.firstConfirmedCycle !== firstConfirmedCycle) throw new Error(`${trajectory.id} confirmation summary is inconsistent`);
    const confirmedRecord = firstConfirmedCycle === null
      ? undefined
      : (trajectory.records as NasaDemoRecord[]).find((record) => record.cycle === firstConfirmedCycle);
    const confirmedTruth = confirmedRecord?.groundTruthRul ?? null;
    if (trajectory.firstConfirmedGroundTruthRul !== confirmedTruth) throw new Error(`${trajectory.id} confirmation truth is inconsistent`);
    if (trajectory.outcome !== (firstConfirmedCycle === null ? "missed" : "detected")) throw new Error(`${trajectory.id} outcome is inconsistent`);
  }
  return value as NasaDemoData;
}

export function visibleRecords(trajectory: NasaTrajectory, recordIndex: number): NasaDemoRecord[] {
  const bounded = Math.min(Math.max(Math.trunc(recordIndex), 0), trajectory.records.length - 1);
  return trajectory.records.slice(0, bounded + 1);
}

export function currentWarningStatus(
  trajectory: NasaTrajectory,
  recordIndex: number,
  horizon: number,
  persistence: number,
): { state: "normal" | "pending" | "confirmed"; streak: number } {
  const bounded = Math.min(Math.max(Math.trunc(recordIndex), 0), trajectory.records.length - 1);
  let streak = 0;
  for (let index = bounded; index >= 0 && trajectory.records[index].predictedRul <= horizon; index -= 1) streak += 1;
  if (trajectory.records[bounded].warningState) return { state: "confirmed", streak };
  if (streak > 0) return { state: "pending", streak: Math.min(streak, persistence - 1) };
  return { state: "normal", streak: 0 };
}
