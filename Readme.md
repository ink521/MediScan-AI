# MediScan AI 🚀

A professional-grade Full-Stack Cloud-Native Breast Cancer Diagnostic System. This project utilizes Deep Learning and Gradient Boosting to analyze ultrasound scans and provide immediate diagnostic feedback.

## 🌟 Key Features
- **AI Diagnostics:** Hybrid architecture using EfficientNetV2-S for feature extraction and XGBoost for classification.
- **Cloud Infrastructure:** Backend containerized with **Docker** and deployed on **Hugging Face Spaces**.
- **Mobile Integration:** React Native (Expo) frontend providing a seamless mobile experience.
- **Real-time Processing:** Integrated image enhancement (CLAHE) and automated clinical findings generation.

---

## 🛠️ Tech Stack

### Backend & AI
- **Runtime:** Node.js (Express), Python 3.11
- **AI Libraries:** TensorFlow, Keras, XGBoost, Scikit-Learn
- **Deployment:** Docker, Hugging Face Spaces

### Frontend
- **Framework:** React Native (Expo)
- **Networking:** Axios (REST API)
- **Distribution:** Standalone APK via EAS Build

---

## 🏗️ Architecture


The system follows a decoupled architecture:
1. **Frontend:** React Native app collects ultrasound scans.
2. **API:** Images are transmitted to the cloud via a secure REST endpoint.
3. **Inference Engine:** A Node.js server spawns a Python child process to run the AI pipeline.
4. **Output:** The mobile app receives a JSON response containing the Verdict, Confidence Score, and Dynamic Findings.

---

## 🚀 Getting Started

### 1. Backend Setup
The backend is designed to run in a Docker container.
```bash
# Clone the repository
git clone [https://github.com/yourusername/OncoScan-AI.git](https://github.com/yourusername/OncoScan-AI.git)

# Navigate to backend
cd backend

# Build and run Docker (or run locally)
node server.js

# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development
npx expo start