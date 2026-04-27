import yaml
from ultralytics import YOLO
from pathlib import Path

def load_yaml(path):
    with open(path, 'r') as f:
        return yaml.safe_load(f)

def calculate_test_metrics(model_path, data_yaml_path, conf=0.25, iou=0.5, device='cpu'):
    model = YOLO(model_path)
    data = load_yaml(data_yaml_path)

    if 'test' not in data:
        raise ValueError("data.yaml must include a 'test' entry pointing to your test images folder")

    results = model.val(
        data=data_yaml_path,
        conf=conf,
        iou=iou,
        device=device,
        split='test',
        plots=True,
        project="runs/val",
        name="test_metrics"
    )

    print("\n" + "="*40)
    print("TEST DATASET METRICS")
    print("="*40)
    print(f"mAP50:      {results.box.map50:.4f}")
    print(f"mAP50-95:   {results.box.map:.4f}")
    print(f"Precision:  {results.box.mp:.4f}")
    print(f"Recall:     {results.box.mr:.4f}")
    print("="*40 + "\n")

    print(f"Charts saved to: {Path('runs/val/test_metrics').resolve()}")
    return results

if __name__ == "__main__":
    model_path = "runs/detect/train2/weights/best.pt"
    data_yaml_path = "data.yaml"
    calculate_test_metrics(model_path, data_yaml_path)