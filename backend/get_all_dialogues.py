from pydub import AudioSegment
import csv
import json

def extract_speaker_audio(speaker_no: int, path="audio_files/original_audio.mp3"):
    audio_file = AudioSegment.from_file(path, format="mp3")
    spacer_sound = AudioSegment.silent(duration=1000)  # 1 second spacer

    final_output = []
    # Parse the CSV file to extract start and end times, and speaker tags for each row
    with open("transcript.csv") as csv_file:
        csv_reader = csv.reader(csv_file)
        i = 0
        for row in csv_reader:
            start_time = float(row[1]) * 1000
            end_time = float(row[2]) * 1000
            speaker_tag = row[0]
            text = row[3]

            # Check if the speaker tag matches the target tag
            if speaker_tag == f"SPEAKER {speaker_no}":
                i = i + 1
                # Split the audio file into smaller chunks based on the start and end times
                audio_chunk = audio_file[start_time:end_time]
                file_name = f"dialog-{i}.mp3"
                audio_chunk.export(f"audio_files/{file_name}", format="mp3")

                obj = {
                    "speaker": speaker_tag,
                    "start_time": start_time,
                    "end_time": end_time,
                    "text": text,
                    "audio_file":file_name
                }
                
                final_output.append(obj)

    return json.dumps(final_output, indent=2)

def split_audio_by_speaker(speaker_no, audio_file_path="audio_files/original_audio.mp3"):
    # Load the audio file
    audio_file = AudioSegment.from_file(audio_file_path, format="mp3")

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
    file_name = "modified_audio_file.mp3"
    audio_file.export(f"audio_files/{file_name}", format="mp3")
    
    return file_name
