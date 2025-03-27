import os
import queue
import sounddevice as sd
import vosk
import json
import time
import wave
import numpy as np
import threading
import groq
from flask import Flask
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")


if GROQ_API_KEY is None:
    raise ValueError("GROQ_API_KEY is not set in the .env file!")

# Configuration Constants
MODEL_PATH = r"C:\Users\harik\OneDrive\Desktop\vosk-model-small-en-us-0.15"
TEXT_OUTPUT_DIR = "transcriptions"
FRAUD_OUTPUT_DIR = "fraud_analysis"
AUDIO_OUTPUT_DIR = r"C:\Users\harik\OneDrive\Desktop\SafeSpeak-2\audio_segments"

# Groq API Setup
groq_client = groq.Client(api_key=GROQ_API_KEY)

# Flask and SocketIO Setup
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")

# Prepare directories
def prepare_directory(directory):
    os.makedirs(directory, exist_ok=True)

# Fraud Classification Function
def classify_fraud_with_groq(transcribed_text):
    if not transcribed_text:
        return "UNABLE TO PROCESS (No transcription)"

    prompt = f"""
    Carefully analyze this conversation transcript for potential fraud indicators:

    Transcript: "{transcribed_text}"

    Fraud Detection Criteria:
    1. Identify any suspicious language or requests
    2. Look for potential scam tactics
    3. Assess overall risk of fraudulent activity

    Provide ONLY:
    - FRAUD (X%) or SAFE (Y%)
    - Brief reason in 1-2 words
    """

    try:
        response = groq_client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            max_tokens=50
        )
        
        result = response.choices[0].message.content.strip()
        return result
    
    except Exception as e:
        return f"UNABLE TO PROCESS (Error: {str(e)})"

# Audio Recording Class
class AudioRecorder:
    def __init__(self, socketio):
        # Audio Recording Settings
        self.SAMPLE_RATE = 16000
        self.BLOCK_SIZE = 8000
        self.CHANNELS = 1
        self.SILENCE_THRESHOLD = 10
        self.SAVE_INTERVAL = 15
        self.AUDIO_SEGMENT_DURATION = 25

        # Buffers and Flags
        self.q = queue.Queue()
        self.is_recording = False
        self.transcription_buffer = []
        self.audio_buffer = []
        self.last_voice_time = time.time()
        self.last_fraud_check_time = time.time()
        self.socketio = socketio

        # Prepare directories
        prepare_directory(TEXT_OUTPUT_DIR)
        prepare_directory(FRAUD_OUTPUT_DIR)
        prepare_directory(AUDIO_OUTPUT_DIR)

        # Load Vosk model
        self.model = vosk.Model(MODEL_PATH)

    def callback(self, indata, frames, time, status):
        if status:
            print(status, flush=True)
        if indata.ndim > 1:
            indata = indata.flatten()
        audio_data = indata.astype(np.int16)
        self.q.put((bytes(audio_data), audio_data))

    def save_audio_segment(self, audio_data, sample_rate, filename):
        with wave.open(filename, 'wb') as wf:
            wf.setnchannels(self.CHANNELS)
            wf.setsampwidth(2)
            wf.setframerate(sample_rate)
            wf.writeframes(audio_data.tobytes())

    def process_audio(self):
        rec = vosk.KaldiRecognizer(self.model, self.SAMPLE_RATE)
        
        while self.is_recording:
            try:
                data, audio_data = self.q.get()
                self.audio_buffer.append(audio_data)
                
                if rec.AcceptWaveform(data):
                    result = json.loads(rec.Result())
                    text = result["text"].strip()
                    if text:
                        print("You said:", text)
                        self.transcription_buffer.append(text)
                        self.socketio.emit('transcription', {'transcription': text})
                        self.last_voice_time = time.time()

                current_time = time.time()
                buffer_duration = len(self.audio_buffer) * self.BLOCK_SIZE / self.SAMPLE_RATE
                
                # Handle audio segmentation
                if buffer_duration >= self.AUDIO_SEGMENT_DURATION:
                    timestamp = int(current_time)
                    audio_filename = os.path.join(AUDIO_OUTPUT_DIR, f"audio_segment_{timestamp}.wav")
                    
                    full_audio = np.concatenate(self.audio_buffer)
                    self.save_audio_segment(full_audio, self.SAMPLE_RATE, audio_filename)
                    print(f"🎵 Audio segment saved: {audio_filename}")
                    
                    self.audio_buffer = []

                # Fraud analysis and transcription
                if current_time - self.last_fraud_check_time >= self.SAVE_INTERVAL and self.transcription_buffer:
                    full_transcription = " ".join(self.transcription_buffer)
                    
                    # Save transcription
                    timestamp = int(current_time)
                    text_filename = os.path.join(TEXT_OUTPUT_DIR, f"transcription_{timestamp}.txt")
                    with open(text_filename, "w", encoding="utf-8") as f:
                        f.write(full_transcription)
                    
                    # Perform fraud classification
                    fraud_result = classify_fraud_with_groq(full_transcription)
                    self.socketio.emit('fraud_analysis', {'fraud_analysis': fraud_result})
                    
                    # Save fraud analysis
                    fraud_filename = os.path.join(FRAUD_OUTPUT_DIR, f"fraud_analysis_{timestamp}.txt")
                    with open(fraud_filename, "w", encoding="utf-8") as f:
                        f.write(fraud_result)
                    
                    # Reset buffers
                    self.transcription_buffer = []
                    self.last_fraud_check_time = current_time

                # Stop if silent for too long
                if current_time - self.last_voice_time > self.SILENCE_THRESHOLD:
                    self.stop_recording()
                    break

            except Exception as e:
                print(f"Processing error: {e}")
                break

    def start_recording(self):
        self.is_recording = True
        self.transcription_buffer = []
        self.audio_buffer = []
        self.last_voice_time = time.time()

        self.stream = sd.InputStream(
            samplerate=self.SAMPLE_RATE,
            blocksize=self.BLOCK_SIZE,
            dtype=np.int16,
            channels=self.CHANNELS,
            callback=self.callback
        )
        self.stream.start()

        # Start processing in a separate thread
        threading.Thread(target=self.process_audio, daemon=True).start()

    def stop_recording(self):
        self.is_recording = False
        if hasattr(self, 'stream'):
            self.stream.stop()
            self.stream.close()

# Create global audio recorder instance
audio_recorder = AudioRecorder(socketio)

# WebSocket Event Handlers
@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('message')
def handle_message(data):
    if data.get('action') == 'start_recording':
        audio_recorder.start_recording()
    elif data.get('action') == 'stop_recording':
        audio_recorder.stop_recording()

# Main Application Entry Point
if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000)