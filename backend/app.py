import streamlit as st
from pymongo import MongoClient
from flow import create_question_flow, create_evaluation_flow
from datetime import datetime
import uuid
import sounddevice as sd
from scipy.io.wavfile import write
import tempfile
import os
import speech_recognition as sr
import numpy as np

# MongoDB setup
client = MongoClient("mongodb://localhost:27017")
db = client["interview_tracker"]
collection = db["interviews"]

# Shared state
if "shared" not in st.session_state:
    st.session_state.shared = {}

# Sidebar Navigation
page = st.sidebar.radio("Navigate", ["Setup Interview", "Interview", "Summary", "View Past Interviews"])

# Page 1: Setup Interview
if page == "Setup Interview":
    st.title("Setup Interview")
    interview_type = st.radio("Choose Interview Type", ["Technical", "HR", "Technical and HR"])
    topics = st.text_input("Enter topics to be covered (comma-separated):")
    num_questions = st.number_input("Number of Questions", min_value=1, max_value=20, value=5)

    if st.button("Start Interview"):
        st.session_state.shared = {
            "topics": topics,
            "num_questions": num_questions,
            "interview_type": interview_type,
        }
        qgen = create_question_flow()
        qgen.run(st.session_state.shared)
        st.session_state.shared["question_index"] = 0
        st.session_state.shared["answers"] = []
        st.success("Questions Generated. Move to Interview tab.")

# Page 2: Interview
elif page == "Interview":
    st.title("Interview")
    shared = st.session_state.shared
    questions = shared.get("questions", [])
    index = shared.get("question_index", 0)

    if index < len(questions):
        st.markdown(f"*Q{index + 1}: {questions[index]}*")

        # Init session states
        if "is_recording" not in st.session_state:
            st.session_state.is_recording = False
        if "recorded_audio" not in st.session_state:
            st.session_state.recorded_audio = []
        if "transcript" not in st.session_state:
            st.session_state.transcript = ""

        # Start Recording
        if st.button("🎙️ Start Recording") and not st.session_state.is_recording:
            st.session_state.is_recording = True
            st.session_state.recorded_audio = []
            st.info("Recording... Click 'Stop & Transcribe' when done.")

        # While recording, stream and buffer data
        if st.session_state.is_recording:
            duration = 1  # 1-second chunks until user stops
            audio_chunk = sd.rec(int(duration * 44100), samplerate=44100, channels=1)
            sd.wait()
            st.session_state.recorded_audio.append(audio_chunk)

        # Stop and Transcribe
        if st.button("⏹️ Stop & Transcribe") and st.session_state.is_recording:
            st.session_state.is_recording = False

            # Concatenate all audio chunks
            full_audio = np.concatenate(st.session_state.recorded_audio, axis=0)

            with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as f:
                write(f.name, 44100, full_audio)
                st.audio(f.name)

                recognizer = sr.Recognizer()
                with sr.AudioFile(f.name) as source:
                    audio = recognizer.record(source)
                    try:
                        st.session_state.transcript = recognizer.recognize_google(audio)
                        st.success("Transcription complete")
                    except Exception as e:
                        st.session_state.transcript = f"Error: {str(e)}"
                        st.error(st.session_state.transcript)

        # Editable text box
        final_answer = st.text_area("Edit Transcribed Answer", value=st.session_state.transcript, key=f"answer_{index}")

        if st.button("Next Question"):
            shared["answers"].append(final_answer)
            shared["question_index"] += 1

            # Reset states
            st.session_state.transcript = ""
            st.session_state.recorded_audio = []
            st.session_state.is_recording = False
            st.experimental_rerun()
    else:
        st.success("Interview completed. Move to Summary tab.")


# Page 3: Summary
elif page == "Summary":
    st.title("Interview Summary")
    shared = st.session_state.shared
    if "summary" not in shared and "answers" in shared:
        shared["_mongodb"] = db  # Inject db to shared
        flow = create_evaluation_flow()
        flow.run(shared)

        # Save to MongoDB
        shared["created_at"] = datetime.now()
        shared["session_id"] = str(uuid.uuid4())
        db.interviews.insert_one(shared)

    if "summary" in shared:
        st.json(shared["summary"])
    else:
        st.warning("No summary available. Please complete the interview.")

# Page 4: View Past Interviews
elif page == "View Past Interviews":
    st.title("Previous Interviews")
    cursor = db.interviews.find().sort("created_at", -1).limit(10)
    for doc in cursor:
        col1, col2 = st.columns([3, 1])
        with col1:
            st.markdown(f"{doc.get('interview_type', 'Unknown')}** | {doc.get('topics', '')}")
            st.markdown(f"Date: {doc.get('created_at').strftime('%Y-%m-%d %H:%M')}")
        with col2:
            if st.button("View Summary", key=str(doc["_id"])):
                st.session_state.shared = doc
                st.session_state.shared["summary"] = doc["summary"]
                st.experimental_set_query_params(page="Summary")
                st.rerun()