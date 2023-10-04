# SpeakSieve
SpeakSieve is a tool to filter audio speaker-wise and transcribe the audio files to perform tasks like censoring and termsearch. It has a frontend built with React and a backend built with FastAPI.

## Getting Started

### Prerequisites
- Python 3.7 or higher
- Node.js 12.0 or higher

### Installation
1. Clone the repository
```bash
https://github.com/utkar22/CSE508_Winter2023_Group2_Project.git
```
2. Create a virtual environment and activate it
```bash
cd CSE508_Winter2023_Group2_Project/
python -m venv env
source env/bin/activate # for Linux/Mac
env/Scripts/activate # for Windows
```
3. Install required python packages
```bash
pip install -r requirements.txt
```
4. Install required node packages
```bash
cd frontend
npm install
```

### Running the project
1. Start the backend server
```bash
cd backend
python main.py
```

2. In a seperate terminal launch the reach app
```bash
cd frontend
npm start
```

3. Open your browser and navigate to http://localhost:3000/ to access the SpeakSieve app.

### Usage 
1. Upload an audio file in supported format (mp3)
2. Choose a model size from the dropdown. The default being used is base.
3. Choose language of the audio. (English/Any)
4. Enter number of speakers. Default = 1
5. Wait for transcription to finish. (This step might take time depending on the duration of the audio and the model size chosen)
### Project Structure

```
CSE508_Winter2023_Group2_Project
├─ .git
├─ .gitignore
├─ backend
│  ├─ audio.wav
│  ├─ audio_files
│  ├─ extract_phrases.py
│  ├─ get_all_dialogues.py
│  ├─ main.py
│  ├─ speaker_tags_generator.py
│  ├─ transcript-word.csv
│  ├─ transcript-word_bleeped.csv
│  ├─ transcript.csv
│  ├─ transcript.txt
│  └─ voice_censoring_api.py
├─ Censoring
│  ├─ VOSK.ipynb
│  └─ vosk.py
├─ Extract_Phrase
│  └─ extract_phrases.py
├─ frontend
│  ├─ .gitignore
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ favicon.ico
│  │  ├─ index.html
│  │  ├─ logo192.png
│  │  ├─ logo512.png
│  │  ├─ manifest.json
│  │  └─ robots.txt
│  ├─ README.md
│  └─ src
│     ├─ App.css
│     ├─ App.js
│     ├─ App.test.js
│     ├─ components
│     │  ├─ ConfirmedPage.css
│     │  ├─ ConfirmedPage.jsx
│     │  ├─ CustomNavbar.jsx
│     │  ├─ Home.css
│     │  ├─ Home.jsx
│     │  ├─ sample.mp3
│     │  └─ TranscriptionPage.jsx
│     ├─ index.css
│     ├─ index.js
│     ├─ logo.svg
│     ├─ reportWebVitals.js
│     └─ setupTests.js
├─ model-final
│  ├─ environment.yml
│  ├─ hailhydra1.mp3
│  ├─ speaker-separate.py
│  ├─ speakerTags.py
│  └─ speakerTags2.py
├─ model-testing
│  ├─ audio.wav
│  ├─ Baseline Results.ipynb
│  ├─ female-female-mixture.wav
│  ├─ female-female-mixture_est1.wav
│  ├─ female-female-mixture_est2.wav
│  ├─ female-male-mixture.wav
│  ├─ mono_audio.wav
│  ├─ mono_audio_est1.wav
│  ├─ mono_audio_est2.wav
│  ├─ single-source-transcribe.wav
│  ├─ transcript.txt
│  ├─ transcript2.txt
│  └─ transcripts_with_speaker_names.ipynb
├─ README.md
└─ requirements.txt
```
