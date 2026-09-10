import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, Sparkles, User, HelpCircle, ArrowRight, ShieldCheck, MessageCircle
} from 'lucide-react';
import { sendChatMessage } from '../services/api';

const SUGGESTED_QUESTIONS = [
  {
    title: "Overall Suitability",
    question: "Am I suitable for this job?",
    desc: "Evaluate overall fit score and match reasons"
  },
  {
    title: "Missing Skill Gaps",
    question: "What skills am I missing?",
    desc: "Identify critical unverified technical skills"
  },
  {
    title: "Learning Priority",
    question: "What should I learn first?",
    desc: "Get prioritized action topics for quick impact"
  },
  {
    title: "Resume Optimization",
    question: "How can I improve my resume?",
    desc: "Actionable tips to strengthen evidence"
  },
  {
    title: "Interview Prep",
    question: "What interview questions should I prepare?",
    desc: "Targeted questions based on your gaps"
  }
];

export function Chatbot({ analysisData }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `Hello! I'm your CareerVerify AI assistant. I have reviewed your uploaded resume against the target Job Description. How can I help you today?`
    }
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSend = async (questionText) => {
    const query = (questionText || inputQuestion).trim();
    if (!query || isSending) return;

    // Add user message
    const userMsg = { id: Date.now(), sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setInputQuestion('');
    setIsSending(true);

    try {
      const res = await sendChatMessage({
        question: query,
        resumeText: analysisData?.resume_text || '',
        jobDescription: analysisData?.job_description || '',
        analysis: analysisData || {},
      });

      const botReply = res.response || "Not clearly verified from the provided resume.";
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: botReply }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        sender: 'bot', 
        text: "Sorry, I encountered an issue retrieving an answer. Please try again." 
      }]);
    } finally {
      setIsSending(false);
    }
  };

  const isConversationEmpty = messages.length <= 1;

  return (
    <div className="w-full rounded-2xl glass-panel border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[650px] max-h-[85vh] sm:max-h-[650px]">
      
      {/* App Header (Full Screen Mobile & Responsive Desktop) */}
      <div className="px-4 py-3.5 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900"></span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-white text-base tracking-tight">CareerVerify AI</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                AI Coach
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Evidence-based resume context active</span>
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
          <MessageCircle className="w-3.5 h-3.5 text-indigo-400" />
          <span>Interactive Chat</span>
        </div>
      </div>

      {/* Suggested Questions Quick Bar (Always visible at top of chat area) */}
      <div className="px-3 py-2.5 bg-slate-950/70 border-b border-slate-800/80 overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-2">
        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 pl-1 pr-1 flex-shrink-0">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          Quick Questions:
        </span>
        {SUGGESTED_QUESTIONS.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(item.question)}
            disabled={isSending}
            className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-900 hover:bg-indigo-600/30 text-indigo-300 hover:text-white border border-indigo-500/20 hover:border-indigo-500/40 transition-all cursor-pointer flex-shrink-0 disabled:opacity-50"
          >
            <span>{item.question}</span>
          </button>
        ))}
      </div>

      {/* Scrollable Conversation Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/40">
        
        {/* Messages */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-md ${
              msg.sender === 'user'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                : 'bg-slate-800 border border-slate-700 text-purple-300'
            }`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-600/20 shadow-lg'
                : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-wrap shadow-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {/* Empty State: Prominent Suggested Question Cards */}
        {isConversationEmpty && (
          <div className="pt-4 pb-2 space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">
              Or pick a suggested topic to get instant career insights:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-2xl mx-auto">
              {SUGGESTED_QUESTIONS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(item.question)}
                  disabled={isSending}
                  className="glass-card p-3.5 rounded-xl text-left border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/80 group transition-all"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-indigo-300 group-hover:text-indigo-200">
                    <span>{item.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400" />
                  </div>
                  <p className="text-xs text-slate-200 font-semibold mt-1">{item.question}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Typing Indicator */}
        {isSending && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-purple-300 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl rounded-tl-none text-xs text-slate-400 flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]"></div>
              <span className="ml-2 font-medium">Analyzing resume and JD context...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Fixed Bottom Input Bar (Mobile App Style) */}
      <div className="p-3 sm:p-4 bg-slate-900/95 border-t border-slate-800">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
          className="flex items-center gap-2 max-w-4xl mx-auto"
        >
          <input
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            placeholder="Type your question about job fit or skills..."
            className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-inner"
          />

          <button
            type="submit"
            disabled={!inputQuestion.trim() || isSending}
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-600/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 flex-shrink-0"
          >
            <span className="hidden sm:inline">Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
