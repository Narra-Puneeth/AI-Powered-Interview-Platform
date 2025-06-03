from utils.prompt_templates import generate_prompt , evaluate_answer_prompt
from utils.call_llm import deepseek, gemini, safe_json_parse
from typing import Dict, Any
from pocketflow import Node, BatchNode
from PyPDF2 import PdfReader
from datetime import datetime
import logging 
import random
import json
import os


# Node 1: Generate Interview Questions
class GenerateQuestions(Node):
    def prep(self, shared):
        return shared["resume"], shared["interview_type"], shared["topics"], shared["num_questions"]

    def exec(self, inputs):
        resume, interview_type, topics, num_questions = inputs
        rand = random.randint(1000, 9999)
        prompt = generate_prompt(interview_type, resume, topics, num_questions, rand)
        response = deepseek(prompt)
        print("[DEBUG] Generate Questions Response:")
        print(response)        
        return safe_json_parse(response)

    def exec_fallback(self, prep_res, exc):
        return "Please check the input data or the LLM response."

    def post(self, shared, _, result):
        if isinstance(result, str):
            logging.error(f"Error in generating questions: {result}")
            return "error"
        shared["questions"] = result.get("questions", [])[:shared["num_questions"]]
        return "default"
    

# Node 2: Evaluate Candidate Answers
class EvaluateAnswers(BatchNode):
    def prep(self, shared):
        return list(zip(shared["questions"], shared["answers"]))

    def exec(self, qa_pair):
        question, answer = qa_pair
        prompt = evaluate_answer_prompt(question, answer)
        response = gemini(prompt)
        return safe_json_parse(response)

    def post(self, shared, _, results):
        shared["evaluations"] = results
        return "default"

# Node 3: Summarize the Interview
class SummarizeInterview(Node):
    def prep(self, shared):
        return shared["evaluations"], shared["questions"], shared["answers"]

    def exec(self, inputs):
        evaluations, questions, answers = inputs
        try :
            total = sum(e.get("score", 0) for e in evaluations)
            avg = total / len(evaluations) if evaluations else 0
            detailed = [
                {
                    "question": questions[i],
                    "user_answer": answers[i],
                    "score": e.get("score", 0),
                    "feedback": e.get("feedback", "")
                }
                for i, e in enumerate(evaluations)
            ]
        except Exception as e:
            logging.error(f"Error in summarizing interview: {e}")
            logging.error(f"Evaluations: {evaluations}")
            return {
                "overall_score": 0,
                "feedback": []
            }
        return {
            "overall_score": round(avg, 1),
            "feedback": detailed
        }

    def post(self, shared, _, result):
        shared["overall_score"] = result["overall_score"]
        shared["summary"] = result
        return "default"
    
# Node 4 : Extract Text from PDF
class ExtractPdfText(Node):
    def prep(self, shared):
        return "resume.pdf"

    def exec(self, filename):
        reader = PdfReader(filename)
        full_text = ""
        for page in reader.pages:
            text = page.extract_text()
            if text:
                full_text += text + "\n"
        return full_text.strip()

    def post(self, shared, _, result):
        shared["resume"] = result
        return "default"
    
# Node 5: save the shared data to mongodb



class SaveSharedData(Node):
    
    def prep(self, shared):
        # Create document while excluding resume
        document = {k: v for k, v in shared.items() if k not in ['resume', '_mongodb', 'answers', 'questions', 'evaluations']}
        document.update({
            'created_at': datetime.now(),
            'metadata': {'version': '1.0'}
        })
        return {'document': document}

    def exec(self, prep_res):
        return None  # Still does nothing

    def post(self, shared, prep_res, exec_res):
        result = shared['_mongodb'].interviews.insert_one(prep_res['document'])
        shared['mongo_id'] = str(result.inserted_id)
        return "success"