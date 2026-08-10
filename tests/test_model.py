import pytest
import joblib
from pathlib import Path

# Resolve path to the trained model
BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "src" / "models" / "text_classifier.pkl"

VALID_CATEGORIES = [
    "interviews", "rejected_after_interview", "rejected", 
    "applied_no_reply", "micro1_ai", "spam"
]

@pytest.fixture
def model():
    """Fixture to load the model before tests run."""
    if not MODEL_PATH.exists():
        pytest.skip("Model not found. Run train.py first.")
    return joblib.load(MODEL_PATH)

def test_model_contract_valid_category(model):
    """Ensure the model always outputs a valid known category."""
    text = "Here is some random text about a job application."
    prediction = model.predict([text])[0]
    
    assert prediction in VALID_CATEGORIES, f"Model predicted an unknown category: {prediction}"

def test_model_robustness_empty_string(model):
    """Ensure the model does not crash when given empty input."""
    prediction = model.predict([""])[0]
    
    assert prediction in VALID_CATEGORIES
    assert isinstance(prediction, str)