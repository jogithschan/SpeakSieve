#Inputs to run: path_to_audio, path_to_csv, bleeped_word
#Output from run: new_audio, and saves the audio as well

import pandas as pd
import io
import wave
import nltk

from vosk import Model, KaldiRecognizer, SetLogLevel
from pydub import AudioSegment
from scipy.io import wavfile
from pydub.silence import split_on_silence
from nltk.stem import PorterStemmer

nltk.download('punkt')  # Download the Punkt tokenizer data
nltk.download('averaged_perceptron_tagger')  # Download the POS tagger data
nltk.download('porter_test')  # Download the Porter stemmer data


def mp3_to_wav(mp3_audio):
    wav_audio = io.BytesIO()
    mp3_audio.export(wav_audio, format="wav")
    return wav_audio

def remove_punct(word):
    new_word = ""
    for i in word:
        if i.isalpha():
            new_word+=i
    return new_word

stemmer = PorterStemmer()

def clean_word(word):
    word = word.lower()
    word = remove_punct(word)
    word = stemmer.stem(word)
    return word

def get_se_dict(se_df):
    se_dict = {}
    for index, row in se_df.iterrows():
        word = row[2]
        word = clean_word(word)

        if word not in se_dict:
            se_dict[word] = []
        
        curr = [row[0]*1000,row[1]*1000]
        se_dict[word].append(curr)
    return se_dict

def generate_se_dict(path_to_csv):
    se_df = pd.read_csv(path_to_csv, header = None)
    se_dict = get_se_dict(se_df)
    return se_dict

def add_bleep(wav_audio, removal_word, se_dict):
    removal_word = clean_word(removal_word)
    timestamps = se_dict[removal_word]

    bleep_volume = 30

    for i in timestamps:
        end = i[1]
        start = i[0]
        
        duration = (end - start)
        
        # Create a bleep sound segment with the same duration as the word segment and apply gain
        bleep_sound = AudioSegment.silent(duration=duration).fade_in(50).fade_out(50)
        bleep_sound = bleep_sound.apply_gain(bleep_volume)
        
        # Overlay the bleep sound over the word segment
        wav_audio = wav_audio.overlay(bleep_sound, position=start, loop=False, gain_during_overlay=-30)

    return wav_audio

def get_wav_audio(path_to_audio):
    if path_to_audio[-4:] == ".wav":
        audio = AudioSegment.from_wav(path_to_audio)
        return audio
    elif path_to_audio[-4:] == ".mp3":
        audio = AudioSegment.from_mp3(path_to_audio)
        audio_buf = mp3_to_wav(audio)
        audio = AudioSegment.from_wav(audio_buf)
        return audio
    return audio

def run(path_to_audio, path_to_csv, bleeped_word):
    se_dict = generate_se_dict(path_to_csv)
    wav_audio = get_wav_audio(path_to_audio)

    new_audio = add_bleep(wav_audio, bleeped_word, se_dict)
    new_audio.export(f"{path_to_audio[:-4]}_bleeped.wav", format="wav")

    return new_audio

#path_to_audio = "new_audio.mp3"
#path_to_csv = "timestamp.csv"

#bleeped_word = "Gunfire"

#new_audio = run(path_to_audio, path_to_csv, bleeped_word)
