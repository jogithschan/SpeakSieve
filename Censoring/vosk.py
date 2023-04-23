import pandas as pd
import io

from vosk import Model, KaldiRecognizer, SetLogLevel
from pydub import AudioSegment

import wave
from scipy.io import wavfile

from pydub.silence import split_on_silence

import nltk
nltk.download('punkt')  # Download the Punkt tokenizer data
nltk.download('averaged_perceptron_tagger')  # Download the POS tagger data
nltk.download('porter_test')  # Download the Porter stemmer data

from nltk.stem import PorterStemmer


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
    full_text = []
    se_dict = {}
    for index, row in se_df.iterrows():
        word = row[2]
        full_text.append(word)
        word = clean_word(word)

        if word not in se_dict:
            se_dict[word] = []
        
        curr = [row[0]*1000,row[1]*1000]
        se_dict[word].append(curr)        

    return se_dict, full_text

def generate_se_dict(path_to_csv):
    se_df = pd.read_csv(path_to_csv, header = None)
    se_dict, full_text = get_se_dict(se_df)
    return se_dict, se_df, full_text

def find_phrase(removal_word, se_df):
    timestamps = []
    phrase = removal_word.split()
    i = 0

    indices = []
    new_indices = []

    for index, row in se_df.iterrows():
        word = row[2]

        if clean_word(phrase[i]) == clean_word(word):
            if i == 0:
                start = row[0]*1000
                ix = index
            i+=1
            if i == len(phrase):
                end = row[1]*1000
                curr = [start,end]
                timestamps.append(curr)
                i=0
                indices.append(ix)
        else:
            i = 0

    for i in indices:
        for j in range(len(phrase)):
            new_indices.append(i+j)

    return timestamps, new_indices

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

def remove_word(full_text, removal_word):
    new_indices = []
    for i in range(len(full_text)):
        if clean_word(full_text[i]) == removal_word:
            new_indices.append(i)
    return new_indices

def merge_full_text(full_text):
    output_string = ""
    for i in range(len(full_text)):
        if i>0 and full_text[i-1] == "<REDACTED>" and full_text[i] == "<REDACTED>":
            continue
        output_string+=full_text[i]+" "

    return output_string

def alter_csv(path_to_csv, se_df, indices):
    indices.sort()
    se_df.loc[indices, 2] = "<REDACTED>"
    se_df.to_csv(f'{path_to_csv[:-4]}_bleeped.csv', index=False, header=False)

def add_bleep(wav_audio, input_arr, se_dict, se_df, full_text):
    timestamps_arr = []
    indices = []

    for removal_word in input_arr:
        if len(removal_word.split())==1:
            removal_word = clean_word(removal_word)
            new_indices = remove_word(full_text, removal_word)
            if removal_word in se_dict:
                timestamps = se_dict[removal_word]
            else:
                timestamps = []
        else:
            timestamps, new_indices = find_phrase(removal_word, se_df)
        timestamps_arr.extend(timestamps)
        indices.extend(new_indices)


    if len(timestamps_arr) == 0:
        return False, False

    bleep_volume = 30

    for i in timestamps_arr:
        end = i[1] - 20
        start = i[0] + 20
        
        duration = (end - start)
        
        # Create a bleep sound segment with the same duration as the word segment and apply gain
        bleep_sound = AudioSegment.silent(duration=duration).fade_in(50).fade_out(50)
        bleep_sound = bleep_sound.apply_gain(bleep_volume)
        
        # Overlay the bleep sound over the word segment
        wav_audio = wav_audio.overlay(bleep_sound, position=start, loop=False, gain_during_overlay=-30)

    return wav_audio, indices

def run(path_to_audio, input_string, path_to_csv = "timestamp.csv"):
    our_arr = [{"STATUS":None} , {"Name": None}]

    se_dict,se_df,full_text = generate_se_dict(path_to_csv)
    wav_audio = get_wav_audio(path_to_audio)

    bleeped_words = input_string.split(',')

    new_audio, indices = add_bleep(wav_audio, bleeped_words, se_dict, se_df, full_text)

    if (new_audio == False):
        our_arr[0]["STATUS"] = False
        return our_arr

    alter_csv(path_to_csv, se_df, indices)

    audio_name = f"audio_files\\{path_to_audio[:-4]}_bleeped.wav"
    new_audio.export(audio_name, format="wav")
    our_arr[0]["STATUS"] = True
    our_arr[1]["Name"] = audio_name
    #our_arr[1]["Audio"] = new_audio

    return our_arr
