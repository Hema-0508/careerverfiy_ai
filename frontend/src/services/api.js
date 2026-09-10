import axios from 'axios';

// Base URL points to Django backend (or vite proxy /api)
const API_BASE_URL = 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000,
});

/**
 * Check backend health
 */
export const checkHealth = async () => {
  try {
    const res = await apiClient.get('/health/');
    return res.data;
  } catch (err) {
    console.warn("Backend health check warning:", err.message);
    return { status: "offline" };
  }
};

/**
 * Send Resume file + Job Description to backend for Gemini AI analysis
 */
export const analyzeResume = async ({ file, resumeText, jobDescription }) => {
  const formData = new FormData();
  formData.append('job_description', jobDescription);

  if (file) {
    formData.append('resume', file);
  } else if (resumeText) {
    formData.append('resume_text', resumeText);
  }

  const response = await apiClient.post('/analyze/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * Send user question and analysis context to backend AI Chatbot
 */
export const sendChatMessage = async ({ question, resumeText, jobDescription, analysis }) => {
  const response = await apiClient.post('/chat/', {
    question,
    resume_text: resumeText,
    job_description: jobDescription,
    analysis,
  });

  return response.data;
};
