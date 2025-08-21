import streamlit as st
import tempfile
import os
import json
import uuid
from typing import Dict, List, TypedDict
from PyPDF2 import PdfReader

# Import your existing modules (make sure to fix the syntax error first)
from langgraph.graph import StateGraph, END
from langchain.chat_models import init_chat_model

# Your existing InterviewState and functions with the syntax fix
class InterviewState(TypedDict):
    session_id: str
    resume_text: str
    analysis: Dict
    current_question: int
    questions: List[Dict]
    answers: List[Dict]
    feedback: Dict
    status: str

# Initialize LLM
@st.cache_resource
def init_llm():
    return init_chat_model("groq:openai/gpt-oss-120b", api_key=os.getenv("Groq_Api_key"))

llm = init_llm()

def extract_text_from_pdf(file_content):
    """Extract text from uploaded PDF file"""
    try:
        # Create a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            tmp_file.write(file_content)
            tmp_file_path = tmp_file.name
        
        # Read PDF
        reader = PdfReader(tmp_file_path)
        text = " ".join([page.extract_text() for page in reader.pages if page.extract_text()])
        
        # Clean up temp file
        os.unlink(tmp_file_path)
        
        return text.strip() if text.strip() else None
    except Exception as e:
        st.error(f"Error extracting text from PDF: {e}")
        return None

def analyze_resume(state: InterviewState) -> InterviewState:
    """Analyze the resume using Groq LLM"""
    
    analysis_prompt = f"""
    Analyze the following resume and extract key information in JSON format:
    
    Resume Text:
    {state['resume_text']}
    
    Please provide analysis in this exact JSON structure:
    {{
        "key_skills": ["skill1", "skill2", "skill3"],
        "experience_level": "entry/intermediate/senior",
        "domain_expertise": ["domain1", "domain2"],
        "years_of_experience": "X years",
        "strengths": ["strength1", "strength2"],
        "technical_stack": ["tech1", "tech2"],
        "role_suitability": "specific role or field",
        "summary": "brief professional summary"
    }}
    
    Focus on technical skills, experience level, and areas of expertise.
    """
    
    try:
        with st.spinner("Analyzing your resume..."):
            messages = [
                {
                    "role": "system",
                    "content": "You are an expert HR analyst. Analyze resumes and provide structured insights in JSON format only."
                },
                {
                    "role": "user",
                    "content": analysis_prompt
                }
            ]
            
            analysis_text = llm.invoke(messages)
            analysis = json.loads(analysis_text.content)
            state["analysis"] = analysis
            
    except Exception as e:
        st.error(f"Error in resume analysis: {e}")
        state["analysis"] = {
            "key_skills": ["General"],
            "experience_level": "intermediate",
            "domain_expertise": ["Technology"],
            "years_of_experience": "2-3 years",
            "strengths": ["Adaptable"],
            "technical_stack": ["General"],
            "role_suitability": "Technology",
            "summary": "Experienced professional"
        }
    
    return state

def generate_questions(state: InterviewState) -> InterviewState:
    """Generate interview questions dynamically using Groq LLM"""
    
    analysis = state["analysis"]
    
    question_prompt = f"""
    Based on the following resume analysis, generate exactly 5 interview questions in JSON format:
    
    Resume Analysis:
    - Key Skills: {analysis.get('key_skills', [])}
    - Experience Level: {analysis.get('experience_level', 'intermediate')}
    - Domain Expertise: {analysis.get('domain_expertise', [])}
    - Technical Stack: {analysis.get('technical_stack', [])}
    - Strengths: {analysis.get('strengths', [])}
    
    Generate questions that:
    1. Test technical knowledge relevant to their skills
    2. Assess experience with their stated expertise
    3. Include both technical and behavioral questions
    4. Match their experience level
    5. Progress from easier to harder
    
    Return in this exact JSON format:
    {{
        "questions": [
            {{
                "question_number": 1,
                "question_text": "question here",
                "question_type": "technical/behavioral",
                "difficulty_level": 1-5,
                "expected_keywords": ["keyword1", "keyword2"],
                "focus_area": "specific skill or concept"
            }}
        ]
    }}
    """
    
    try:
        with st.spinner("Generating personalized interview questions..."):
            messages = [
                {
                    "role": "system",
                    "content": "You are an expert technical interviewer. Create relevant, insightful interview questions based on candidate profiles. Always return valid JSON."
                },
                {
                    "role": "user",
                    "content": question_prompt
                }
            ]
            
            questions_response = llm.invoke(messages)
            questions_data = json.loads(questions_response.content)
            state["questions"] = questions_data["questions"]
            
    except Exception as e:
        st.error(f"Error generating questions: {e}")
        state["questions"] = [
            {
                "question_number": 1,
                "question_text": "Tell me about your technical background and experience",
                "question_type": "technical",
                "difficulty_level": 2,
                "expected_keywords": ["experience", "technical", "skills"],
                "focus_area": "Background"
            }
        ]
    
    state["current_question"] = 1
    return state

def evaluate_answer(question: Dict, user_answer: str) -> Dict:
    """Evaluate user's answer using Groq LLM"""
    
    evaluation_prompt = f"""
    Evaluate this interview answer and provide scoring in JSON format:
    
    Question: {question['question_text']}
    Question Type: {question['question_type']}
    Expected Keywords: {question['expected_keywords']}
    Focus Area: {question.get('focus_area', 'General')}
    
    Candidate Answer: {user_answer}
    
    Provide evaluation in this JSON format:
    {{
        "confidence_score": 0.0-1.0,
        "keyword_matches": ["matched keywords"],
        "strengths": ["what was good"],
        "improvements": ["what could be better"],
        "technical_accuracy": 0.0-1.0,
        "communication_clarity": 0.0-1.0
    }}
    """
    
    try:
        messages = [
            {
                "role": "system",
                "content": "You are an expert interview evaluator. Assess candidate answers objectively and provide constructive feedback."
            },
            {
                "role": "user",
                "content": evaluation_prompt
            }
        ]
        
        result = llm.invoke(messages)
        return json.loads(result.content)
        
    except Exception as e:
        st.error(f"Error evaluating answer: {e}")
        return {"confidence_score": 0.7, "keyword_matches": [], "strengths": ["Good attempt"], "improvements": ["Could be more detailed"]}

def generate_final_feedback(state: InterviewState) -> Dict:
    """Generate comprehensive feedback using Groq LLM"""
    
    feedback_prompt = f"""
    Generate comprehensive interview feedback based on this interview session:
    
    Resume Analysis: {json.dumps(state['analysis'], indent=2)}
    
    Interview Performance:
    {json.dumps([
        {
            "question": ans["question_text"], 
            "evaluation": ans["evaluation"]
        } 
        for ans in state["answers"]
    ], indent=2)}
    
    Provide feedback in this JSON format:
    {{
        "overall_score": 0.0-10.0,
        "technical_competency": 0.0-10.0,
        "communication_skills": 0.0-10.0,
        "strengths": ["strength1", "strength2", "strength3"],
        "areas_for_improvement": ["area1", "area2", "area3"],
        "detailed_feedback": "comprehensive paragraph feedback",
        "recommendations": ["recommendation1", "recommendation2"],
        "hire_recommendation": "strong_yes/yes/maybe/no/strong_no",
        "next_steps": "suggested next steps"
    }}
    """
    
    try:
        with st.spinner("Generating comprehensive feedback..."):
            messages = [
                {
                    "role": "system",
                    "content": "You are a senior technical interviewer providing comprehensive, constructive feedback. Be fair, specific, and actionable in your assessment."
                },
                {
                    "role": "user",
                    "content": feedback_prompt
                }
            ]
            
            result = llm.invoke(messages)
            return json.loads(result.content)
            
    except Exception as e:
        st.error(f"Error generating feedback: {e}")
        if state["answers"]:
            avg_score = sum(ans["evaluation"]["confidence_score"] for ans in state["answers"]) / len(state["answers"])
        else:
            avg_score = 0.5
        
        return {
            "overall_score": avg_score * 10,
            "technical_competency": avg_score * 10,
            "communication_skills": avg_score * 10,
            "strengths": ["Good participation"],
            "areas_for_improvement": ["Continue practicing"],
            "detailed_feedback": "Thank you for completing the interview. Keep practicing to improve your skills.",
            "recommendations": ["Practice more technical questions", "Work on communication skills"],
            "hire_recommendation": "maybe",
            "next_steps": "Continue learning and practicing"
        }

def main():
    st.set_page_config(
        page_title="🤖 AI Interviewer",
        page_icon="🤖",
        layout="wide",
        initial_sidebar_state="expanded"
    )
    
    # Initialize session state
    if 'interview_state' not in st.session_state:
        st.session_state.interview_state = None
    if 'current_step' not in st.session_state:
        st.session_state.current_step = 'upload'
    
    # Header
    st.title("🤖 AI Interview Assistant")
    st.markdown("Upload your resume and start your personalized AI interview experience!")
    
    # Sidebar for navigation and progress
    with st.sidebar:
        st.header("Interview Progress")
        
        if st.session_state.current_step == 'upload':
            st.info("📄 Upload Resume")
        elif st.session_state.current_step == 'analysis':
            st.success("✅ Resume Analyzed")
            st.info("❓ Interview Questions")
        elif st.session_state.current_step == 'interview':
            st.success("✅ Resume Analyzed")
            st.success("✅ Questions Generated")
            if st.session_state.interview_state:
                current_q = st.session_state.interview_state['current_question']
                total_q = len(st.session_state.interview_state['questions'])
                st.info(f"❓ Question {current_q}/{total_q}")
                
                # Progress bar
                progress = (current_q - 1) / total_q if total_q > 0 else 0
                st.progress(progress)
        elif st.session_state.current_step == 'feedback':
            st.success("✅ Interview Complete")
            st.success("📊 Feedback Ready")
        
        st.markdown("---")
        if st.button("🔄 Start New Interview"):
            st.session_state.interview_state = None
            st.session_state.current_step = 'upload'
            st.rerun()
    
    # Main content based on current step
    if st.session_state.current_step == 'upload':
        show_upload_page()
    elif st.session_state.current_step == 'analysis':
        show_analysis_page()
    elif st.session_state.current_step == 'interview':
        show_interview_page()
    elif st.session_state.current_step == 'feedback':
        show_feedback_page()

def show_upload_page():
    st.header("📄 Upload Your Resume")
    
    col1, col2, col3 = st.columns([1, 2, 1])
    
    with col2:
        st.markdown("""
        <div style='text-align: center; padding: 2rem; border: 2px dashed #ccc; border-radius: 10px; background-color: #f9f9f9;'>
            <h3>Upload PDF Resume</h3>
            <p>Upload your resume in PDF format to start the AI interview process</p>
        </div>
        """, unsafe_allow_html=True)
        
        uploaded_file = st.file_uploader(
            "Choose a PDF file",
            type=['pdf'],
            help="Upload your resume in PDF format"
        )
        
        if uploaded_file is not None:
            st.success(f"✅ File uploaded: {uploaded_file.name}")
            
            if st.button("🚀 Start Analysis", type="primary", use_container_width=True):
                # Extract text from PDF
                file_content = uploaded_file.read()
                resume_text = extract_text_from_pdf(file_content)
                
                if resume_text:
                    # Initialize interview state
                    st.session_state.interview_state = {
                        'session_id': str(uuid.uuid4()),
                        'resume_text': resume_text,
                        'analysis': {},
                        'current_question': 1,
                        'questions': [],
                        'answers': [],
                        'feedback': {},
                        'status': 'active'
                    }
                    
                    st.session_state.current_step = 'analysis'
                    st.rerun()
                else:
                    st.error("❌ Could not extract text from PDF. Please try a different file.")

def show_analysis_page():
    st.header("🔍 Resume Analysis")
    
    if st.session_state.interview_state:
        state = st.session_state.interview_state
        
        # Analyze resume
        state = analyze_resume(state)
        st.session_state.interview_state = state
        
        # Display analysis results
        analysis = state['analysis']
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.subheader("📊 Profile Summary")
            st.write(f"**Experience Level:** {analysis.get('experience_level', 'N/A')}")
            st.write(f"**Years of Experience:** {analysis.get('years_of_experience', 'N/A')}")
            st.write(f"**Role Suitability:** {analysis.get('role_suitability', 'N/A')}")
            
            st.subheader("💪 Key Strengths")
            for strength in analysis.get('strengths', []):
                st.write(f"• {strength}")
        
        with col2:
            st.subheader("🛠️ Technical Skills")
            for skill in analysis.get('key_skills', []):
                st.write(f"• {skill}")
            
            st.subheader("🏢 Domain Expertise")
            for domain in analysis.get('domain_expertise', []):
                st.write(f"• {domain}")
        
        st.subheader("📝 Professional Summary")
        st.write(analysis.get('summary', 'No summary available'))
        
        if st.button("➡️ Generate Interview Questions", type="primary", use_container_width=True):
            # Generate questions
            state = generate_questions(state)
            st.session_state.interview_state = state
            st.session_state.current_step = 'interview'
            st.rerun()

def show_interview_page():
    st.header("🎤 AI Interview Session")
    
    if st.session_state.interview_state:
        state = st.session_state.interview_state
        current_q_num = state['current_question']
        questions = state['questions']
        
        if current_q_num <= len(questions):
            current_question = next(
                (q for q in questions if q['question_number'] == current_q_num), 
                None
            )
            
            if current_question:
                # Question display
                col1, col2, col3 = st.columns([1, 2, 1])
                
                with col2:
                    st.markdown(f"""
                    <div style='background-color: black; padding: 1.5rem; border-radius: 10px; margin-bottom: 1rem;'>
                        <h4 style='margin: 0; color: #1f77b4;'>Question {current_q_num} of {len(questions)}</h4>
                        <p style='margin: 0.5rem 0; font-size: 0.9rem;'>
                            <span style='background-color: blue; padding: 0.2rem 0.5rem; border-radius: 15px; margin-right: 0.5rem;'>
                                {current_question['question_type']}
                            </span>
                            <span style='background-color: blue; padding: 0.2rem 0.5rem; border-radius: 15px; margin-right: 0.5rem;'>
                                {current_question.get('focus_area', 'General')}
                            </span>
                            <span style='background-color: blue; padding: 0.2rem 0.5rem; border-radius: 15px;'>
                                Level {current_question.get('difficulty_level', 1)}
                            </span>
                        </p>
                    </div>
                    """, unsafe_allow_html=True)
                    
                    st.markdown(f"### {current_question['question_text']}")
                
                # Answer input
                user_answer = st.text_area(
                    "Your Answer:",
                    height=200,
                    placeholder="Type your answer here...",
                    key=f"answer_{current_q_num}"
                )
                
                col1, col2, col3 = st.columns([1, 1, 1])
                
                with col2:
                    if st.button("Submit Answer", type="primary", use_container_width=True):
                        if user_answer.strip():
                            # Evaluate answer
                            with st.spinner("Evaluating your answer..."):
                                evaluation = evaluate_answer(current_question, user_answer)
                            
                            # Store answer
                            answer_data = {
                                "question_number": current_q_num,
                                "question_text": current_question['question_text'],
                                "answer_text": user_answer,
                                "evaluation": evaluation
                            }
                            
                            state['answers'].append(answer_data)
                            
                            # Move to next question or finish
                            if current_q_num < len(questions):
                                state['current_question'] += 1
                            else:
                                state['status'] = 'completed'
                                st.session_state.current_step = 'feedback'
                            
                            st.session_state.interview_state = state
                            st.rerun()
                        else:
                            st.error("Please provide an answer before submitting.")
        else:
            st.session_state.current_step = 'feedback'
            st.rerun()

def show_feedback_page():
    st.header("📊 Interview Feedback")
    
    if st.session_state.interview_state:
        state = st.session_state.interview_state
        
        # Generate final feedback
        feedback = generate_final_feedback(state)
        
        # Overall score display
        col1, col2, col3 = st.columns(3)
        
        with col1:
            st.metric(
                "Overall Score",
                f"{feedback.get('overall_score', 0):.1f}/10",
                delta=None
            )
        
        with col2:
            st.metric(
                "Technical Skills",
                f"{feedback.get('technical_competency', 0):.1f}/10",
                delta=None
            )
        
        with col3:
            st.metric(
                "Communication",
                f"{feedback.get('communication_skills', 0):.1f}/10",
                delta=None
            )
        
        # Hire recommendation
        hire_rec = feedback.get('hire_recommendation', 'maybe').upper()
        if hire_rec in ['STRONG_YES', 'YES']:
            st.success(f"🎉 Hire Recommendation: **{hire_rec}**")
        elif hire_rec == 'MAYBE':
            st.warning(f"🤔 Hire Recommendation: **{hire_rec}**")
        else:
            st.error(f"❌ Hire Recommendation: **{hire_rec}**")
        
        # Detailed feedback sections
        col1, col2 = st.columns(2)
        
        with col1:
            st.subheader("✅ Strengths")
            for strength in feedback.get('strengths', []):
                st.write(f"• {strength}")
            
            st.subheader("💡 Recommendations")
            for rec in feedback.get('recommendations', []):
                st.write(f"• {rec}")
        
        with col2:
            st.subheader("📈 Areas for Improvement")
            for area in feedback.get('areas_for_improvement', []):
                st.write(f"• {area}")
            
            st.subheader("🎯 Next Steps")
            st.write(feedback.get('next_steps', 'Continue practicing and learning!'))
        
        # Detailed feedback
        if feedback.get('detailed_feedback'):
            st.subheader("📝 Detailed Feedback")
            st.write(feedback['detailed_feedback'])
        
        # Question-by-question breakdown
        st.subheader("📋 Question-by-Question Analysis")
        
        for i, answer in enumerate(state['answers'], 1):
            with st.expander(f"Question {i}: {answer['question_text'][:50]}..."):
                st.write(f"**Your Answer:** {answer['answer_text']}")
                
                eval_data = answer['evaluation']
                
                col1, col2 = st.columns(2)
                with col1:
                    st.write(f"**Confidence Score:** {eval_data.get('confidence_score', 0):.2f}")
                    st.write(f"**Technical Accuracy:** {eval_data.get('technical_accuracy', 0):.2f}")
                
                with col2:
                    st.write(f"**Communication Clarity:** {eval_data.get('communication_clarity', 0):.2f}")
                    st.write(f"**Keywords Matched:** {len(eval_data.get('keyword_matches', []))}")
                
                if eval_data.get('strengths'):
                    st.write("**Strengths:**")
                    for strength in eval_data['strengths']:
                        st.write(f"• {strength}")
                
                if eval_data.get('improvements'):
                    st.write("**Improvements:**")
                    for improvement in eval_data['improvements']:
                        st.write(f"• {improvement}")

if __name__ == "__main__":
    main()
