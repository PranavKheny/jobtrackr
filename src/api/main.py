import logging
import joblib
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel, Field
from pathlib import Path

# 1. Configure standard logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# 2. Setup dynamic paths
BASE_DIR = Path(__file__).resolve().parent.parent.parent
MODEL_PATH = BASE_DIR / "src" / "models" / "text_classifier.pkl"

# 3. Lifespan manager: Attach model strictly to app.state (No global variables)
@asynccontextmanager
async def lifespan(app: FastAPI):
    if MODEL_PATH.exists():
        logger.info(f"Loading model from {MODEL_PATH}...")
        app.state.classifier = joblib.load(MODEL_PATH)
    else:
        logger.warning(f"Model artifact not found at {MODEL_PATH}. Run train.py first.")
        app.state.classifier = None
    
    yield # Server is running
    
    # Clean up resources on shutdown
    app.state.classifier = None

# 4. Initialize FastAPI
app = FastAPI(
    title="JobTrackr ML Inference API",
    description="Production API for classifying job application emails.",
    version="1.0.0",
    lifespan=lifespan
)

# 5. Define Data Schemas
class PredictRequest(BaseModel):
    subject: str = Field(default="", description="The subject line of the email")
    preview: str = Field(default="", description="The body or preview text of the email")

class PredictResponse(BaseModel):
    category: str = Field(..., description="The predicted application category")

# 6. Define Endpoints
@app.get("/health")
def health_check(request: Request):
    """Check if the API is alive and the model is loaded."""
    return {
        "status": "healthy",
        "model_loaded": getattr(request.app.state, "classifier", None) is not None
    }

@app.post("/predict", response_model=PredictResponse)
def predict(request: Request, payload: PredictRequest):
    """Take email text, combine it, and return a predicted category."""
    classifier = getattr(request.app.state, "classifier", None)
    
    if not classifier:
        raise HTTPException(status_code=503, detail="Model is currently unavailable.")

    # Combine text exactly how it was done during training
    combined_text = f"{payload.subject} {payload.preview}"

    try:
        prediction = classifier.predict([combined_text])[0]
        return PredictResponse(category=prediction)
    except Exception as e:
        logger.error(f"Inference error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal inference error")