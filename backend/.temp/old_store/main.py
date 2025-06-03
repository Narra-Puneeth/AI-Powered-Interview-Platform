from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
import json
from google import genai

# Initialize the LLM client
client = genai.Client(api_key="AIzaSyDEaD5pWBhA3bzrKnYRV6vjwyw-7tUkCvs")
chat = client.chats.create(model="gemini-2.0-flash")

# In-memory store for interview state
interview_data = {
    "config": {},
    "questions": [],
    "answers": [],
}

# Upload folder configuration
UPLOAD_PATH = "uploads"
RESUME_PATH = os.path.join(UPLOAD_PATH, "resume.pdf")

# Create the upload folder if it doesn't exist
os.makedirs(UPLOAD_PATH, exist_ok=True)

# Path for saving the session data
SESSION_FILE = "interview_data.json"

# Function to save the current session to a JSON file
def save_session():
    with open(SESSION_FILE, 'w') as f:
        json.dump(interview_data, f, indent=4)

# FastAPI app instance
app = FastAPI()

# Allow frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with your frontend origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload the resume file."""
    with open(RESUME_PATH, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"message": "File uploaded successfully"}


@app.api_route("/resume", methods=["GET", "HEAD"])
def get_resume():
    """Get the resume file."""
    return FileResponse(
        path=RESUME_PATH,
        media_type="application/pdf"
    )


@app.post("/setup")
async def setup_interview(interview_config: dict):
    """Initialize the interview setup with configuration."""
    # Save the interview configuration
    interview_data["config"] = interview_config
    
    # Build the prompt for the LLM (includes setup info and resume content)
    prompt = f"""Setup interview with configuration: {interview_config}. 
    This the resume content: {interview_data['config'].get('resume_content', 'No resume content provided')}.
    Preprare the qestions based on the configuration and resume content.
    Do not respond, just remember the configuration and resume content.
    """

    # Start the chat session with the LLM and send the setup prompt
    chat.send_message(prompt)
    
    # Save session to file
    save_session()

    return {"message": "Interview setup completed successfully"}


@app.post("/generate_question")
async def generate_question():
    """Generate the next interview question."""
    if not interview_data["config"]:
        raise HTTPException(status_code=400, detail="Interview not setup")

    # Ensure the number of questions generated is as expected
    num_questions = interview_data["config"].get("num_questions", 0)
    if len(interview_data["questions"]) >= num_questions:
        raise HTTPException(status_code=400, detail="All questions have been generated")

    # Build the prompt for the LLM to generate the next question
    prompt = "Generate the next question based on the interview setup, covering the provided topics and difficulty level. Do not include any extraneous text just the question."

    # Send the prompt to the LLM to generate the next question
    response = chat.send_message(prompt)

    # Extract the generated question from the response
    next_question = response.text.strip()
    
    # Store the question for future use
    interview_data["questions"].append(next_question)

    # Save session to file
    save_session()

    return {"question": next_question}


@app.post("/save_answer")
async def save_answer(answer: str):
    """Save the user's answer for the most recent question."""
    if not interview_data["questions"]:
        raise HTTPException(status_code=400, detail="No question has been generated yet")

    last_question = interview_data["questions"][-1]
    interview_data["answers"].append({
        "question": last_question,
        "answer": answer
    })
    # Save session to file
    save_session()

    return {"message": "Answer saved successfully"}



@app.get("/get_feedback")
async def get_feedback():
    """Generate and return the interview feedback after all answers are received."""
    # Ensure the number of answers matches the number of questions generated
    num_questions = interview_data["config"].get("num_questions", 0)
    if len(interview_data["answers"]) != num_questions:
        raise HTTPException(status_code=400, detail=f"Expected {num_questions} answers, but only {len(interview_data['answers'])} answers have been provided.")

    # Generate feedback from the LLM based on all the answers
    prompt = f"""
    You are acting as a highly professional and objective interview evaluator.

    You are provided with the following information:
    - Interview configuration:
    {json.dumps(interview_data['config'], indent=2)}

    - Interview questions and the candidate's responses:
    {json.dumps(interview_data['answers'], indent=2)}

    Your task is to analyze the candidate's answers strictly based on correctness, depth, and clarity.

    You must return your evaluation **only in the following JSON format**, with no extra text or formatting outside this structure:

    {{
    "Summary": {{
        "Assessment": "Overall evaluation of the candidate's performance",
        "Strengths": "Summarize only the demonstrated strengths, if any",
        "Improvements": "List clear areas for improvement based on the answers",
        "Score": "Overall score from 1 to 10, based solely on the correctness and quality of answers"
    }},
    "Feedback": [
        {{
        "Question": "Exact interview question",
        "answer": "Candidate's provided answer",
        "Score": "Integer score (1–10) strictly based on correctness and completeness",
        "Feedback": "Detailed feedback on this answer. Include what was correct, what was missing or incorrect, and suggestions to improve."
        }},
        ...
    ]
    }}

    Strict Instructions:
    - Do NOT give high scores unless the answer is technically correct and complete.
    - If an answer is vague, missing key details, or incorrect, assign a lower score accordingly.
    - Do not assume missing information; score based only on what is present.
    - The "Summary" must reflect the actual overall quality and correctness of the answers.
    - Return ONLY a valid JSON object. Do not include markdown formatting, extra code blocks, explanations, or any surrounding text.
    """


    
    # Send the prompt to the LLM to generate feedback
    response = chat.send_message(prompt)

    # Get the feedback response text
    raw_feedback = response.text.strip()

    # Parse the stringified JSON into a Python dictionary
    try:
        feedback_json = json.loads(raw_feedback)
    except json.JSONDecodeError:
        # If the LLM wrapped it in a code block like ```json ... ```, clean it
        cleaned = raw_feedback.strip("```json").strip("```").strip()
        feedback_json = json.loads(cleaned)

    # Save to file
    with open("feedback.json", "w", encoding="utf-8") as f:
        json.dump(feedback_json, f, indent=2, ensure_ascii=False)

    # Optionally return it
    return JSONResponse(content=feedback_json)

