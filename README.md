# JobTrackr — Automated Application Intelligence System

An end-to-end MLOps pipeline and application intelligence system designed to ingest, classify, and track job application lifecycles from raw email streams using machine learning.

---

## System Architecture

[ Raw Gmail Stream / Ingestion ]
               │
               ▼
   [ Data Pipeline (src/pipelines/prepare_data.py) ] ──> [ Processed CSV Dataset ]
                                                                   │
                                                                   ▼
   [ Model Inference Engine (FastAPI) ] <── [ Model Artifacts ] <── [ MLflow Training Pipeline ]
               │
               ▼
   [ Next.js Dashboard (apps/web) ]

---

## Tech Stack & Engineering Standards

* ML & Pipeline Engine: Python 3.13, Pandas, Scikit-Learn, MLflow
* API Backend: FastAPI, Pydantic (Strict Schema Validation), Uvicorn
* Frontend Dashboard: Next.js, TypeScript, TailwindCSS
* Containerization & Ops: Docker, Docker Compose, GitHub Actions CI
* Engineering Principles: 12-Factor App, Weak Supervision Labeling, Zero-Trust Secret Isolation

---

## Dataset & Classifier Status

* Dataset Volume: 1,122 historical email records parsed & categorized.
* Target Categories: applied_no_reply, rejected, interviews, rejected_after_interview, micro1_ai, spam.
* Experiment Tracking: Integrated with MLflow for parameter, metric, and model artifact logging.

---

## Quick Start (Local Development)

1. Environment Setup:
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt

2. Ingest & Prepare Data:
   python src/pipelines/prepare_data.py

3. Model Training & Metric Logging:
   python src/pipelines/train.py

---

## Security & Compliance
* All credentials, OAuth tokens (*.pickle), and user data dumps are strictly excluded via .gitignore.
* No hardcoded API keys or environment secrets reside in source control.