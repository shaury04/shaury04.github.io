---
title: Turbofan Predictive Maintenance
description: A leakage-safe comparison of lifecycle, XGBoost, and 1D CNN models on NASA-simulated C-MAPSS trajectories.
eyebrow: Independent project · NASA C-MAPSS
role: Data pipeline, modeling, validation, warning evaluation
period: "2026"
stack:
  - Python
  - XGBoost
  - PyTorch
  - scikit-learn
---

## The problem

How early can remaining useful life be predicted reliably, and how does performance change as operating conditions and fault modes become more complex?

I built a reproducible benchmark over 265,000 sensor cycles from 1,416 NASA-simulated turbofan trajectories. C-MAPSS contains simulated degradation data—not telemetry from operational aircraft—and this project is neither a NASA role nor a deployed safety system.

## My contribution

I built the data pipeline, causal feature engineering, model comparison, and warning evaluation. The project compares an age-only baseline, XGBoost, and a compact 1D CNN under the same evaluation contract.

## Methods: validation before modeling

Rows from one engine are correlated. A random row split could put different cycles from the same trajectory into training and validation, making performance look better than it would on an unseen engine. Hyperparameters were selected with three-fold GroupKFold on FD001, grouped by engine, then frozen across subsets. NASA’s test engines were reserved for final evaluation.

Tabular deltas and rolling features use only the current and preceding cycles. Sequence windows stop at engine boundaries and are left-padded for short histories. Preprocessing is fit on training engines only. Each of the four C-MAPSS subsets is trained independently.

## Results: model comparison

The benchmark compares an age-only lifecycle baseline, leakage-safe XGBoost, and a compact 1D CNN. XGBoost reduced endpoint remaining-useful-life MAE by 52% on FD001 and 49% on FD004 relative to the lifecycle baseline.

The CNN was effectively tied on FD001 and FD002 and worse on FD003 and FD004. That negative result is useful: learned temporal machinery did not consistently justify its additional training and debugging cost, so XGBoost remained the preferred model.

## From a prediction to a warning

RUL is the estimated number of operating cycles remaining before the simulated failure endpoint. A 50-cycle warning is confirmed only after three consecutive XGBoost predictions at or below 50 cycles. The rule is fixed rather than learned and suppresses isolated one-cycle threshold crossings.

Across the four subsets, XGBoost detected 73.8–89.7% of eligible engines, with 32–49.5 cycles of median confirmed warning lead and 5–12% premature-alert rates. Detection recall includes only test engines whose observed trajectories reach the evaluated 50-cycle horizon; premature-alert rate uses all test engines.

## Limitations

- C-MAPSS has no authoritative degradation-onset labels, so these are failure-horizon warnings rather than fault-onset detections.
- Reconstructed ground-truth RUL is retrospective evaluation information, never a model input.
- Cross-subset differences describe benchmark difficulty, not transfer learning or a causal effect.
- TreeSHAP describes model behavior, not engine physics or causal sensor relationships.
- The results do not establish a production maintenance policy or aircraft-safety performance.
