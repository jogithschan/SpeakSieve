from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import base64
from fastapi.responses import JSONResponse, FileResponse
from speaker_tags_generator import transcribe_audio
import uvicorn
import os

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

    params = [data['selectedModel'], data['selectLanguage'], data['numberSpeakers']]
    
    with open(file_location, 'wb') as f:
        f.write(decoded_bytes)
        print(f"Saved audio at {file_location}")
    
    final_output = transcribe_audio(path=file_location, model_size=params[0], language=params[1], num_speakers=params[2])
    # print(final_output)

    return JSONResponse(content={"transcription": final_output, "file_location": data['fileName']})

@app.get("/audio/{file_name}")
async def get_audio(file_name: str):
    file_location = os.path.join("audio_files", file_name)
    print(file_location)
    return FileResponse(file_location)

if __name__ == '__main__':
    uvicorn.run("main:app", host="localhost", port=8000, log_level="info", reload=True)