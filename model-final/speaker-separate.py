from pydub import AudioSegment
import csv

# set parameters - need frontend to change settings
# show transcription with speaker number to get user input
speaker_no = 1

# Load the audio file
path = 'newname.mp3'

audio_file = AudioSegment.from_file(path, format="mp3")

# Define the spacer sound
spacer_sound = AudioSegment.silent(duration=1000)  # 1 second spacer

# Parse the CSV file to extract start and end times, and speaker tags for each row
with open("transcript.csv") as csv_file:
    csv_reader = csv.reader(csv_file)
    # next(csv_reader)  # skip header row
    i=0
    for row in csv_reader:
        start_time = int(float(row[1]) * 1000)
        end_time = int(float(row[2]) * 1000)
        speaker_tag = row[0]
        i = i + 1

        # Check if the speaker tag matches the target tag
        if speaker_tag != f"SPEAKER {speaker_no}":
            # Split the audio file into smaller chunks based on the start and end times
            audio_chunk = audio_file[start_time:end_time]

            # Calculate the duration of the spacer to add
            space_duration = audio_chunk.duration_seconds

            # Add the spacer to the audio chunk
            audio_chunk = spacer_sound * int(space_duration / spacer_sound.duration_seconds)

            # Replace the original chunk with the modified chunk
            audio_file = audio_file[:start_time] + audio_chunk + audio_file[end_time:]

            # audio_file.export(f"modified_audio_file-{i}.mp3", format="mp3")

# Save the modified audio file
audio_file.export("modified_audio_file.mp3", format="mp3")
