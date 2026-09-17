#!/usr/bin/env python3
"""Export a compact, provenance-stamped browser demo from C-MAPSS predictions."""

from __future__ import annotations

import argparse
import csv
import gzip
import json
import math
import subprocess
from pathlib import Path

EXPECTED_COMMIT = "50bfa8a085c858e61bf91c69a8a5f47cc8db750f"
HORIZON = 50
PERSISTENCE = 3
SELECTIONS = (
    ("FD001", 52, "detected", "Detected case at the subset's median confirmed lead."),
    ("FD004", 183, "detected", "Detected case at the subset's median confirmed lead."),
    ("FD004", 219, "missed", "Eligible trajectory without a confirmed warning."),
)
REQUIRED_COLUMNS = {
    "subset", "unit_id", "cycle", "actual_rul", "predicted_rul", "model"
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, required=True, help="Path to the nasa checkout")
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("src/data/nasa-demo.json"),
        help="Generated JSON path",
    )
    return parser.parse_args()


def source_commit(source: Path) -> str:
    return subprocess.run(
        ["git", "-C", str(source), "rev-parse", "HEAD"],
        check=True,
        capture_output=True,
        text=True,
    ).stdout.strip()


def read_trajectory(source: Path, subset: str, unit_id: int) -> list[dict[str, object]]:
    source_file = source / "artifacts" / "predictions" / f"{subset}.csv.gz"
    selected: list[dict[str, object]] = []
    with gzip.open(source_file, "rt", encoding="utf-8", newline="") as stream:
        reader = csv.DictReader(stream)
        if not REQUIRED_COLUMNS.issubset(reader.fieldnames or []):
            missing = sorted(REQUIRED_COLUMNS.difference(reader.fieldnames or []))
            raise ValueError(f"{source_file} is missing columns: {missing}")
        streak = 0
        for row in reader:
            if row["subset"] != subset or int(row["unit_id"]) != unit_id or row["model"] != "xgboost":
                continue
            cycle = int(row["cycle"])
            predicted = float(row["predicted_rul"])
            actual = float(row["actual_rul"])
            if not all(math.isfinite(value) for value in (predicted, actual)):
                raise ValueError(f"Non-finite value in {subset} engine {unit_id}, cycle {cycle}")
            streak = streak + 1 if predicted <= HORIZON else 0
            selected.append(
                {
                    "cycle": cycle,
                    "predictedRul": round(predicted, 4),
                    "groundTruthRul": round(actual, 4),
                    "warningState": streak >= PERSISTENCE,
                }
            )
    if not selected:
        raise ValueError(f"No XGBoost rows found for {subset} engine {unit_id}")
    if [row["cycle"] for row in selected] != sorted({row["cycle"] for row in selected}):
        raise ValueError(f"Cycles are duplicated or unsorted for {subset} engine {unit_id}")
    return selected


def main() -> None:
    args = parse_args()
    commit = source_commit(args.source)
    if commit != EXPECTED_COMMIT:
        raise ValueError(f"Expected source commit {EXPECTED_COMMIT}, found {commit}")

    trajectories = []
    for subset, unit_id, outcome, note in SELECTIONS:
        records = read_trajectory(args.source, subset, unit_id)
        confirmed = next((row for row in records if row["warningState"]), None)
        actual_outcome = "detected" if confirmed else "missed"
        if actual_outcome != outcome:
            raise ValueError(f"Outcome changed for {subset} engine {unit_id}")
        trajectories.append(
            {
                "id": f"{subset}-{unit_id}",
                "engineId": unit_id,
                "datasetSubset": subset,
                "split": "test",
                "modelLabel": "XGBoost",
                "outcome": outcome,
                "selectionNote": note,
                "firstConfirmedCycle": confirmed["cycle"] if confirmed else None,
                "firstConfirmedGroundTruthRul": confirmed["groundTruthRul"] if confirmed else None,
                "records": records,
            }
        )

    payload = {
        "schemaVersion": 1,
        "provenance": {
            "sourceRepository": "https://github.com/shaury04/nasa",
            "sourceCommit": commit,
            "sourceFiles": [
                "artifacts/predictions/FD001.csv.gz",
                "artifacts/predictions/FD004.csv.gz",
            ],
            "exporter": "scripts/export_nasa_demo.py",
        },
        "warningRule": {
            "horizonCycles": HORIZON,
            "consecutivePredictions": PERSISTENCE,
            "comparison": "predictedRul <= horizonCycles",
            "confirmation": "rolling, not latched",
        },
        "trajectories": trajectories,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(payload, separators=(",", ":")) + "\n", encoding="utf-8")
    print(f"Exported {len(trajectories)} trajectories to {args.output}")


if __name__ == "__main__":
    main()
