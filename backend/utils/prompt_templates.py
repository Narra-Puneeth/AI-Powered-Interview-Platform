def generate_prompt(interview_type: str, resume: str, topics: str, num_questions: int, seed : int) -> str:
    return f"""
You are a technical interviewer conducting a Technical Round.
You have a candidate's resume and a list of topics to cover.

The candidate's resume is as follows:
{resume}

The topics to cover are:
{topics}

Generate a list of {num_questions} interview questions based on the resume and topics provided.

Guidelines:
- Simulate a realistic technical interview experience.
- The first question should be: “Can you please introduce yourself and walk me through your experience so far?”
- Follow with 1–2 questions focused on the candidate's projects. These should include behavioral and technical insight, such as:
  - "Tell me about a project you're most proud of and why."
  - "Describe a time you worked in a team and what role you played."
  - "Explain the most challenging project you've worked on and how you overcame the challenges."
- The next set of questions should focus on **core concepts** from the provided topics.
  - Ask conceptual and practical questions that test the candidate's foundational understanding.
  - Ensure the questions are balanced — not too simple, not overly niche or complex.
  - Avoid trivia; prefer scenario-based or concept-explaining questions.
  - example questions such as:
    - *Java:* "Explain the 4 pillars of OOP with real-world examples", "What is transient in a Serializable class?"
    - *OS:* "What is virtual memory and what are its advantages?", "Explain paging and how TLB helps."
    - *DBMS:* "What are ACID properties in a transaction?", "Explain serializability with an example."
    - *Networking:* "What happens when you type www.google.com in a browser?", "Explain subnetting with an example."
- The last question should always be: “Do you have any questions for us?”
- do not give same questions every time, candidate should not be able to guess the questions.

Format the output strictly as a valid JSON object with the following structure:
{{ "questions" : ["question1,"question2",...,"questionN"] }}

Only return valid JSON. Do not include any explanation or additional text.
Dont include ```json or any other code block.
Do not include any markdown formatting.
""".strip()


def evaluate_answer_prompt(question: str, answer: str) -> str:
    return f"""
You are an expert technical interviewer evaluating candidate responses.

Below is a question and a candidate's answer.

Your job is to **strictly evaluate the quality of the answer** using only the content provided — **do not assume, fill in, or hallucinate any missing details**.

---

Question: {question}
Answer: {answer}

---

Evaluation Criteria:
1. **Relevance**: Does the answer directly address the question?
2. **Completeness**: Does the answer cover all key aspects of the question?
3. **Clarity**: Is the answer easy to understand?
4. **Correctness**: Are the statements accurate and meaningful?

**Important:**
- If the answer is vague, irrelevant, off-topic, or a placeholder (e.g., "I have worked with Python..."), assign a **score between 1 and 3**.
- Only assign **7 or more** for **fully relevant, complete, and insightful answers**.
- Do **not** invent explanations or assume the answer is good if it's unclear.

Also provide a detailed feedback on the answer, including:
- What was done well
- What could be improved
- Any missing details or concepts

Respond with a **minified JSON** object **only**, in this format:
{{"score": <1-10>, "feedback": "<brief justification>"}}

No markdown, no code blocks, no extra explanation.
"""