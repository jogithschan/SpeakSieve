from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import base64
from fastapi.responses import JSONResponse, FileResponse
from speaker_tags_generator import transcribe_audio
import uvicorn
import os
import shutil
from extract_phrases import extract_phrases
import voice_censoring_api
import get_all_dialogues
import csv
import json

app = FastAPI()

origins = [ 
    "http://localhost",    
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/process_audio")
async def process_audio(request: Request):
    data = await request.json()

    # file_location = f"audio_files/{data['fileName']}"
    file_name = "original_audio.mp3"
    file_location = os.path.abspath(os.path.join("audio_files", file_name))
    # print(file_location)
    decoded_bytes = base64.b64decode(data['fileData'])

    if os.path.exists("audio_files"):
        shutil.rmtree("audio_files")
    os.mkdir("audio_files")

    params = [data['selectedModel'], data['selectLanguage'], data['numberSpeakers']]
    
    with open(file_location, 'wb') as f:
        f.write(decoded_bytes)
        print(f"Saved audio at {file_location}")
    
    final_output = transcribe_audio(path=file_location, model_size=params[0], language=params[1], num_speakers=params[2])
    # print(final_output)

    return JSONResponse(content={"transcription": final_output, "file_location": data['fileName']})

@app.post("/get_all")
async def get_all(request: Request):
    data = await request.json()

    speaker_num = int(data['speaker_num'])
    
    json_result = get_all_dialogues.extract_speaker_audio(speaker_no=speaker_num)
    audio_name = get_all_dialogues.split_audio_by_speaker(speaker_no=speaker_num)

    return JSONResponse(content={"final_result": json_result, "audio_name": audio_name})

@app.post("/extract_phrases")
async def extract_phrases_from_audio(request: Request):
    data = await request.json()
    phrase = data['phrase']
    
    audio_url = "audio_files/original_audio.mp3"
    response = extract_phrases(string=phrase, audio_name=audio_url)
    print(response)

    return JSONResponse(content={"search_result":response})

@app.post("/voice_filter")
async def voice_filter(request: Request):
    data = await request.json()
    phrase = data['phrase']

    response = voice_censoring_api.run(input_string=phrase)
    # print(response)

    redacted_json = []
    rows = []
    with open('transcript_bleeped.csv') as csv_file:
        reader = csv.reader(csv_file, delimiter=',')
        rows = [row for row in reader]

    for i in range(1, len(rows)):
        obj = {
            "speaker": rows[i][0],
            "start_time": rows[i][1],
            "end_time": rows[i][2],
            "text": rows[i][3]
        }
        
        redacted_json.append(obj)
    
    final_output = json.dumps(redacted_json, indent=2)

    return JSONResponse(content={"filter_result":response, "final_output":final_output})

@app.get("/audio/{file_name}")
async def get_audio(file_name: str):
    file_location = os.path.join("audio_files", file_name)
    print(file_location)
    return FileResponse(file_location)

if __name__ == '__main__':
    uvicorn.run("main:app", host="localhost", port=8000, log_level="info", reload=True)