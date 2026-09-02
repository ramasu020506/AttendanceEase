import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import Markdown from 'react-markdown';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Minimize2, 
  Maximize2, 
  RotateCcw, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  Megaphone, 
  HelpCircle, 
  School, 
  Smartphone, 
  ShieldCheck, 
  MessageSquare,
  ChevronDown,
  AlertCircle
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const ChatbotWidget: React.FC = () => {
  const { 
    isChatbotOpen, 
    setIsChatbotOpen, 
    initialChatbotPrompt, 
    closeChatbot,
    currentSchool, 
    userRole, 
    currentTenantUser,
    tenantUsers,
    selectedDate, 
    students, 
    classes, 
    attendanceRecords, 
    openSMSModal,
    parentSession,
    schools,
    addToast
  } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Derive live roll call context to ground the assistant in current tenant only
  const todaysAttendance = attendanceRecords.filter((r) => r.date === selectedDate);
  const presentCount = todaysAttendance.filter((r) => r.status === 'present').length;
  const absentCount = todaysAttendance.filter((r) => r.status === 'absent').length;
  const lateCount = todaysAttendance.filter((r) => r.status === 'late').length;
  const excusedCount = todaysAttendance.filter((r) => r.status === 'excused').length;
  const totalRecorded = presentCount + absentCount + lateCount + excusedCount;
  const attendanceRate = totalRecorded > 0 ? Math.round(((presentCount + lateCount) / totalRecorded) * 100) : 100;

  const absentStudents = todaysAttendance
    .filter((r) => r.status === 'absent')
    .map((r) => {
      const student = students.find((s) => s.id === r.studentId);
      return student ? `${student.name} (${student.className}, Guardian: ${student.guardianName} ${student.guardianPhone})` : null;
    })
    .filter(Boolean)
    .join('; ');

  const classesSummary = classes
    .map((c) => `${c.name} (Teacher: ${c.teacher}, ${c.studentCount} students)`)
    .join(', ');

  const facultySummary = tenantUsers
    .map((u) => `${u.name} (${u.role.toUpperCase()} - ${u.designation || 'Staff'}, ${u.email})`)
    .join('; ');

  const teacherAssignedClass = currentTenantUser?.role === 'teacher'
    ? classes.find((c) => c.teacher.toLowerCase().includes(currentTenantUser.name.toLowerCase()) || (currentTenantUser.assignedClassIds && currentTenantUser.assignedClassIds.includes(c.id)))
    : null;

  const teacherClassInfo = teacherAssignedClass
    ? `Teacher ${currentTenantUser.name} is assigned to ${teacherAssignedClass.name} (${teacherAssignedClass.studentCount} scholars enrolled).`
    : currentTenantUser?.assignedClassName
    ? `Teacher ${currentTenantUser.name} is assigned to ${currentTenantUser.assignedClassName}.`
    : '';

  // Initialize initial greeting message based on active role and tenant user
  useEffect(() => {
    let greeting = '';
    if (userRole === 'super_admin') {
      greeting = `Hello! I am your **Sentinel SaaS Super Admin Copilot**. I can help you provision client schools, manage subscription tiers, allocate SMS packages, or inspect data isolation architectures across all ${schools.length} onboarded institutions.`;
    } else if (userRole === 'parent') {
      greeting = `Hello ${parentSession?.parentName || 'Parent'}! I am your **${currentSchool.name} Guardian Copilot**. I can help you review your child's attendance record, submit medical/travel excuses, or clarify campus policies.`;
    } else if (currentTenantUser.role === 'teacher') {
      greeting = `Hello **${currentTenantUser.name}**! I am your teacher assistant for **${currentSchool.name}**.\n\nI have loaded the roster for **${teacherAssignedClass ? teacherAssignedClass.name : currentSchool.name}** on **${selectedDate}**. Ask me about attendance, absent students, or drafting messages for parents.`;
    } else {
      greeting = `Hello **${currentTenantUser.name}**! I am **Sentinel AI**, private institutional copilot for **${currentSchool.name}** (${currentSchool.code}).\n\n🔒 **Tenant Sandboxed**: I am strictly bounded to **${currentSchool.name}** (${students.length} scholars, ${attendanceRate}% roll call for ${selectedDate}). How can I assist you today?`;
    }

    setMessages([
      {
        id: 'welcome-msg',
        role: 'assistant',
        content: greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [userRole, currentSchool.id, currentSchool.name, currentSchool.code, currentTenantUser.id, currentTenantUser.name, currentTenantUser.role, selectedDate, students.length, attendanceRate, parentSession, schools.length]);

  // Handle incoming initial prompt trigger
  useEffect(() => {
    if (initialChatbotPrompt && isChatbotOpen) {
      handleSendMessage(initialChatbotPrompt);
    }
  }, [initialChatbotPrompt, isChatbotOpen]);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (!isMinimized && isChatbotOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isMinimized, isChatbotOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isChatbotOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isChatbotOpen, isMinimized]);

  // Quick Prompt Options based on Role & Tenant
  const quickPrompts = userRole === 'parent'
    ? [
        "Draft a doctor's appointment excuse note",
        "What is the school's absence cutoff policy?",
        "Draft a message regarding a family emergency",
        "Who is the homeroom teacher for my child?",
        "🔒 Test Cross-School Data Access"
      ]
    : userRole === 'super_admin'
    ? [
        "How do I onboard a new client school?",
        "Draft a welcome email with admin credentials",
        "Explain SMS credit allocation tiers",
        "How is data isolated between schools?",
        "Explain tenant perimeter security"
      ]
    : currentTenantUser.role === 'teacher'
    ? [
        "Who is absent in my class today?",
        "Draft a homework reminder SMS to parents",
        "How to mark student tardiness?",
        "🔒 Test Cross-School Data Access"
      ]
    : [
        "Who is marked absent today?",
        "Draft SMS alert for morning weather delay",
        "Summarize class attendance rates",
        "List our school faculty and staff",
        "🔒 Test Cross-School Data Access"
      ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          context: {
            userRole,
            schoolId: currentSchool.id,
            schoolName: currentSchool.name,
            schoolCode: currentSchool.code,
            tenantUser: {
              id: currentTenantUser.id,
              name: currentTenantUser.name,
              email: currentTenantUser.email,
              role: currentTenantUser.role,
              designation: currentTenantUser.designation,
              assignedClassName: currentTenantUser.assignedClassName,
              assignedClassIds: currentTenantUser.assignedClassIds,
            },
            selectedDate,
            totalStudents: students.length,
            presentCount,
            absentCount,
            lateCount,
            excusedCount,
            attendanceRate,
            classesSummary,
            absentStudentsList: absentStudents,
            facultySummary,
            teacherClassInfo,
            remainingSMSCredits: currentSchool.remainingSMSCredits,
            parentStudentInfo: parentSession ? `Parent: ${parentSession.parentName || 'Registered Parent'} (${parentSession.phone}), Students: ${students.filter(s => parentSession.studentIds.includes(s.id)).map(s => s.name).join(', ')}` : '',
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      const replyContent = data.reply || 'No response received.';

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: replyContent,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      console.error('Chat request failed:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ Could not connect to the AI engine: ${err?.message || 'Network error'}. Please try again.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    addToast({
      title: 'Copied to Clipboard',
      message: 'Message content copied successfully.',
      type: 'success',
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUseInSMS = (content: string) => {
    // Extract text between triple backticks or use standard cleaned text
    let cleanText = content;
    const match = content.match(/```(?:text)?\n([\s\S]*?)```/);
    if (match && match[1]) {
      cleanText = match[1].trim();
    } else {
      // Remove markdown headings
      cleanText = cleanText.replace(/#{1,6}\s+/g, '').trim();
    }

    openSMSModal({
      defaultMessage: cleanText,
    });
    setIsChatbotOpen(false);
  };

  const handleSpeak = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Strip markdown formatting for cleaner speech
    const cleanSpeech = text.replace(/[*_#`~[\]()]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleClearHistory = () => {
    let greeting = '';
    if (userRole === 'super_admin') {
      greeting = `Hello! I am your **Sentinel SaaS Super Admin Copilot**. Ask me anything about multi-tenant management or onboarding client schools.`;
    } else if (userRole === 'parent') {
      greeting = `Hello ${parentSession?.parentName || 'Parent'}! How can I assist you with ${currentSchool.name} policies or excuse notes today?`;
    } else {
      greeting = `Conversation reset. I am ready with live roll call data for **${currentSchool.name}** on **${selectedDate}**.`;
    }

    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // If chatbot is closed, show floating launcher button
  if (!isChatbotOpen) {
    return (
      <div className="fixed bottom-5 right-5 z-40">
        <button
          id="btn-open-chatbot"
          onClick={() => setIsChatbotOpen(true)}
          className="group relative flex items-center gap-2.5 bg-[#1A1A1A] hover:bg-black text-[#F4F1ED] px-4 py-3 rounded-full shadow-2xl hover:shadow-black/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-[#1A1A1A]/20"
          title="Open Sentinel AI Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-amber-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-[#1A1A1A] animate-pulse" />
          </div>
          <span className="font-serif italic text-sm font-semibold tracking-wide">
            Sentinel AI
          </span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-mono font-bold bg-white/15 rounded text-amber-300">
            Assistant
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col font-sans select-none animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div 
        className={`bg-[#FFFFFF] rounded-2xl shadow-2xl border border-[#1A1A1A]/20 flex flex-col overflow-hidden transition-all duration-200 ${
          isMinimized 
            ? 'w-80 h-14' 
            : 'w-[92vw] sm:w-[420px] md:w-[460px] h-[85vh] sm:h-[620px] max-h-[700px]'
        }`}
      >
        {/* Chat Header */}
        <div className="bg-[#1A1A1A] text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-sm font-bold tracking-wide text-white">
                  Sentinel AI
                </span>
                <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold bg-amber-400/20 text-amber-300 rounded border border-amber-400/30">
                  {currentSchool.code}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-[10px] text-white/70 font-mono flex items-center gap-1.5 truncate max-w-[240px]">
                <span className="text-amber-200/90 font-medium truncate">{currentTenantUser?.name || currentSchool.name}</span>
                <span>•</span>
                <span className="capitalize">{currentTenantUser?.designation || currentTenantUser?.role || userRole.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-white/70">
            <button
              onClick={handleClearHistory}
              className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Reset Chat History"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title={isMinimized ? 'Expand' : 'Minimize'}
            >
              {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={closeChatbot}
              className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Close Chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body (Visible when not minimized) */}
        {!isMinimized && (
          <>
            {/* Context Badge Strip */}
            <div className="bg-[#F4F1ED] px-4 py-2 border-b border-[#1A1A1A]/10 flex items-center justify-between text-[11px] text-[#1A1A1A]/70">
              <div className="flex items-center gap-2 truncate">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300/60 font-semibold text-[10px]">
                  🔒 {currentSchool.name}
                </span>
                <span className="font-bold text-[#1A1A1A] font-mono">{selectedDate}</span>
                <span>•</span>
                <span>{students.length} Scholars</span>
                <span>•</span>
                <span className="font-semibold text-emerald-800">{attendanceRate}% Roll Call</span>
              </div>
              <span className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-[#1A1A1A]/10 text-[#1A1A1A]/60 flex-shrink-0">
                SMS: {currentSchool.remainingSMSCredits}
              </span>
            </div>

            {/* Chat Messages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FAF9F6] text-xs">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 px-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/50">
                        {isUser ? 'You' : 'Sentinel AI'}
                      </span>
                      <span className="text-[10px] text-[#1A1A1A]/40 font-mono">
                        {msg.timestamp}
                      </span>
                    </div>

                    <div
                      className={`relative group max-w-[88%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                        isUser
                          ? 'bg-[#1A1A1A] text-white font-sans rounded-tr-xs shadow-xs'
                          : 'bg-white text-[#1A1A1A] border border-[#1A1A1A]/15 font-sans rounded-tl-xs shadow-xs'
                      }`}
                    >
                      {/* Markdown Body */}
                      <div className="prose prose-xs max-w-none text-current overflow-x-auto">
                        <Markdown>{msg.content}</Markdown>
                      </div>

                      {/* Action buttons for assistant message */}
                      {!isUser && (
                        <div className="mt-2.5 pt-2 border-t border-[#1A1A1A]/10 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleCopyText(msg.id, msg.content)}
                              className="px-2 py-0.5 bg-[#F4F1ED] hover:bg-[#E8E4DF] text-[#1A1A1A] text-[10px] font-bold rounded flex items-center gap-1 transition-colors cursor-pointer"
                              title="Copy text"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-700" />
                                  <span>Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3 text-[#1A1A1A]/60" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => handleSpeak(msg.id, msg.content)}
                              className="px-2 py-0.5 bg-[#F4F1ED] hover:bg-[#E8E4DF] text-[#1A1A1A] text-[10px] font-bold rounded flex items-center gap-1 transition-colors cursor-pointer"
                              title="Read aloud"
                            >
                              {speakingId === msg.id ? (
                                <>
                                  <VolumeX className="w-3 h-3 text-amber-700 animate-pulse" />
                                  <span>Stop</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="w-3 h-3 text-[#1A1A1A]/60" />
                                  <span>Audio</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* Quick Insert into SMS modal if text contains SMS draft */}
                          {(msg.content.toLowerCase().includes('sms') || msg.content.includes('```')) && userRole !== 'parent' && (
                            <button
                              onClick={() => handleUseInSMS(msg.content)}
                              className="px-2 py-0.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 text-[10px] font-bold rounded flex items-center gap-1 transition-colors cursor-pointer"
                              title="Load message into SMS broadcaster"
                            >
                              <Megaphone className="w-3 h-3 text-amber-700" />
                              <span>Use in SMS Modal</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Typing / Loading indicator */}
              {isLoading && (
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-[#1A1A1A]/50">
                    <Sparkles className="w-3 h-3 text-amber-600 animate-spin" />
                    <span>Sentinel AI is analyzing...</span>
                  </div>
                  <div className="bg-white border border-[#1A1A1A]/15 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#1A1A1A]/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-[#1A1A1A]/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-[#1A1A1A]/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-3 py-2 bg-[#F4F1ED] border-t border-[#1A1A1A]/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-shrink-0">
              <span className="text-[10px] uppercase font-bold text-[#1A1A1A]/40 tracking-wider flex-shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Suggestions:</span>
              </span>
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isLoading}
                  className="text-[11px] px-2.5 py-1 bg-white hover:bg-[#1A1A1A] hover:text-white border border-[#1A1A1A]/15 rounded-lg text-[#1A1A1A] whitespace-nowrap transition-all duration-150 cursor-pointer disabled:opacity-50 shrink-0 shadow-2xs"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <div className="p-3 bg-white border-t border-[#1A1A1A]/15 flex-shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-end gap-2"
              >
                <div className="relative flex-1">
                  <textarea
                    ref={inputRef}
                    rows={1}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={`Ask Sentinel AI about ${currentSchool.name}...`}
                    disabled={isLoading}
                    className="w-full bg-[#F4F1ED] border border-[#1A1A1A]/15 rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 focus:outline-none focus:border-[#1A1A1A] focus:bg-white resize-none max-h-24 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="h-9 w-9 bg-[#1A1A1A] hover:bg-black disabled:bg-[#1A1A1A]/20 text-white rounded-xl flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed shrink-0 shadow-xs"
                  title="Send Message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <div className="mt-1.5 flex items-center justify-between text-[10px] text-[#1A1A1A]/40 px-1 font-mono">
                <span>Press Enter to send</span>
                <span>Powered by Gemini 3.7 Flash</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
