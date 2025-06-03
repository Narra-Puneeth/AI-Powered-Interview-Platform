from flow import create_question_flow, create_evaluation_flow
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request, HTTPException
from typing import List, Optional
from pydantic import BaseModel
import json
import os
from pymongo import MongoClient
from contextlib import asynccontextmanager
from datetime import datetime
import logging

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    app.mongo_client = MongoClient("mongodb://localhost:27017")
    app.mongodb = app.mongo_client["interview_tracker"]
    yield
    # Shutdown
    app.mongo_client.close()

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:3000", 
    "http://localhost:8000",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows these origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods like GET, POST
    allow_headers=["*"],  # Allows all headers
)

shared = {}

# Request model for generating questions
class QuestionRequest(BaseModel):
    topics: str
    num_questions: int
    interview_type: Optional[str] = "Technical and HR"

class EvaluationRequest(BaseModel):
    answers: list

class InterviewStatItem(BaseModel):
    id: str
    date: str
    type: str  
    score: float
    topics: str  
    num_questions: int  
    interview_type: str 
    summary: dict  

class InterviewStatsResponse(BaseModel):
    total_interviews: int
    average_score: float
    recent_interviews: List[InterviewStatItem]



@app.post("/generate-questions")
def generate_questions(req: QuestionRequest):
    global shared
    shared = {
        "topics": req.topics,
        "num_questions": req.num_questions,
        "interview_type": req.interview_type,
    }
    qgen = create_question_flow()
    qgen.run(shared)
    return {
        "questions": shared["questions"]
    }

@app.post("/evaluate-answers")
def evaluate_answers(req: EvaluationRequest, request: Request):
    global shared
    shared["answers"] = req.answers
    shared["_mongodb"] = request.app.mongodb
    flow = create_evaluation_flow()
    flow.run(shared)
    return {
        "summary": shared["summary"]
    }


@app.get("/interview-stats", response_model=InterviewStatsResponse)
async def get_interview_stats(request: Request):
    try:
        collection = request.app.mongodb.interviews

        # Total number of interviews
        total = collection.count_documents({})

        # Get recent interviews (latest 6)
        cursor = collection.find(
            {"summary.overall_score": {"$exists": True}}
        ).sort("created_at", -1).limit(6)

        recent_interviews = []
        for interview in cursor:
            if "created_at" not in interview or "summary" not in interview or "overall_score" not in interview["summary"]:
                continue

            created_at = interview["created_at"]
            date_str = created_at.strftime("%Y-%m-%d %H:%M") if isinstance(created_at, datetime) else str(created_at)

            recent_interviews.append(InterviewStatItem(
                id=str(interview["_id"]),
                date=date_str,
                type=interview.get("interview_type", "unknown"),
                score=interview["summary"]["overall_score"],
                topics=interview.get("topics", ""),
                num_questions=interview.get("num_questions", 0),  # Assuming this field exists
                interview_type=interview.get("interview_type", "Technical"),  # Assuming this field exists
                summary=interview["summary"],  # Complete summary, including feedback and overall score
            ))


        # Calculate average score
        pipeline = [
            {"$match": {"summary.overall_score": {"$exists": True}}},
            {"$group": {"_id": None, "avgScore": {"$avg": "$summary.overall_score"}}}
        ]
        result = collection.aggregate(pipeline)
        result_list = list(result)
        average = result_list[0]["avgScore"] if result_list else 0

        return InterviewStatsResponse(
            total_interviews=total,
            average_score=round(average, 2),
            recent_interviews=recent_interviews
        )

    except Exception as e:
        logging.error(f"Error in /interview-stats: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch interview stats: {str(e)}"
        )