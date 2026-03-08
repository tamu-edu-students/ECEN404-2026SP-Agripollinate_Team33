import os
import json
from bee_classifier import BeeClassifier

DATASET_PATH = "test_dataset"
MODEL_PATH = "models/bee_model.pkl"

classifier = BeeClassifier(MODEL_PATH)

correct = 0
total = 0

print(f"\nTesting Model: {MODEL_PATH}\n")
print(f"{'FILE':40} {'ACTUAL':10} {'PREDICTED':10} {'BEE_PROB':10} RESULT")
print("-"*80)

for filename in os.listdir(DATASET_PATH):

    if not filename.endswith(".json"):
        continue

    filepath = os.path.join(DATASET_PATH, filename)

    with open(filepath, "r") as f:
        event = json.load(f)

    actual = event["label"]

    prediction, prob = classifier.predict(event)

    result = "✓"

    if prediction != actual:
        result = "✗"
    else:
        correct += 1

    total += 1

    print(f"{filename:40} {actual:10} {prediction:10} {prob:0.2f}      {result}")

print("\n" + "-"*80)

accuracy = correct / total

print(f"Total events: {total}")
print(f"Correct predictions: {correct}")
print(f"Accuracy: {accuracy:.2%}")