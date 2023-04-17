from pydub import AudioSegment
from pyannote.audio import Pipeline
import re
import whisper
import webvtt

def millisec(timeStr):
  spl = timeStr.split(":")
  s = (int)((int(spl[0]) * 60 * 60 + int(spl[1]) * 60 + float(spl[2]) )* 1000)
  return s

def convert_to_vtt_time(seconds):
    hours, remainder = divmod(int(seconds), 3600)
    minutes, seconds = divmod(remainder, 60)
    milliseconds = int((seconds - int(seconds)) * 1000)
    return f"{str(hours).zfill(2)}:{str(minutes).zfill(2)}:{str(int(seconds)).zfill(2)}.{str(milliseconds).zfill(3)}"


audio = AudioSegment.from_mp3('C:/Users/jogit/Documents/IR Repos/CSE508_Winter2023_Group2_Project/model-final/newname.mp3')
audio.export('audio.wav', format='wav')

pipeline = Pipeline.from_pretrained('pyannote/speaker-diarization', use_auth_token="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")

audio = AudioSegment.from_mp3("audio.wav")
spacermilli = 2000
spacer = AudioSegment.silent(duration=spacermilli)
audio = spacer.append(audio, crossfade=0)

audio.export('audio.wav', format='wav')

DEMO_FILE = {'uri': 'blabal', 'audio': 'audio.wav'}
dz = pipeline(DEMO_FILE)  

with open("diarization.txt", "w") as text_file:
    text_file.write(str(dz))

sounds = spacer
segments = []

dz = open('diarization.txt').read().splitlines()
dzList = []
for l in dz:
  start, end =  tuple(re.findall('[0-9]+:[0-9]+:[0-9]+\.[0-9]+', string=l))
  start = millisec(start) - spacermilli
  end = millisec(end)  - spacermilli
  lex = not re.findall('SPEAKER_01', string=l)
  dzList.append([start, end, lex])

print(*dzList[:10], sep='\n')

sounds = spacer
segments = []

dz = open('diarization.txt').read().splitlines()
for l in dz:
  start, end =  tuple(re.findall('[0-9]+:[0-9]+:[0-9]+\.[0-9]+', string=l))
  start = int(millisec(start)) #milliseconds
  end = int(millisec(end))  #milliseconds
  
  segments.append(len(sounds))
  sounds = sounds.append(audio[start:end], crossfade=0)
  sounds = sounds.append(spacer, crossfade=0)

sounds.export("dz.wav", format="wav")

model = whisper.load_model("base")
# model = whisper.load_model("tiny")
result = model.transcribe('dz.wav')

# save to srt
with open("subtitles.srt", "w") as f:
    for index, subtitle in enumerate(result["segments"], start=1):
        start_time = subtitle["start"]
        end_time = subtitle["end"]
        text = subtitle["text"]
        f.write(f"{index}\n{start_time:.3f} --> {end_time:.3f}\n{text}\n\n")

# save to vtt
with open("subtitles.vtt", "w") as f:
    f.write("WEBVTT\n\n")
    for subtitle in result["segments"]:
        start_time = subtitle["start"]
        end_time = subtitle["end"]
        text = subtitle["text"]
        f.write(f"{convert_to_vtt_time(start_time)} --> {convert_to_vtt_time(end_time)}\n{text}\n\n")

captions = [[(int)(millisec(caption.start)), (int)(millisec(caption.end)),  caption.text] for caption in webvtt.read('subtitles.vtt')]
print(*captions[:8], sep='\n')


for i in range(len(segments)):
    idx = 0
    for idx in range(len(captions[i])):
        if captions[idx][0] >= (segments[i] - spacermilli):
            break;

    while (idx < (len(captions))) and ((i == len(segments) - 1) or (captions[idx][1] < segments[i+1])):
        c = captions[idx]

        start = dzList[i][0] + (c[0] -segments[i])

        if start < 0:
            start = 0
        idx += 1

        start = start / 1000.0
        startStr = '{0:02d}:{1:02d}:{2:02.2f}'.format((int)(start // 3600),
                                                (int)(start % 3600 // 60),
                                                start % 60)

        text.append('\t\t\tlink: ' + startStr + ' |\n')
        text.append('\t\t\tstart time: ' + startStr + '\n')
        text.append('\t\t\ttranscript: [' + dzList[i][2] + '] ' + c[2] + '\n')
        text.append('\n')

s = "".join(text)

with open("lexicap.txt", "w") as text_file:
    text_file.write(s)

print(s)
