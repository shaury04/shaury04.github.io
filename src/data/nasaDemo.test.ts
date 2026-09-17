import { describe, expect, it } from "vitest";
import rawData from "./nasa-demo.json";
import {
  currentWarningStatus,
  validateNasaDemo,
  visibleRecords,
  type NasaDemoData,
} from "./nasaDemo";

const clone = (): unknown => JSON.parse(JSON.stringify(rawData));

describe("NASA demo contract", () => {
  it("validates the exported authentic trajectories", () => {
    const data = validateNasaDemo(rawData);
    expect(data.trajectories.map((trajectory) => trajectory.id)).toEqual([
      "FD001-52",
      "FD004-183",
      "FD004-219",
    ]);
  });

  it("rejects unsorted cycles", () => {
    const data = clone() as NasaDemoData;
    data.trajectories[0].records[1].cycle = data.trajectories[0].records[0].cycle;
    expect(() => validateNasaDemo(data)).toThrow(/unique and sorted/);
  });

  it("rejects warning states inconsistent with the declared rule", () => {
    const data = clone() as NasaDemoData;
    data.trajectories[0].records[0].warningState = true;
    expect(() => validateNasaDemo(data)).toThrow(/warning state disagrees/);
  });

  it("rejects inconsistent trajectory metadata", () => {
    const data = clone() as NasaDemoData;
    data.trajectories[0].engineId = 999;
    expect(() => validateNasaDemo(data)).toThrow(/inconsistent with its subset or engine/);
  });

  it("bounds visible records and reports detected and missed outcomes", () => {
    const data = validateNasaDemo(rawData);
    const detected = data.trajectories[0];
    const missed = data.trajectories[2];
    const detectedIndex = detected.records.findIndex((record) => record.warningState);
    expect(visibleRecords(detected, -20)).toHaveLength(1);
    expect(visibleRecords(detected, 10000)).toHaveLength(detected.records.length);
    expect(currentWarningStatus(detected, detectedIndex, 50, 3).state).toBe("confirmed");
    expect(currentWarningStatus(missed, missed.records.length - 1, 50, 3).state).not.toBe("confirmed");
  });
});
