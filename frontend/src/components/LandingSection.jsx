import React, { useState, useRef } from 'react';
import { 
  UploadCloud, FileText, CheckCircle2, AlertCircle, ArrowRight, 
  Sparkles, FileCode, CheckSquare, BrainCircuit, Lightbulb, Play
} from 'lucide-react';

const SAMPLE_JD = `Full Stack Developer Job Description:

We are looking for a Full Stack Developer to build modern web applications.

Requirements:
- 2+ years of professional experience building web apps with React and JavaScript
- Solid backend knowledge in Python, Django, or Node.js
- Experience designing and consuming REST APIs
- Familiarity with SQL databases like PostgreSQL or SQLite
- Experience with Git version control and modern deployment workflows
- Containerization experience with Docker is a big plus!
- Strong problem-solving skills and communication.`;

const SAMPLE_RESUME_TEXT = `ALEX MORGAN
Full Stack Developer | Email: alex@example.com | GitHub: github.com/alexmorgan

SUMMARY:
Passionate Software Developer with 3 years of experience specializing in React frontend development, JavaScript, and Python backend services. Proven track record in delivering high-impact projects.

TECHNICAL SKILLS:
- Languages: JavaScript (ES6+), Python, HTML5, CSS3, SQL
- Frontend: React.js, Redux, Tailwind CSS, HTML/CSS
- Backend: Python, Django, Node.js, Express.js
- Databases: PostgreSQL, SQLite, MongoDB
- Tools & Practices: Git, GitHub, RESTful API Design, Agile Development

PROFESSIONAL EXPERIENCE:
Senior Frontend Developer | TechCorp Solutions (2022 - Present)
- Developed responsive web applications using React and JavaScript for over 50,000 active users.
- Built reusable UI component libraries integrated with Tailwind CSS.
- Collaborated with backend engineers to consume REST APIs and optimize page load performance by 30%.

Full Stack Developer Intern | HouseHunt App (2021 - 2022)
- Built an end-to-end real estate listing application using React and Django backend.
- Designed relational database schemas in PostgreSQL for property data storage.
- Integrated JWT authentication and REST endpoints.

EDUCATION:
Bachelor of Science in Computer Science | State University (2018 - 2022)
Relevant Coursework: Data Structures, Web Development, Database Management.`;

export function LandingSection({ onAnalyze, isLoading, error }) {
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile) => {
    setFileError('');
    if (!selectedFile) return;

    const ext = selectedFile.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx', 'doc', 'txt'].includes(ext)) {
      setFileError('Unsupported file format. Please upload a PDF or DOCX file.');
      setFile(null);
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setFileError('File size exceeds 10MB limit.');
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleLoadDemo = () => {
    setJobDescription(SAMPLE_JD);
    setFile(null);
    setFileError('');
    onAnalyze({ resumeText: SAMPLE_RESUME_TEXT, jobDescription: SAMPLE_JD });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file && !jobDescription) {
      setFileError('Please upload a resume file and paste a Job Description.');
      return;
    }
    if (!jobDescription.trim()) {
      setFileError('Job Description cannot be empty.');
      return;
    }
    if (!file) {
      setFileError('Please upload your Resume (PDF/DOCX) file.');
      return;
    }

    onAnalyze({ file, jobDescription });
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span>AI Evidence-Based Verification</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Career<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Verify AI</span>
        </h1>
        
        <p className="text-lg text-slate-300 font-normal">
          Verify your resume. Understand your job fit. Build your career.
        </p>

        <p className="text-sm text-slate-400 max-w-2xl mx-auto">
          Upload your resume and target job description to get a zero-hallucination, evidence-supported match score, skill verification matrix, and tailored AI learning path.
        </p>
      </div>

      {/* Main Upload Card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-800 relative overflow-hidden">
        
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center space-x-3">
            <BrainCircuit className="w-6 h-6 text-indigo-400" />
            <h2 className="text-xl font-bold text-white">Start Verification Analysis</h2>
          </div>

          <button
            type="button"
            onClick={handleLoadDemo}
            className="mt-3 sm:mt-0 inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-all"
          >
            <Play className="w-3.5 h-3.5 text-purple-400" />
            <span>Try Demo (1-Click Sample Data)</span>
          </button>
        </div>

        {/* Global Error Notice */}
        {(error || fileError) && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start space-x-3 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Verification Error</p>
              <p>{error || fileError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Step 1: Resume Upload */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-200 flex items-center justify-between">
                <span>1. Upload Resume (PDF / DOCX)</span>
                <span className="text-xs text-slate-400 font-normal">Max 10MB</span>
              </label>

              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[200px] ${
                  file 
                    ? 'border-emerald-500/50 bg-emerald-950/10' 
                    : 'border-slate-700 hover:border-indigo-500/60 bg-slate-900/40 hover:bg-slate-900/80'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.doc,.txt"
                  className="hidden"
                />

                {file ? (
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <p className="text-sm font-medium text-emerald-300 truncate max-w-xs">{file.name}</p>
                    <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      className="text-xs text-rose-400 hover:underline pt-1"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">
                        Drag and drop your resume file here
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Supports <span className="text-slate-300 font-mono">PDF</span> or <span className="text-slate-300 font-mono">DOCX</span> files
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Job Description */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-200 flex items-center justify-between">
                <span>2. Paste Job Description</span>
                <span className="text-xs text-slate-400 font-normal">
                  {jobDescription.length} chars
                </span>
              </label>

              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the target job role summary, requirements, and responsibilities here..."
                className="w-full h-[200px] p-3.5 bg-slate-900/60 border border-slate-700/80 rounded-xl text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-all"
              />
            </div>

          </div>

          {/* Submit Action */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
            <div className="text-xs text-slate-400 flex items-center space-x-2">
              <CheckSquare className="w-4 h-4 text-emerald-400" />
              <span>Evidence-based verification • No key exposure</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Analyzing Resume with Gemini AI...</span>
                </>
              ) : (
                <>
                  <span>Analyze Resume</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

        </form>
      </div>

      {/* Explanation Cards - How It Works */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        
        <div className="glass-card p-5 rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-base">
            01
          </div>
          <h3 className="font-bold text-white text-base">Strict Text Extraction</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Extracts exact text from PDF/DOCX files securely on the Django backend before contacting AI models.
          </p>
        </div>

        <div className="glass-card p-5 rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-base">
            02
          </div>
          <h3 className="font-bold text-white text-base">Evidence Verification</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every skill claim is assigned a status (<span className="text-emerald-400 font-semibold">VERIFIED</span>, <span className="text-amber-400 font-semibold">PARTIAL</span>, <span className="text-rose-400 font-semibold">NOT VERIFIED</span>) backed by resume proof.
          </p>
        </div>

        <div className="glass-card p-5 rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center font-bold text-base">
            03
          </div>
          <h3 className="font-bold text-white text-base">Contextual AI Coach</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Instant AI Career chatbot pre-conditioned on candidate results to guide learning and interview preparation.
          </p>
        </div>

      </div>

    </div>
  );
}
