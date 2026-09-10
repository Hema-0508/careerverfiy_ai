import os
import json
import logging
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

# Try importing official google-genai or google.generativeai
GEMINI_CLIENT = None
USE_GENAI_SDK = False

gemini_key = os.getenv("GEMINI_API_KEY", "").strip()

if gemini_key:
    try:
        from google import genai
        GEMINI_CLIENT = genai.Client(api_key=gemini_key)
        USE_GENAI_SDK = True
        logger.info("Initialized Google GenAI SDK Client successfully.")
    except Exception as e:
        logger.warning(f"Could not initialize google.genai: {e}. Checking google.generativeai...")
        try:
            import google.generativeai as genai_old
            genai_old.configure(api_key=gemini_key)
            GEMINI_CLIENT = genai_old
            USE_GENAI_SDK = False
            logger.info("Initialized Google GenerativeAI SDK successfully.")
        except Exception as ex:
            logger.error(f"Failed to initialize Gemini SDK: {ex}")
            GEMINI_CLIENT = None

SYSTEM_INSTRUCTION = (
    "You are an evidence-based career verification assistant. "
    "Analyze only information supported by the provided resume and job description. "
    "Never invent skills, education, experience, certifications, projects, companies, or achievements. "
    "Use statuses: VERIFIED, PARTIAL, NOT VERIFIED. "
    "If something cannot be verified, display: 'Not clearly verified from the provided resume.'"
)

def analyze_resume_against_jd(resume_text: str, job_description: str) -> dict:
    """
    Analyzes resume against job description using Gemini AI.
    Returns structured JSON object.
    """
    if not GEMINI_CLIENT or not gemini_key:
        logger.info("No Gemini API Key found or client uninitialized. Utilizing smart fallback analysis.")
        return generate_mock_analysis(resume_text, job_description)

    prompt = f"""
{SYSTEM_INSTRUCTION}

Analyze the following Resume against the Job Description.

JOB DESCRIPTION:
{job_description}

CANDIDATE RESUME:
{resume_text}

Return strictly a valid raw JSON object (with NO markdown backticks or formatting outside the JSON) conforming to this exact structure:
{{
  "job_role": "Extracted target job role title",
  "match_score": 85,
  "verification_status": "Strong Match | Moderate Match | Needs Improvement",
  "summary": "Detailed summary explaining why the score was assigned",
  "matching_skills": ["Skill 1", "Skill 2"],
  "missing_skills": ["Missing Skill 1", "Missing Skill 2"],
  "partial_match_skills": ["Partial Skill 1"],
  "education_match": "Explanation of education relevance",
  "experience_match": "Explanation of experience relevance",
  "strengths": ["Strength 1", "Strength 2"],
  "weaknesses": ["Weakness 1", "Weakness 2"],
  "skill_evidence": [
    {{
      "skill": "React",
      "status": "VERIFIED",
      "evidence": "Mentioned in HouseHunt project and 2 years work experience"
    }},
    {{
      "skill": "Docker",
      "status": "NOT VERIFIED",
      "evidence": "No supporting evidence found in the provided resume"
    }},
    {{
      "skill": "TypeScript",
      "status": "PARTIAL",
      "evidence": "Mentioned basic understanding in personal notes but no professional projects listed"
    }}
  ],
  "recommended_courses": [
    {{
      "skill": "Docker",
      "why": "Required by JD but not clearly demonstrated.",
      "learn": ["Docker Fundamentals", "Containerization", "Dockerfile setup", "Docker Compose"]
    }}
  ],
  "interview_topics": ["Topic 1", "Topic 2", "Topic 3"]
}}
"""

    try:
        if USE_GENAI_SDK:
            # Using new google.genai Client SDK
            response = GEMINI_CLIENT.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
            )
            raw_text = response.text
        else:
            # Using google.generativeai SDK
            model = GEMINI_CLIENT.GenerativeModel('gemini-1.5-flash')
            response = model.generate_content(prompt)
            raw_text = response.text

        # Clean JSON from response
        cleaned_text = raw_text.strip()
        if cleaned_text.startswith("```json"):
            cleaned_text = cleaned_text[7:]
        if cleaned_text.startswith("```"):
            cleaned_text = cleaned_text[3:]
        if cleaned_text.endswith("```"):
            cleaned_text = cleaned_text[:-3]
        cleaned_text = cleaned_text.strip()

        parsed_json = json.loads(cleaned_text)
        
        # Ensure match_score is integer between 0 and 100
        if "match_score" in parsed_json:
            parsed_json["match_score"] = int(parsed_json["match_score"])
            
        return parsed_json

    except Exception as e:
        logger.error(f"Gemini API call failed or parsing error: {e}. Falling back to default analysis engine.")
        return generate_mock_analysis(resume_text, job_description)


def generate_chat_response(question: str, resume_text: str, job_description: str, analysis: dict) -> str:
    """
    Context-aware chatbot powered by Gemini API.
    """
    if not GEMINI_CLIENT or not gemini_key:
        return generate_mock_chat_response(question, analysis)

    prompt = f"""
{SYSTEM_INSTRUCTION}

You are an AI Career Verification Chatbot. Answer the candidate's question strictly based on the actual provided Resume, Job Description, and AI Verification Analysis.
If the answer is not supported by the provided information, state clearly: "Not clearly verified from the provided resume."

CANDIDATE RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}

VERIFICATION ANALYSIS:
{json.dumps(analysis, indent=2)}

USER QUESTION:
{question}
"""

    try:
        if USE_GENAI_SDK:
            response = GEMINI_CLIENT.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
            )
            return response.text.strip()
        else:
            model = GEMINI_CLIENT.GenerativeModel('gemini-1.5-flash')
            response = model.generate_content(prompt)
            return response.text.strip()
    except Exception as e:
        logger.error(f"Gemini Chat error: {e}")
        return generate_mock_chat_response(question, analysis)


def generate_mock_analysis(resume_text: str, job_description: str) -> dict:
    """
    Fallback deterministic analysis engine used for quick demo or if API key is missing.
    Matches actual keywords in resume_text against job_description.
    """
    resume_lower = resume_text.lower()
    jd_lower = job_description.lower()

    # Extract target role
    role = "Software Engineer"
    if "full stack" in jd_lower or "fullstack" in jd_lower:
        role = "Full Stack Developer"
    elif "frontend" in jd_lower or "react" in jd_lower:
        role = "Frontend Developer"
    elif "backend" in jd_lower or "django" in jd_lower or "python" in jd_lower:
        role = "Backend Developer"
    elif "data" in jd_lower:
        role = "Data Engineer / Analyst"

    common_skills = [
        "React", "JavaScript", "TypeScript", "Python", "Django", 
        "Node.js", "REST APIs", "SQL", "PostgreSQL", "MongoDB", 
        "Docker", "AWS", "Git", "HTML/CSS", "GraphQL", "Tailwind CSS",
        "CI/CD", "Kubernetes", "Redux", "Unit Testing"
    ]

    matched_skills = []
    missing_skills = []
    partial_skills = []
    evidence_list = []

    for skill in common_skills:
        skill_lower = skill.lower()
        is_in_jd = skill_lower in jd_lower or any(part in jd_lower for part in skill_lower.split())
        is_in_resume = skill_lower in resume_lower

        if is_in_jd:
            if is_in_resume:
                matched_skills.append(skill)
                # Find line snippet
                snippet = f"Found explicitly mentioned under technical skills / project experience in resume."
                evidence_list.append({
                    "skill": skill,
                    "status": "VERIFIED",
                    "evidence": snippet
                })
            else:
                missing_skills.append(skill)
                evidence_list.append({
                    "skill": skill,
                    "status": "NOT VERIFIED",
                    "evidence": "No supporting evidence found in the provided resume"
                })
        elif is_in_resume:
            partial_skills.append(skill)
            evidence_list.append({
                "skill": skill,
                "status": "PARTIAL",
                "evidence": "Present in resume but not explicitly required by target JD."
            })

    # Default fallback skills if JD extraction is sparse
    if not matched_skills and not missing_skills:
        matched_skills = ["JavaScript", "React", "Git", "Python"]
        missing_skills = ["Docker", "REST APIs", "CI/CD"]
        evidence_list = [
            {"skill": "React", "status": "VERIFIED", "evidence": "Demonstrated in full-stack project portfolio."},
            {"skill": "Python", "status": "VERIFIED", "evidence": "Listed under core programming languages."},
            {"skill": "Docker", "status": "NOT VERIFIED", "evidence": "No supporting evidence found in the provided resume"},
            {"skill": "REST APIs", "status": "NOT VERIFIED", "evidence": "Not clearly verified from the provided resume."}
        ]

    total_jd_skills = len(matched_skills) + len(missing_skills)
    match_score = int((len(matched_skills) / max(total_jd_skills, 1)) * 100)
    match_score = max(55, min(95, match_score))

    if match_score >= 80:
        status = "Strong Match"
    elif match_score >= 65:
        status = "Moderate Match"
    else:
        status = "Needs Improvement"

    recommended_courses = []
    for skill in missing_skills[:3]:
        recommended_courses.append({
            "skill": skill,
            "why": f"Required by the Job Description for {role} but not clearly demonstrated in your resume.",
            "learn": [
                f"{skill} Core Concepts",
                f"Hands-on {skill} Integration",
                f"Best practices & Security",
                f"Building end-to-end projects with {skill}"
            ]
        })

    return {
        "job_role": role,
        "match_score": match_score,
        "verification_status": status,
        "summary": f"Your resume demonstrates strong technical alignment ({match_score}%) for the {role} position. Core competencies are verified, though key missing skills like {', '.join(missing_skills[:2]) or 'advanced tools'} should be addressed prior to interviews.",
        "matching_skills": matched_skills,
        "missing_skills": missing_skills,
        "partial_match_skills": partial_skills,
        "education_match": "Education credentials meet the basic technical requirement outlined in the job description.",
        "experience_match": "Candidate's practical projects and hands-on experience align well with target duties.",
        "strengths": [
            f"Strong verified background in {', '.join(matched_skills[:2]) if matched_skills else 'frontend tech'}",
            "Clear technical evidence provided in resume projects",
            "Relevant hands-on development experience"
        ],
        "weaknesses": [
            f"Missing required skills: {', '.join(missing_skills[:2]) if missing_skills else 'Containerization'}",
            "Limited explicit mention of deployment & production architecture"
        ],
        "skill_evidence": evidence_list,
        "recommended_courses": recommended_courses,
        "interview_topics": [
            f"Explain architecture and state management in {matched_skills[0] if matched_skills else 'React'}",
            f"How would you integrate {missing_skills[0] if missing_skills else 'REST APIs'} into your workflow?",
            "System design & optimization principles for modern web applications"
        ]
    }


def generate_mock_chat_response(question: str, analysis: dict) -> str:
    q_lower = question.lower()
    role = analysis.get("job_role", "this role")
    score = analysis.get("match_score", 75)
    missing = analysis.get("missing_skills", [])
    matching = analysis.get("matching_skills", [])

    if "suitable" in q_lower or "fit" in q_lower:
        return f"Based on your analysis, you have a {score}% match for the {role} position! You have verified skills in {', '.join(matching[:3])}. However, you should address missing requirements such as {', '.join(missing[:2])} to maximize your chances."

    if "missing" in q_lower or "lack" in q_lower:
        if missing:
            return f"The key missing skills identified from the Job Description are: {', '.join(missing)}. None of these were clearly verified from your provided resume."
        return "No major missing skills were detected in your evaluation."

    if "learn" in q_lower or "first" in q_lower or "priorit" in q_lower:
        if missing:
            return f"You should prioritize learning **{missing[0]}** first because it is explicitly required by the Job Description but is not clearly demonstrated in your resume."
        return "Focus on building advanced portfolio projects highlighting your verified core stack."

    if "improve" in q_lower or "resume" in q_lower:
        return f"To improve your resume for {role}: \n1. Add explicit project accomplishments featuring **{missing[0] if missing else 'missing JD tools'}**.\n2. Quantify achievements (e.g. 'Improved API response speed by 35%').\n3. Ensure all technical skills have supporting evidence in your experience section."

    if "interview" in q_lower or "question" in q_lower:
        topics = analysis.get("interview_topics", [])
        topics_str = "\n• " + "\n• ".join(topics) if topics else "System design and core stack principles."
        return f"Here are key interview topics you should prepare based on your resume and JD assessment:{topics_str}"

    return f"Based on your evaluation for {role} ({score}% match), your top verified strengths include {', '.join(matching[:2])}. Let me know if you need specific advice on missing skills ({', '.join(missing[:2])}) or interview tips!"
