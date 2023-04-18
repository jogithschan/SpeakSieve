import whisper
import datetime
import subprocess
import torch
import pyannote.audio
from pyannote.audio.pipelines.speaker_verification import PretrainedSpeakerEmbedding
from pyannote.audio import Audio
from pyannote.core import Segment
import wave
import contextlib
from sklearn.cluster import AgglomerativeClustering
import numpy as np
import json

def transcribe_audio(path, num_speakers=2, language='English', model_size='small'):
    model_name = model_size
    if language == 'English' and model_size != 'large':
        model_name += '.en'
    embedding_model = PretrainedSpeakerEmbedding("speechbrain/spkrec-ecapa-voxceleb")
    if path[-3:] != 'wav':
        subprocess.call(['ffmpeg', '-i', path, 'audio.wav', '-y'])
        path = 'audio.wav'
    model = whisper.load_model(model_size)
    result = model.transcribe(path)
    segments = result["segments"]
    with contextlib.closing(wave.open(path, 'r')) as f:
        frames = f.getnframes()
        rate = f.getframerate()
        duration = frames / float(rate)
    audio = Audio()

    def segment_embedding(segment):
        start = segment["start"]
        end = min(duration, segment["end"])
        clip = Segment(start, end)
        waveform, sample_rate = audio.crop(path, clip)
        return embedding_model(waveform[None])

    embeddings = np.zeros(shape=(len(segments), 192))
    for i, segment in enumerate(segments):
        embeddings[i] = segment_embedding(segment)

    embeddings = np.nan_to_num(embeddings)

    clustering = AgglomerativeClustering(num_speakers).fit(embeddings)
    labels = clustering.labels_
    for i in range(len(segments)):
        segments[i]["speaker"] = 'SPEAKER ' + str(labels[i] + 1)

    data = []
    for (i, segment) in enumerate(segments):
        if i == 0 or segments[i - 1]["speaker"] != segment["speaker"]:
            data.append({
                "speaker": segment["speaker"],
                "start_time": round(segment["start"], 3),
                "text": segment["text"][1:] + ' '
            })
        else:
            data[-1]["text"] += segment["text"][1:] + ' '

    return json.dumps(data, indent=2)
