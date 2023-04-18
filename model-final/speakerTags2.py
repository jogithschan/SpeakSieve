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


# path = '../model-final/newname.mp3'
path = 'hailhydra3.mp3'

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

# checkout segments from the model output
segments = result["segments"]

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
def time(secs):
  return datetime.timedelta(seconds=round(secs))

f = open("transcript.txt", "w")

for (i, segment) in enumerate(segments):
  if i == 0 or segments[i - 1]["speaker"] != segment["speaker"]:
    f.write("\n" + segment["speaker"] + ' ' + str(time(segment["start"])) + '\n')
  f.write(segment["text"][1:] + ' ')
f.close()

