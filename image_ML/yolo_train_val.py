import os
import shutil
import random

# CONFIGURE THESE PATHS!
base_img_dir = os.path.expanduser('demo_insects_annotations/images')
base_lbl_dir = os.path.expanduser('demo_insects_annotations/labels')
split_base = os.path.expanduser('demo_insects_annotations')  # Output root

train_ratio = 0.8  # 80% train, 20% val

# Find all image files (assuming .jpg, .jpeg, .png)
img_files = []
for root, _, files in os.walk(base_img_dir):
    for fname in files:
        if fname.lower().endswith(('.jpg', '.jpeg', '.png')):
            img_files.append(os.path.join(root, fname))

print(f"Found {len(img_files)} images.")

# Shuffle and split
random.seed(42)
random.shuffle(img_files)
split_idx = int(len(img_files) * train_ratio)
train_imgs = img_files[:split_idx]
val_imgs = img_files[split_idx:]

splits = [('train', train_imgs), ('val', val_imgs)]

for split_name, imgs in splits:
    img_out_dir = os.path.join(split_base, 'images', split_name)
    lbl_out_dir = os.path.join(split_base, 'labels', split_name)
    os.makedirs(img_out_dir, exist_ok=True)
    os.makedirs(lbl_out_dir, exist_ok=True)

    for img_path in imgs:
        fname = os.path.basename(img_path)
        # Copy image
        shutil.copy2(img_path, os.path.join(img_out_dir, fname))

        # Copy matching label file if exists
        label_fname = os.path.splitext(fname)[0] + '.txt'
        label_search_path = []
        # Recursively search for label with same basename
        for root_, _, files_ in os.walk(base_lbl_dir):
            for f in files_:
                if f == label_fname:
                    label_file_full = os.path.join(root_, f)
                    label_search_path.append(label_file_full)
        if label_search_path:
            # Copy the first found (there should only be one)
            shutil.copy2(label_search_path[0], os.path.join(lbl_out_dir, label_fname))
        else:
            # No label for this file -- create an empty txt file (background)
            open(os.path.join(lbl_out_dir, label_fname), 'w').close()

print("Data successfully split and rearranged for YOLO.")
print(f"Train images: {len(train_imgs)}, Validation images: {len(val_imgs)}")
