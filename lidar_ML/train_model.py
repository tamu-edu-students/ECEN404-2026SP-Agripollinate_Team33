# train_model.py

import os
import json
import numpy as np
import joblib

from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from sklearn.utils import shuffle
from feature_extractor import extract_features

DATASET_PATH = "labeled_dataset"
MODEL_PATH = "models/bee_model.pkl"

def load_dataset():

    X = []
    y = []

    for filename in os.listdir(DATASET_PATH):

        if not filename.endswith(".json"):
            continue

        filepath = os.path.join(DATASET_PATH, filename)

        with open(filepath, "r") as f:
            event = json.load(f)

        # Skip events without labels
        if event["label"] is None:
            continue
        
        features = extract_features(event)

        # remove non-numeric fields
        numeric_features = features[1:-1]

        X.append(numeric_features)

        # convert label to number
        if event["label"] == "bee":
            y.append(1)
        else:
            y.append(0)

    return np.array(X), np.array(y)


def train():

    X, y = load_dataset()

    print("Dataset size:", len(X))
    print("Bee samples:", sum(y))
    print("Not bee samples:", len(y) - sum(y))

    X, y = shuffle(X, y, random_state=42)

    model = RandomForestClassifier(
        n_estimators=100,
        class_weight="balanced",
        random_state=42
    )

    model.fit(X, y)

    preds = model.predict(X)

    print("\nTraining Performance")
    print(classification_report(y, preds))

    os.makedirs("models", exist_ok=True)

    joblib.dump(model, MODEL_PATH)

    print("Model saved to:", MODEL_PATH)


if __name__ == "__main__":
    train()