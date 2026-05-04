
import sys
import cv2
import numpy as np
import tensorflow as tf
import joblib
import os
import tf_keras as keras

# i3 Stability Settings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['TF_USE_LEGACY_KERAS'] = '1'
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def apply_clahe(image):
    lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    cl = clahe.apply(l)
    limg = cv2.merge((cl, a, b))
    return cv2.cvtColor(limg, cv2.COLOR_LAB2RGB)

def run_inference(img_path):
    try:
        # 1. Load Assets
        class_names = np.load(os.path.join(BASE_DIR, 'model', 'class_names.npy'), allow_pickle=True)
        xgb_pipe = joblib.load(os.path.join(BASE_DIR, 'model', 'xgboost_pipeline.joblib'))

        # 2. Build Backbone
        backbone = keras.applications.EfficientNetV2S(
            include_top=False, weights=None, input_shape=(256, 256, 3), pooling='avg'
        )
        h5_path = os.path.join(BASE_DIR, 'model', 'feature_extractor_model.h5')
        backbone.load_weights(h5_path, by_name=True, skip_mismatch=True)

        # 3. Image Preprocessing (THE FIX IS HERE)
        img_bgr = cv2.imread(img_path)
        if img_bgr is None: raise Exception("Image not found")
        
        # FIX A: Convert BGR to RGB (Crucial for EfficientNet trained in Colab)
        img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
        
        img_resized = cv2.resize(img_rgb, (256, 256))
        img_clahe = apply_clahe(img_resized) 
        
        # FIX B: Cast to float16 to match your Colab Mixed Precision policy
        img_array = np.expand_dims(img_clahe, axis=0).astype(np.float16)
        
        # Apply the standard EfficientNet preprocessing
        img_preprocessed = keras.applications.efficientnet_v2.preprocess_input(img_array)

        # 4. Predict Features
        features = backbone.predict(img_preprocessed, verbose=0)
        
        # Cast back to float32 for the XGBoost pipeline
        features_final = features.astype(np.float32)

        # 5. XGBoost Classification
        prediction_idx = xgb_pipe.predict(features_final)[0]
        probs = xgb_pipe.predict_proba(features_final)
        
        # Result for Node.js
        print(f"{class_names[prediction_idx]},{np.max(probs)*100:.1f}")

    except Exception as e:
        print(f"Error: {str(e)},0")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        run_inference(sys.argv[1])