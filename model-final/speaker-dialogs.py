from pydub import AudioSegment
import csv

# set parameters - need frontend to change settings
# show transcription with speaker number to get user input
speaker_no = 1

# Load the audio file
path = 'fudge.mp3'

audio_file = AudioSegment.from_file(path, format="mp3")

# Define the spacer sound
spacer_sound = AudioSegment.silent(duration=1000)  # 1 second spacer

# Parse the CSV file to extract start and end times, and speaker tags for each row
with open("transcript.csv") as csv_file:
    csv_reader = csv.reader(csv_file)
    # next(csv_reader)  # skip header row
    i=0
    for row in csv_reader:
        start_time = float(row[1]) * 1000
        end_time = float(row[2]) * 1000
        speaker_tag = row[0]

        # Check if the speaker tag matches the target tag
        if speaker_tag == f"SPEAKER {speaker_no}":
            i = i + 1
            # Split the audio file into smaller chunks based on the start and end times
            audio_chunk = audio_file[start_time:end_time]

            audio_chunk.export(f"dialog-{i}.mp3", format="mp3")

# Save the modified audio file
# audio_file.export("modified_audio_file.mp3", format="mp3")
