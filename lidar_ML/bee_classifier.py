# bee_classifier.py

import joblib
from feature_extractor import extract_features


class BeeClassifier:

    def __init__(self, model_path):

        # load trained model
        self.model = joblib.load(model_path)

    def predict(self, event):

        # extract features from event
        features = extract_features(event)

        # remove event_id and label
        numeric_features = features[1:-1]

        # model expects 2D input
        prediction = self.model.predict([numeric_features])[0]
        probability = self.model.predict_proba([numeric_features])[0]

        bee_prob = probability[1]

        if prediction == 1:
            label = "bee"
        else:
            label = "not_bee"

        return label, bee_prob