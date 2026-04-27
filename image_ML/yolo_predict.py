from ultralytics import YOLO
model = YOLO('runs/detect/train2/weights/best.pt')
results = model.predict(
    source="demo_test_set",
    save=True,          # save annotated images
    conf=0.25,          # confidence threshold (lower = more detections)
    iou=0.6,            # NMS threshold
    save_txt=True,      # also save predicted labels as .txt files
)