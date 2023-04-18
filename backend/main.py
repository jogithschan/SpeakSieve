from fastapi import FastAPI, File, UploadFile, Form, Request
import os
import shutil
import subprocess
from fastapi.middleware.cors import CORSMiddleware
import base64

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

    file_location = f"audio_files/{data['fileName']}"
    # print(file_location)
    decoded_bytes = base64.b64decode(data['fileData'])

    with open(file_location, 'wb') as f:
        f.write(decoded_bytes)
        print(f"Saved audio at {file_location}")


