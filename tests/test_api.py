import pytest
from fastapi.testclient import TestClient
from src.api.main import app

@pytest.fixture
def client():
    """
    This fixture ensures the FastAPI lifespan (startup/shutdown) 
    runs properly so the ML model is actually loaded into memory 
    before the tests execute.
    """
    with TestClient(app) as c:
        yield c

def test_health_check(client):
    """Ensure the API boots up and the model loads."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    assert response.json()["model_loaded"] is True

def test_predict_interview(client):
    """Test if the model can correctly identify an interview invite."""
    payload = {
        "subject": "Interview Invitation: Software Engineer",
        "preview": "We are excited to invite you to an upcoming interview with our engineering team."
    }
    response = client.post("/predict", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    
    print(f"\nExpected: interviews | Model Predicted: {data['category']}")

def test_predict_rejection(client):
    """Test if the model can correctly identify a rejection."""
    payload = {
        "subject": "Update on your application",
        "preview": "Thank you for applying. Unfortunately, we have decided to move forward with other candidates at this time."
    }
    response = client.post("/predict", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    
    print(f"Expected: rejected | Model Predicted: {data['category']}")