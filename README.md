```md
# 🛡️ TGG1: AI Voice Phishing Detector  

[![GlitchCon](https://img.shields.io/badge/Created%20During-GlitchCon-blue)](#)  

An AI-powered tool to detect fraudulent phone calls and voicemails using speech analysis and real-time transcription.  

---

## 📌 Problem Statement  

### **Context**  
Voice phishing (vishing) scams use AI-generated voices to trick victims. Fraudsters manipulate human trust using deepfake voices and automated calls.  

### **Challenge**  
Develop an AI-powered tool that detects fraudulent phone calls and voicemails, preventing users from falling victim to scams.  

---

## 🚀 Features  

✅ AI speech analysis to detect scam patterns  
✅ Real-time transcription with risk scoring  
✅ Multi-language fraud detection  
✅ Predictive fraud alerts & user training  
✅ Integration with call filtering systems  

---

## 🏗️ Tech Stack  

- **Frontend:** React  
- **Backend:** Flask + WebSockets  
- **Machine Learning:** Whisper, Mistral-7B, Transformers, Groq API  
- **Audio Processing:** Sounddevice, Torchaudio  

---

## 📂 Project Structure  

```
TGG1-Voice-Phishing-Detector/
│── backend/                 # Flask API & WebSockets for ML processing  
│── frontend/                # React-based UI for real-time feedback  
│── models/                  # ML models for transcription & fraud detection  
│── audio_segments/          # Stored audio clips  
│── transcriptions/          # Stored transcriptions  
│── fraud_analysis/          # Stored fraud analysis reports  
│── .env                     # Environment variables (Groq & HF Tokens)  
│── requirements.txt         # Python dependencies  
│── README.md                # Project documentation  
```

---

## 🔧 Installation  

### 1️⃣ Backend Setup  

**Step 1: Clone the Repository**  
```bash
git clone https://github.com/your-repo/TGG1-Voice-Phishing-Detector.git
cd TGG1-Voice-Phishing-Detector/backend
```

**Step 2: Install Dependencies**  
```bash
pip install -r requirements.txt
```

**Step 3: Set Up Environment Variables**  
Create a `.env` file in the `backend/` directory and add your keys:  
```
HF_TOKEN=your_huggingface_token
GROQ_API_KEY=your_groq_api_key
```

**Step 4: Run the Flask Server**  
```bash
python app.py
```
(Default port: `5000`)

---

### 2️⃣ Frontend Setup  

**Step 1: Navigate to Frontend**  
```bash
cd ../frontend
```

**Step 2: Install Dependencies**  
```bash
npm install
```

**Step 3: Start the React App**  
```bash
npm start
```
(Default port: `3000`)

---

## 🔥 Usage  

1️⃣ **Start the Flask server** (`python app.py`)  
2️⃣ **Run the React app** (`npm start`)  
3️⃣ **Speak into your microphone** → real-time transcription starts  
4️⃣ **Fraud detection results** are displayed with a confidence score  

---

## 📜 API Endpoints  

| Endpoint         | Method | Description |
|-----------------|--------|-------------|
| `/start`        | `POST` | Start real-time recording |
| `/stop`         | `POST` | Stop recording & analyze |
| `/fraud-check`  | `POST` | Classifies text as fraud/safe |

---

## 📌 Future Enhancements  

- 📡 **Integrate with VoIP systems** for real-time fraud detection  
- 🤖 **Improve AI models** with larger datasets  
- 📊 **Generate fraud reports** for better analytics  

---

## 🤝 Contributors  

- **Srihari Kanakaraj**
- **Hari Kumar**
- **Pranav Sajiv**
- **Griffin Jolly**

---

## 📜 License  

This project is open-source under the **MIT License**.  

---
