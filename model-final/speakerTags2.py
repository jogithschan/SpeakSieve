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

def time(secs):
  return datetime.timedelta(seconds=round(secs))


path = 'newname.mp3'

#set device
device = "cuda" if torch.cuda.is_available() else "cpu"

# set parameters - need frontend to change settings
num_speakers = 2 #{type:"integer"}

language = 'English' #['any', 'English']

model_size = 'small' #['tiny', 'base', 'small', 'medium', 'large']


model_name = model_size

if language == 'English' and model_size != 'large':
  model_name += '.en'

# embedding model for agglomerative clustering
embedding_model = PretrainedSpeakerEmbedding("speechbrain/spkrec-ecapa-voxceleb")

# convert audio file to wav if necessary
if path[-3:] != 'wav':
  subprocess.call(['ffmpeg', '-i', path, 'audio.wav', '-y'])
  path = 'audio.wav'

# load model with chosen size
model = whisper.load_model(model_size)

# transcribe the audio using the whisper model
result = model.transcribe(path)

# checkout segments from the model outputs
segments = result["segments"]

# print(segments)
# code for word-level timestamps
model_a, metadata = whisperx.load_align_model(language_code=result["language"], device=device)

# align whisper output
result_aligned = whisperx.align(segments, model_a, metadata, path, device)

words = result_aligned["word_segments"]

# print(words)

# f = open("transcript-word.txt", "w")

# for (i, segment) in enumerate(words):
#   # if i == 0 or segments[i - 1]["speaker"] != segment["speaker"]:
#   # f.write("\n" + str(time(segment["start"])) + ' ' + str(time(segment["end"])) + ' ' + segment["text"] )
#   f.write("\n" + str(segment["start"]) + ' ' + str(segment["end"]) + ' ' + segment["text"] )
# f.close()

with open('transcript-word.csv', mode='w', newline='') as file:
    # Create a CSV writer object
    writer = csv.writer(file)

    for (i, segment) in enumerate(words):
      row = [str(segment["start"]), str(segment["end"]), segment["text"]]

      writer.writerow(row)

# get framerate
with contextlib.closing(wave.open(path,'r')) as f:
  frames = f.getnframes()
  rate = f.getframerate()
  duration = frames / float(rate)

# create a new audio and embed the segments
audio = Audio()

# function to get embeddings in specific segment
def segment_embedding(segment):
  start = segment["start"]
  # Whisper overshoots the end timestamp in the last segment
  end = min(duration, segment["end"])
  clip = Segment(start, end)
  waveform, sample_rate = audio.crop(path, clip)
  return embedding_model(waveform[None])

# get embeddings using the loaded speechbrain embeddings
embeddings = np.zeros(shape=(len(segments), 192))
for i, segment in enumerate(segments):
  embeddings[i] = segment_embedding(segment)

embeddings = np.nan_to_num(embeddings)

# perform clustering on the embeddings for speaker identification
clustering = AgglomerativeClustering(num_speakers).fit(embeddings)
labels = clustering.labels_
for i in range(len(segments)):
  segments[i]["speaker"] = 'SPEAKER ' + str(labels[i] + 1)

# write the output to a txt file

f = open("transcript.txt", "w")

for (i, segment) in enumerate(segments):
  # if i == 0 or segments[i - 1]["speaker"] != segment["speaker"]:
  f.write("\n" + segment["speaker"] + ' ' + str(time(segment["start"])) + ' ' + str(time(segment["end"])) + '\n')
  f.write(segment["text"][1:] + ' ')
f.close()

with open('transcript.csv', mode='w', newline='') as file:
    # Create a CSV writer object
    writer = csv.writer(file)

    for (i, segment) in enumerate(segments):
      row = [segment["speaker"], str(segment["start"]), str(segment["end"]), segment["text"][1:]]

      writer.writerow(row)