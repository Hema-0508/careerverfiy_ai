from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework import status
import logging

from .services.pdf_parser import extract_text_from_file
from .services.gemini_service import analyze_resume_against_jd, generate_chat_response

logger = logging.getLogger(__name__)

MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB

@api_view(['GET'])
def health_check(request):
    """
    Health check endpoint.
    GET /api/health/
    """
    return Response({"status": "ok"}, status=status.HTTP_200_OK)


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def analyze_resume(request):
    """
    Main verification analysis endpoint.
    POST /api/analyze/
    Form data:
    - resume: File (PDF/DOCX) OR resume_text: String
    - job_description: String
    """
    try:
        job_description = request.data.get('job_description', '').strip()
        if not job_description:
            return Response(
                {"error": "Job Description is required. Please paste the target Job Description."},
                status=status.HTTP_400_BAD_REQUEST
            )

        resume_file = request.FILES.get('resume')
        raw_resume_text = request.data.get('resume_text', '').strip()

        extracted_text = ""

        if resume_file:
            # File validation
            if resume_file.size > MAX_FILE_SIZE_BYTES:
                return Response(
                    {"error": "Uploaded file is too large. Maximum allowed size is 10 MB."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            try:
                extracted_text = extract_text_from_file(resume_file, resume_file.name)
            except ValueError as ve:
                return Response({"error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                logger.error(f"Error reading file: {e}")
                return Response(
                    {"error": f"Failed to extract text from resume file: {str(e)}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        elif raw_resume_text:
            extracted_text = raw_resume_text
        else:
            return Response(
                {"error": "Please upload a Resume PDF/DOCX file or select Demo mode."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not extracted_text or len(extracted_text.strip()) < 20:
            return Response(
                {"error": "The extracted resume text is too short or empty. Please check your uploaded file."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Run Gemini Analysis
        analysis_result = analyze_resume_against_jd(extracted_text, job_description)

        # Attach extracted text for chat context
        analysis_result["resume_text"] = extracted_text
        analysis_result["job_description"] = job_description

        return Response(analysis_result, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"Unhandled error in analyze_resume: {e}", exc_info=True)
        return Response(
            {"error": f"An unexpected server error occurred: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def chat_with_context(request):
    """
    Context-aware AI Chatbot endpoint.
    POST /api/chat/
    JSON payload:
    - question: String
    - resume_text: String
    - job_description: String
    - analysis: Object
    """
    try:
        data = request.data
        question = data.get('question', '').strip()
        resume_text = data.get('resume_text', '').strip()
        job_description = data.get('job_description', '').strip()
        analysis = data.get('analysis', {})

        if not question:
            return Response(
                {"error": "Question is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        chatbot_reply = generate_chat_response(
            question=question,
            resume_text=resume_text,
            job_description=job_description,
            analysis=analysis
        )

        return Response({"response": chatbot_reply}, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}", exc_info=True)
        return Response(
            {"error": f"Chat failed: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
