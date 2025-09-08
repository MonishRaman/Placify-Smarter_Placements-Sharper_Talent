import sys
import json
from main_analyzer import analyze_resume_job_match

def main():
    try:
        input_data = sys.stdin.read()
        payload = json.loads(input_data)
        resume = payload.get("resume", {})
        job = payload.get("job", {})
        result = analyze_resume_job_match(resume, job)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()