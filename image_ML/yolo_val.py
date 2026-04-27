from ultralytics import YOLO

model = YOLO('runs/detect/train2/weights/best.pt')
results = model.val(data='data.yaml', split='val')

print("Summary metrics:")
print(f"Mean precision: {results.box.mp:.3f}")
print(f"Mean recall: {results.box.mr:.3f}")
print(f"mAP@0.5: {results.box.map50:.3f}")
print(f"mAP@0.5:0.95: {results.box.map:.3f}")

# For per-class stats:
species_list = results.names
for i, name in enumerate(species_list):
    print(f"Class: {name}   Precision: {results.box.p[i]:.3f}   Recall: {results.box.r[i]:.3f}   AP@0.5: {results.box.ap50[i]:.3f}   AP@0.5:0.95: {results.box.ap[i]:.3f}")