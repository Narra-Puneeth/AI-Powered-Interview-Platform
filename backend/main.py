from flow import create_question_flow, create_evaluation_flow
import json

def main():
    shared = {
        "interview_type": "technical",
        "topics": "dbms, views, stored procedures, operating systems(paging, segmentation)",
        "num_questions": 5,
    }
    qgen = create_question_flow()
    qgen.run(shared)

    print("\n=== INTERVIEW QUESTIONS (JSON) ===\n")
    try :
        print(json.dumps(shared["questions"], indent=2))
    except Exception as e:
        print("[ERROR] Failed to parse JSON:", e)
    # Simulate user answers
    shared["answers"] = [
        "I have experience with SQL and can write complex queries.",
        "Views are virtual tables that can simplify complex queries.",
        "Stored procedures are precompiled SQL statements that can be reused.",
        "Paging is a memory management scheme that eliminates the need for contiguous allocation of physical memory.",
        "Segmentation is a memory management technique that divides the process into segments."
    ]

    # flow = create_evaluation_flow()
    # flow.run(shared)

    # print("\n=== INTERVIEW SUMMARY (JSON) ===\n")
    # print(json.dumps(shared["summary"], indent=2))


if __name__ == "__main__":
    main()
