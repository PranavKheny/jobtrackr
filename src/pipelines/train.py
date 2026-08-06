import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, precision_recall_fscore_support
import mlflow
import mlflow.sklearn
import joblib

# Configuration
DATA_PATH = "data/processed/applications.csv"
MODEL_DIR = "src/models"
MODEL_PATH = os.path.join(MODEL_DIR, "text_classifier.pkl")

# Update these to match your applications.csv schema
TEXT_COLUMN = "preview"  
LABEL_COLUMN = "category"

def main():
    # 1. Ensure artifact directory exists
    os.makedirs(MODEL_DIR, exist_ok=True)

    # 2. Load the data
    print(f"Loading dataset from {DATA_PATH}...")
    try:
        df = pd.read_csv(DATA_PATH)
    except FileNotFoundError:
        print(f"Error: Could not find {DATA_PATH}. Ensure prepare_data.py has been run.")
        return

    # Validate columns
    if TEXT_COLUMN not in df.columns or LABEL_COLUMN not in df.columns:
        print(f"Error: Required columns '{TEXT_COLUMN}' or '{LABEL_COLUMN}' not found.")
        print(f"Available columns: {df.columns.tolist()}")
        return

    # Combine subject and preview for richer text features, handling missing values
    df['subject'] = df['subject'].fillna("")
    df['preview'] = df['preview'].fillna("")
    
    # Create a new combined text column
    X = df['subject'] + " " + df['preview']
    y = df[LABEL_COLUMN]

    # 3. Train-Test Split (stratified to handle class imbalances like spam/micro1_ai)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # 4. Initialize MLflow Experiment
    mlflow.set_experiment("JobTrackr_Email_Classification")

    with mlflow.start_run():
        print("Training TF-IDF + RandomForest pipeline...")
        
        # Build the pipeline
        pipeline = Pipeline([
            ('tfidf', TfidfVectorizer(max_features=5000, stop_words='english')),
            ('clf', RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced'))
        ])

        # Fit the model
        pipeline.fit(X_train, y_train)

        # 5. Evaluate the model
        y_pred = pipeline.predict(X_test)
        
        # Calculate metrics (weighted average accounts for class imbalance)
        accuracy = accuracy_score(y_test, y_pred)
        precision, recall, f1, _ = precision_recall_fscore_support(
            y_test, y_pred, average='weighted', zero_division=0
        )

        print(f"Run Metrics -> Accuracy: {accuracy:.4f} | F1: {f1:.4f}")

        # 6. Log to MLflow
        # Log Hyperparameters
        mlflow.log_param("model_type", "RandomForestClassifier")
        mlflow.log_param("tfidf_max_features", 5000)
        mlflow.log_param("rf_n_estimators", 100)
        mlflow.log_param("class_weight", "balanced")

        # Log Metrics
        mlflow.log_metric("accuracy", accuracy)
        mlflow.log_metric("precision", precision)
        mlflow.log_metric("recall", recall)
        mlflow.log_metric("f1_score", f1)

        # Log the actual model inside MLflow's artifact store
        mlflow.sklearn.log_model(pipeline, "model")

        # 7. Save model locally for FastAPI inference
        joblib.dump(pipeline, MODEL_PATH)
        print(f"Local artifact saved to: {MODEL_PATH}")

if __name__ == "__main__":
    main()