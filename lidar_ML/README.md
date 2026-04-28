# LiDAR Processing Subsystem

## Overview

The LiDAR Processing Subsystem is responsible for detecting motion near flowers and classifying interactions as either **pollinator** or **non-pollinator** events. It generates structured event data consumed by the rest of the AgriPollinate system, including the camera subsystem and the dashboard.

Rather than relying solely on raw LiDAR scans, this subsystem uses a machine learning approach to improve classification accuracy and robustness in real-world conditions.

---

## Key Responsibilities

- Use the LiDAR Event Metadata from SBC Subsystem
- Detect motion events from LiDAR scan data
- Extract meaningful features from each event
- Classify events using a trained Random Forest model
- Associate detections with flower locations using system metadata
- Generate heatmaps for dashboard visualization
- Support sensor fusion with camera classification results

---

## Machine Learning Approach

A **Random Forest classifier** is used to classify each detected motion event.

### Input Features

Features are extracted from LiDAR scan sequences by [`feature_extractor.py`](feature_extractor.py) and include:

- Motion intensity
- Duration of event
- Distance-based statistics
- Stability of movement
- Temporal behavior during the event

### Model Output

The model predicts one of two classes:

- `pollinator`
- `non-pollinator`

Training and inference logic is implemented across:

| File | Purpose |
|------|---------|
| [`train_model.py`](train_model.py) | Train and save the classifier |
| [`test_model.py`](test_model.py) | Evaluate model performance |
| [`bee_classifier.py`](bee_classifier.py) | Core inference logic |

---

## Dataset

The dataset contains approximately **270 labeled events** across the following classes:

- Bees
- Butterflies
- Ladybugs
- Beetles
- Grasshoppers
- Noise / environmental motion

Raw data is stored in the `dataset/` folder and processed into feature vectors before training.

---

## System Pipeline

```
LiDAR scan data received
        ↓
Motion event detected
        ↓
Features extracted (feature_extractor.py)
        ↓
ML model classifies event (bee_classifier.py)
        ↓
Result matched with flower metadata
        ↓
Heatmap contribution generated (heatmap_generator.py)
        ↓
Output sent to dashboard via communication layer
```

---

## Usage

### Train the Model

```bash
python train_model.py
```

This will:
1. Load the dataset
2. Extract features
3. Train the Random Forest classifier
4. Save the model to `models/`

### Evaluate the Model

```bash
python test_model.py
```

Reports on a held-out test set:
- Accuracy
- F1 score
- Per-class performance

---

## Folder Structure

```
lidar_ML/
│
├── bee_classifier.py        # Core classification and inference logic
├── feature_extractor.py     # Feature extraction from LiDAR scan sequences
├── heatmap_generator.py     # Heatmap generation for dashboard visualization
├── train_model.py           # Model training script
├── test_model.py            # Model evaluation script
│
├── dataset/                 # Raw labeled event data
├── features/                # Processed feature vectors
├── models/                  # Saved trained models (e.g. bee_model4.pkl)
└── __pycache__/             # Python cache (auto-generated)
```

---

## Output Integration

This subsystem outputs the following for downstream consumption:

| Output | Description |
|--------|-------------|
| Event classification | `pollinator` or `non-pollinator` |
| Confidence score | Model probability for the predicted class |
| Heatmap contribution | Per-flower detection weight |
| Event metadata | Structured data for downstream systems |

These outputs are consumed by:

- Camera / UI subsystem
- SBC communication layer
- Dashboard visualization system

---

## Design Improvements Over ECEN 403

- Switched from rule-based detection to ML classification
- Reduced reliance on camera subsystem for decision-making
- Improved robustness via cross-validation and dataset cleaning
- Added a structured feature extraction pipeline
- Improved generalization using real-world test events

---

## Future Improvements

- Expand dataset with more real-world insect variations
- Improve temporal modeling of motion patterns
- Add a lightweight deep learning model for comparison
- Optimize for real-time embedded deployment