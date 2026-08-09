import os
import joblib
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

# 1. Setup absolute paths so the server can run from anywhere
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "text_classifier.pkl")

# Global dictionary to hold our model in memory
ml_models = {}

# 2. Lifespan manager: Loads the model into memory exactly ONCE when the server starts
@asynccontextmanager
async def lifespan(app: FastAPI):
    if os.path.exists(MODEL_PATH):
        print(f"Loading model from {MODEL_PATH}...")
        ml_models["classifier"] = joblib.load(MODEL_PATH)
    else:
        print(f"Warning: Model artifact not found at {MODEL_PATH}. Run train.py first.")
    
    yield # Server is running
    
    # Clean up resources on shutdown
    ml_models.clear()

# 3. Initialize FastAPI
app = FastAPI(
    title="JobTrackr ML Inference API",
    description="Production API for classifying job application emails.",
    version="1.0.0",
    lifespan=lifespan
)

# 4. Define Data Schemas (Input/Output Validation)
class PredictRequest(BaseModel):
    subject: str = Field(default="", description="The subject line of the email")
    preview: str = Field(default="", description="The body or preview text of the email")

class PredictResponse(BaseModel):
    category: str = Field(..., description="The predicted application category")

# 5. Define Endpoints
@app.get("/health")
def health_check():
    """Check if the API is alive and the model is loaded."""
    return {
        "status": "healthy",
        "model_loaded": "classifier" in ml_models
    }

@app.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest):
    """Take email text, combine it, and return a predicted category."""
    classifier = ml_models.get("classifier")
    
    if not classifier:
        raise HTTPException(status_code=503, detail="Model is currently unavailable.")

    # Combine text exactly how it was done during training in train.py
    combined_text = f"{request.subject} {request.preview}"

    try:
        # The Scikit-Learn pipeline expects an iterable of strings
        prediction = classifier.predict([combined_text])[0]
        return PredictResponse(category=prediction)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")