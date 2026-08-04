import json
from pathlib import Path
import pandas as pd


def load_and_flatten_data(raw_dir: Path) -> pd.DataFrame:
    records = []

    for file_path in raw_dir.glob("*.json"):
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        account_email = data.get("account", "unknown")

        categories = [
            "interviews",
            "rejected_after_interview",
            "rejected",
            "applied_no_reply",
            "micro1_ai",
            "spam",
        ]

        for cat in categories:
            items = data.get(cat, [])
            if isinstance(items, list):
                for item in items:
                    records.append(
                        {
                            "account": account_email,
                            "category": cat,
                            "subject": (
                                item.get("subject", "")
                                if isinstance(item, dict)
                                else str(item)
                            ),
                            "sender": (
                                item.get("sender", "")
                                if isinstance(item, dict)
                                else ""
                            ),
                            "preview": (
                                item.get("preview", "")
                                if isinstance(item, dict)
                                else ""
                            ),
                            "date": (
                                item.get("date", "")
                                if isinstance(item, dict)
                                else ""
                            ),
                        }
                    )

    return pd.DataFrame(records)


if __name__ == "__main__":
    raw_dir = Path("data/raw")
    output_path = Path("data/processed/applications.csv")

    output_path.parent.mkdir(parents=True, exist_ok=True)

    df = load_and_flatten_data(raw_dir)
    df.to_csv(output_path, index=False)

    print("Data Processing Complete!")
    print(f"Total Processed Records: {len(df)}")
    print(f"Saved to: {output_path}\n")
    print("Category Breakdown:")
    print(df["category"].value_counts())