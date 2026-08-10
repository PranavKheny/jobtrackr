# JobTrackr

An end-to-end machine learning pipeline and API designed to classify and track job application lifecycles from text streams. 

This repository demonstrates production-grade MLOps practices, focusing on environment reproducibility, security, and automated deployment pipelines.

---

## System Architecture

* **Data Versioning:** Datasets are decoupled from version control and managed via Data Version Control (DVC) to maintain an immutable data history.
* **ML Pipeline:** Built with Python, Pandas, and Scikit-Learn. The pipeline utilizes TF-IDF vectorization and a class-balanced Random Forest classifier.
* **Experiment Tracking:** Integrated with MLflow to automatically track hyperparameters, validation metrics, and serialized model artifacts.
* **Inference API:** A FastAPI application exposing a /predict endpoint. State management is explicitly defined to avoid global variables and ensure thread safety.
* **Containerization:** Orchestrated via Docker Compose. The API image runs on a restricted, non-root user account to adhere to zero-trust security principles.
* **CI/CD Pipeline:** Automated via GitHub Actions to enforce static code analysis (Ruff), contract testing (Pytest), and automated Docker image compilation.

---

## Local Development

### 1. Environment Setup
Dependencies are strictly pinned to ensure complete environment reproducibility.

```bash
python -m venv .venv
# Activate the virtual environment
# Windows: .\.venv\Scripts\Activate.ps1
# Mac/Linux: source .venv/bin/activate

pip install --upgrade pip
pip install -r requirements.txt
```

### 2. Retrieve Data
Datasets are tracked via DVC. Pull the latest data snapshot before running the pipeline:

```bash
dvc pull
```

### 3. Run the ML Pipelines
Process the raw data and train the classification model. Metrics and artifacts will be logged locally to MLflow.

```bash
python src/pipelines/prepare_data.py
python src/pipelines/train.py
```

### 4. Start the Inference Server
Initialize the FastAPI service using the provided Docker configuration:

```bash
docker-compose up --build
```
The API will be available at http://localhost:8000. You can verify the model status by navigating to http://localhost:8000/health.

---

## Testing and Security

* **Testing:** Model evaluation is handled during the training phase via MLflow. Pipeline contract and robustness testing is executed via Pytest. Run tests locally using `pytest tests/`.
* **Security Execution:** The containerized API runs under a strictly defined non-root user and group.
* **Dependency Management:** All packages in requirements.txt are pinned to specific versions to prevent pipeline drift and mitigate supply chain vulnerabilities.