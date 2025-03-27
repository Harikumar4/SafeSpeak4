import torch
import torchaudio
from transformers import Wav2Vec2ForSequenceClassification
import os
from dotenv import load_dotenv

load_dotenv()

# Set Hugging Face token (if needed)


HF_TOKEN = os.getenv("HF_TOKEN")

if HF_TOKEN is None:
    raise ValueError("HF_TOKEN not found. Please check your .env file.")


# Load model
model_name = "MelodyMachine/Deepfake-audio-detection-V2"
model = Wav2Vec2ForSequenceClassification.from_pretrained(model_name, token=HF_TOKEN)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

print(model.config.id2label)


# Function to load and preprocess audio
# Function to load and preprocess audio
def load_audio(file_path):
    waveform, sr = torchaudio.load(file_path)

    # Convert stereo to mono
    if waveform.shape[0] > 1:
        waveform = torch.mean(waveform, dim=0, keepdim=True)

    # Resample to 16kHz
    if sr != 16000:
        resampler = torchaudio.transforms.Resample(orig_freq=sr, new_freq=16000)
        waveform = resampler(waveform)

    # Ensure shape is (batch_size, num_samples)
    waveform = waveform.squeeze(0)  # Remove extra channel dimension if exists
    waveform = waveform.unsqueeze(0)  # Add batch dimension: (1, num_samples)

    return waveform.to(device)



# Load an audio file
audio_path = "normal-rec.wav"  # Change this to your actual file
input_values = load_audio(audio_path)

# Predict
with torch.no_grad():
    logits = model(input_values).logits
    probabilities = torch.nn.functional.softmax(logits, dim=-1)

# Get the prediction
label_map = {0: "Fake", 1: "Real"}

predicted_class = torch.argmax(probabilities, dim=-1).item()
confidence = probabilities[0, predicted_class].item()

print(f"Prediction: {label_map[predicted_class]} (Confidence: {confidence:.2f})")
