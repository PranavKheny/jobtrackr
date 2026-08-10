import json
import logging
from pathlib import Path
import pandas as pd

# 1. Configure standard logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# 2. Resolve paths dynamically relative to the project root
BASE_DIR = Path(__file__).resolve().parent.parent.parent
RAW_DIR = BASE_DIR / "data" / "raw"
OUTPUT_PATH = BASE_DIR / "data" / "processed" / "applications.csv"

def load_and_flatten_data(raw_dir: Path) -> pd.DataFrame:
    records = []
    
    # Safety check
    if not raw_dir.exists():
        logger.warning(f"Raw data directory not found at: {raw_dir}")
        return pd.DataFrame()

    for file_path in raw_dir.glob("*.json"):
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        account_email = data.get("account", "unknown")
        categories = [
            "interviews", "rejected_after_interview", "rejected", 
            "applied_no_reply", "micro1_ai", "spam"
        ]

        for cat in categories:
            items = data.get(cat, [])
            if isinstance(items, list):
                for item in items:
                    records.append({
                        "account": account_email,
                        "category": cat,
                        "subject": item.get("subject", "") if isinstance(item, dict) else str(item),
                        "sender": item.get("sender", "") if isinstance(item, dict) else "",
                        "preview": item.get("preview", "") if isinstance(item, dict) else "",
                        "date": item.get("date", "") if isinstance(item, dict) else "",
                    })
                    
    return pd.DataFrame(records)

if __name__ == "__main__":
    logger.info("Starting data preparation pipeline...")
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

    df = load_and_flatten_data(RAW_DIR)
    
    if not df.empty:
        df.to_csv(OUTPUT_PATH, index=False)
        logger.info("Data Processing Complete!")
        logger.info(f"Total Processed Records: {len(df)}")
        logger.info(f"Saved to: {OUTPUT_PATH}")
        logger.info(f"Category Breakdown:\n{df['category'].value_counts().to_string()}")
    else:
        logger.error("No data was processed. Output DataFrame is empty.")