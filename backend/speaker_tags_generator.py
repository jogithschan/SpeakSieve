import whisper
import whisperx
import datetime
import subprocess
import torch
import pyannote.audio
from pyannote.audio.pipelines.speaker_verification import PretrainedSpeakerEmbedding
from pyannote.audio import Audio
from pyannote.core import Segment
import wave
import contextlib
import csv
from sklearn.cluster import AgglomerativeClustering
import numpy as np
import json
from pydub import AudioSegment

def csv_to_json(csv_path):
    with open(csv_path, 'r') as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    return json.dumps(rows)


def time(secs):
  return datetime.timedelta(seconds=round(secs))

def transcribe_audio(path, num_speakers=2, language='English', model_size='small'):
    print(f"Runnig model with the params: \nNumber of speakers: {num_speakers} \nLanguage: {language} \nModel Size: {model_size}")

    device = "cuda" if torch.cuda.is_available() else "cpu"
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


    model_a, metadata = whisperx.load_align_model(language_code=result["language"], device=device)

    result_aligned = whisperx.align(segments, model_a, metadata, path, device)

    words = result_aligned["word_segments"]

    with open('transcript-word.csv', mode='w', newline='') as file:
        writer = csv.writer(file)

        for (i, segment) in enumerate(words):
            row = [str(segment["start"]), str(segment["end"]), segment["text"]]

            writer.writerow(row)


    with contextlib.closing(wave.open(path,'r')) as f:
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


    f = open("transcript.txt", "w")

    for (i, segment) in enumerate(segments):
        f.write("\n" + segment["speaker"] + ' ' + str(time(segment["start"])) + ' ' + str(time(segment["end"])) + '\n')
        f.write(segment["text"][1:] + ' ')
    f.close()

    with open('transcript.csv', mode='w', newline='') as file:
    # Create a CSV writer object
        writer = csv.writer(file)

        for (i, segment) in enumerate(segments):
            print(segment["text"][1:])
            
            row = [segment["speaker"], str(segment["start"]), str(segment["end"]), segment["text"][1:]]

            writer.writerow(row)

    rows = []
    with open('transcript.csv') as csv_file:
        reader = csv.reader(csv_file, delimiter=',')
        rows = [row for row in reader]

    data = []
    for row in rows:
        obj = {
            "speaker": row[0],
            "start_time": row[1],
            "end_time": row[2],
            "text": row[3]
        }
        
        data.append(obj)

    audio = AudioSegment.from_file('audio_files/original_audio.mp3')
    for i, obj in enumerate(data):
        
        start_time = float(obj["start_time"]) * 1000
        end_time = float(obj["end_time"]) * 1000
        part = audio[start_time:end_time]
        
        audio_part = f"trascript-part-{i+1}.mp3"
        audio_path = "audio_files/" + audio_part

        data[i]['audio_file'] = audio_part
        part.export(audio_path, format="mp3")
    
    return json.dumps(data, indent=2)
