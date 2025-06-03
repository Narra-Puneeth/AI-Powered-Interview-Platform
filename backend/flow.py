from pocketflow import Flow
from nodes import ExtractPdfText, GenerateQuestions, EvaluateAnswers, SummarizeInterview, SaveSharedData

def create_question_flow():
    ext = ExtractPdfText()
    qgen = GenerateQuestions(max_retries=3)
    ext >> qgen
    return Flow(start=ext)

def create_evaluation_flow():
    eval = EvaluateAnswers()
    summ = SummarizeInterview()
    save = SaveSharedData()
    eval >> summ >> save
    return Flow(start=eval)

