# MediScan AI 🚀

An advanced, end-to-end cloud-native medical diagnostic system designed to analyze breast ultrasound scans. This application combines deep learning feature extraction with gradient boosting classification to provide immediate diagnostic verdicts with high precision.

---

## 🌟 Key Features

- **AI Diagnostics:** Hybrid architecture utilizing EfficientNetV2-S for feature extraction and XGBoost optimized with imbalanced-learn.
- **Serverless Cloud Backend:** Containerized deployment on Hugging Face Spaces ensuring 24/7 global uptime.
- **Mobile Application:** Built with React Native (Expo) and distributed as a standalone, side-loadable Android APK.
- **Image Processing:** Integrated CLAHE (Contrast Limited Adaptive Histogram Equalization) for enhanced scan visibility.
- **Dynamic Reporting:** Generates a full report including clinical findings, quadrant zone localization, and confidence scores.

---

## 🏗️ System Architecture

The application uses a decoupled microservices architecture:

```text
[Mobile Client (APK)] ---> (HTTPS REST) ---> [Hugging Face Backend (Node.js/Python)]
                                                     |
                                            [TensorFlow & XGBoost]
🛠️ Tech Stack
AI & Backend
Runtime: Node.js, Express, Python 3.11

ML Frameworks: TensorFlow, Keras, scikit-learn, XGBoost, imbalanced-learn

Cloud Platform: Hugging Face Spaces (Docker)

Frontend
Framework: React Native (Expo SDK, SDK 51+)

Networking: Axios, REST API

Build Tool: EAS (Expo Application Services)

📥 Prerequisites & Dependencies
Prerequisites
Before installing, ensure you have the following installed on your machine:

Node.js (v18 or higher)

Python (v3.11)

Git and EAS CLI (npm install -g eas-cli)

Backend Dependencies (requirements.txt for Python)
Plaintext
tf-keras
tensorflow-cpu
opencv-python-headless
numpy
joblib
xgboost
imbalanced-learn
dill
scikit-learn
scipy
pandas
Backend Dependencies (package.json for Node.js)
JSON
{
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "multer": "^1.4.5-lts.1"
  }
}
Frontend Dependencies (ScanAI Packages)
Bash
npx expo install axios expo-image-picker expo-status-bar react-native-safe-area-context @react-navigation/native @react-navigation/stack
🚀 Getting Started and Installation
1. Forking and Cloning the Repository
To fork the project:

Go to the GitHub repository: https://github.com/ink521/MediScan-AI

Click the Fork button in the top right corner.

Clone your forked repository to your local machine:

Bash
git clone [https://github.com/your-username/MediScan-AI.git](https://github.com/your-username/MediScan-AI.git)
cd MediScan-AI
2. Setting Up the Backend
Bash
# Navigate to the backend directory
cd ScanAI-Backend

# Install Node.js dependencies
npm install

# Install Python dependencies (Recommended to use a virtual environment)
pip install -r requirements.txt

# Ensure the models/ directory exists and contains:
# - feature_extractor_model.h5
# - xgboost_pipeline.joblib
# - class_names.npy

# Run the backend
node server.js
3. Setting Up the Frontend
Open a separate terminal window for the frontend application:

Bash
# Navigate to the frontend directory
cd ../ScanAI

# Install dependencies
npm install

# Start the Expo development server
npx expo start
Press a to run on an Android emulator, or scan the QR code using the Expo Go app on your physical device.

🌐 Cloud Deployment Configuration
Hugging Face Space (Backend)
The backend uses a Dockerfile exposed to port 7860. To point your mobile application to your deployed cloud backend, update the API_URL variable in DashboardScreen.js:

JavaScript
const API_URL = "[https://your-hugging-face-space.hf.space/api/upload-scan](https://your-hugging-face-space.hf.space/api/upload-scan)";
Mobile App Setup (EAS Build)
To build a standalone Android APK for sideloading:

Bash
# Log into your Expo account
eas login

# Build the binary for Android
eas build -p android --profile preview
🤝 Contribution Guidelines
We welcome contributions to MediScan AI:

Fork the repository.

Create a feature branch (git checkout -b feature/AmazingFeature).

Commit your changes (git commit -m 'feat: add some AmazingFeature').

Push to the branch (git push origin feature/AmazingFeature).

Open a Pull Request.
