import sys
import logging
from pathlib import Path
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, precision_recall_fscore_support
import mlflow
import mlflow.sklearn
import joblib

# 1. Configure standard logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# 2. Resolve paths dynamically relative to the project root
BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_PATH = BASE_DIR / "data" / "processed" / "applications.csv"
MODEL_DIR = BASE_DIR / "src" / "models"
MODEL_PATH = MODEL_DIR / "text_classifier.pkl"

# Schema Configuration
TEXT_COLUMN = "preview"  
LABEL_COLUMN = "category"

def main():
    logger.info("Starting ML training pipeline...")
    MODEL_DIR.mkdir(parents=True, exist_ok=True)

    # 3. Load the data with strict failure handling
    logger.info(f"Loading dataset from {DATA_PATH}...")
    if not DATA_PATH.exists():
        logger.error(f"Could not find {DATA_PATH}. Ensure prepare_data.py has been run.")
        sys.exit(1) # Explicitly fail so CI/CD catches it

    df = pd.read_csv(DATA_PATH)

    # Validate columns
    if TEXT_COLUMN not in df.columns or LABEL_COLUMN not in df.columns:
        logger.error(f"Required columns '{TEXT_COLUMN}' or '{LABEL_COLUMN}' not found.")
        logger.error(f"Available columns: {df.columns.tolist()}")
        sys.exit(1)

    df['subject'] = df['subject'].fillna("")
    df['preview'] = df['preview'].fillna("")
    
    X = df['subject'] + " " + df['preview']
    y = df[LABEL_COLUMN]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    mlflow.set_experiment("JobTrackr_Email_Classification")

    with mlflow.start_run():
        logger.info("Training TF-IDF + RandomForest pipeline...")
        
        pipeline = Pipeline([
            ('tfidf', TfidfVectorizer(max_features=5000, stop_words='english')),
            ('clf', RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced'))
        ])

        pipeline.fit(X_train, y_train)

        y_pred = pipeline.predict(X_test)
        
        accuracy = accuracy_score(y_test, y_pred)
        precision, recall, f1, _ = precision_recall_fscore_support(
            y_test, y_pred, average='weighted', zero_division=0
        )

        logger.info(f"Run Metrics -> Accuracy: {accuracy:.4f} | F1: {f1:.4f}")

        # Log to MLflow
        mlflow.log_param("model_type", "RandomForestClassifier")
        mlflow.log_param("tfidf_max_features", 5000)
        mlflow.log_param("rf_n_estimators", 100)
        mlflow.log_param("class_weight", "balanced")
        
        mlflow.log_metric("accuracy", accuracy)
        mlflow.log_metric("precision", precision)
        mlflow.log_metric("recall", recall)
        mlflow.log_metric("f1_score", f1)

        mlflow.sklearn.log_model(pipeline, "model")

        # Save model locally
        joblib.dump(pipeline, MODEL_PATH)
        logger.info(f"Local artifact saved to: {MODEL_PATH}")

if __name__ == "__main__":
    main()