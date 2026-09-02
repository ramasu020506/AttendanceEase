import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SMSCategory } from '../types';
import { SMS_TEMPLATES } from '../data/mockData';
import { 
  X, 
  Send, 
  Radio, 
  Smartphone, 
  Sparkles, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Check,
  Tag
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SMSAlertModal: React.FC = () => {
  const { 
    isSMSModalOpen, 
    closeSMSModal, 
    smsModalConfig, 
    students, 
    classes, 
    attendanceRecords, 
    selectedDate, 
    dispatchSMSAlert, 
    settings,
    addToast 
  } = useApp();

  const [recipientType, setRecipientType] = useState<'absentees' | 'class' | 'individual' | 'all'>(
    smsModalConfig?.studentId ? 'individual' : smsModalConfig?.className ? 'class' : 'absentees'
  );

  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    smsModalConfig?.studentId || (students[0]?.id || '')
  );

  const [selectedClassId, setSelectedClassId] = useState<string>(
    classes[0]?.id || ''
  );

  const [category, setCategory] = useState<SMSCategory>(
    smsModalConfig?.category || 'attendance_absence'
  );

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tpl-absence');
  const [messageContent, setMessageContent] = useState<string>(
    smsModalConfig?.defaultMessage || SMS_TEMPLATES[0].content
  );

  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendSuccessCount, setSendSuccessCount] = useState<number | null>(null);

  // Update if config changes
  useEffect(() => {
    if (smsModalConfig) {
      if (smsModalConfig.studentId) {
        setRecipientType('individual');
        setSelectedStudentId(smsModalConfig.studentId);
      }
      if (smsModalConfig.defaultMessage) {
        setMessageContent(smsModalConfig.defaultMessage);
      }
      if (smsModalConfig.category) {
        setCategory(smsModalConfig.category);
      }
    }
  }, [smsModalConfig]);

  if (!isSMSModalOpen) return null;

  // Selected student if individual
  const targetStudent = students.find((s) => s.id === selectedStudentId) || students[0];
  const targetClass = classes.find((c) => c.id === selectedClassId) || classes[0];

  // Calculate recipients list
  let recipientList: { name: string; phone: string; studentId?: string; studentName?: string; className?: string }[] = [];

  if (recipientType === 'absentees') {
    const todayAbsentees = attendanceRecords.filter(
      (r) => r.date === selectedDate && r.status === 'absent'
    );
    recipientList = todayAbsentees.map((r) => {
      const s = students.find((st) => st.id === r.studentId);
      return {
        name: s?.guardianName || 'Guardian',
        phone: s?.guardianPhone || '+1 (555) 000-0000',
        studentId: r.studentId,
        studentName: r.studentName,
        className: r.className,
      };
    });

    // If none marked absent in records yet, fallback to dummy absentees for demo preview
    if (recipientList.length === 0) {
      recipientList = [
        { name: 'Robert & Sarah Evans', phone: '+1 (555) 234-8901', studentId: 'stu-101', studentName: 'Lucas Evans', className: 'Grade 9-A' },
        { name: 'Patricia Walker', phone: '+1 (555) 456-7890', studentId: 'stu-103', studentName: 'Liam Walker', className: 'Grade 9-A' },
      ];
    }
  } else if (recipientType === 'class') {
    const classStudents = students.filter((s) => s.classId === selectedClassId);
    recipientList = classStudents.map((s) => ({
      name: s.guardianName,
      phone: s.guardianPhone,
      studentId: s.id,
      studentName: s.name,
      className: s.className,
    }));
  } else if (recipientType === 'individual') {
    recipientList = [
      {
        name: targetStudent.guardianName,
        phone: targetStudent.guardianPhone,
        studentId: targetStudent.id,
        studentName: targetStudent.name,
        className: targetStudent.className,
      },
    ];
  } else {
    // All
    recipientList = students.map((s) => ({
      name: s.guardianName,
      phone: s.guardianPhone,
      studentId: s.id,
      studentName: s.name,
      className: s.className,
    }));
  }

  // Calculate character length and SMS credits
  const charLength = messageContent.length;
  const creditsPerMessage = Math.ceil(charLength / 160) || 1;
  const totalCreditsNeeded = recipientList.length * creditsPerMessage;

  // Dynamic preview text interpolation
  const previewSample = messageContent
    .replace(/{{student_name}}/g, targetStudent.name)
    .replace(/{{guardian_name}}/g, targetStudent.guardianName)
    .replace(/{{class_name}}/g, targetStudent.className)
    .replace(/{{class}}/g, targetStudent.className)
    .replace(/{{date}}/g, selectedDate)
    .replace(/{{time}}/g, '08:15 AM')
    .replace(/{{teacher_name}}/g, 'Mr. Jonathan Hayes')
    .replace(/{{school_phone}}/g, '(555) 900-OAKW')
    .replace(/{{custom_status}}/g, 'Normal Operations');

  const insertVariable = (tag: string) => {
    setMessageContent((prev) => prev + ` {{${tag}}}`);
  };

  const handleApplyTemplate = (tplId: string) => {
    setSelectedTemplateId(tplId);
    const tpl = SMS_TEMPLATES.find((t) => t.id === tplId);
    if (tpl) {
      setMessageContent(tpl.content);
      setCategory(tpl.category);
    }
  };

  const handleDispatch = async () => {
    if (recipientList.length === 0) {
      addToast({
        title: 'No Recipients',
        message: 'Please select at least one valid recipient.',
        type: 'error',
      });
      return;
    }

    setIsSending(true);

    // Simulate sending delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Dispatch messages
    for (const recipient of recipientList) {
      const personalizedMessage = messageContent
        .replace(/{{student_name}}/g, recipient.studentName || 'Student')
        .replace(/{{guardian_name}}/g, recipient.name)
        .replace(/{{class_name}}/g, recipient.className || 'Class')
        .replace(/{{class}}/g, recipient.className || 'Class')
        .replace(/{{date}}/g, selectedDate)
        .replace(/{{time}}/g, new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

      await dispatchSMSAlert({
        recipientName: recipient.name,
        recipientPhone: recipient.phone,
        studentId: recipient.studentId,
        studentName: recipient.studentName,
        className: recipient.className,
        category,
        message: personalizedMessage,
        status: 'sent',
        creditsUsed: creditsPerMessage,
      });
    }

    setIsSending(false);
    setSendSuccessCount(recipientList.length);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {}

    addToast({
      title: 'SMS Dispatched',
      message: `Successfully sent ${recipientList.length} alert message(s) via Sentinel Gateway.`,
      type: 'success',
    });

    setTimeout(() => {
      closeSMSModal();
      setSendSuccessCount(null);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-[#FFFFFF] w-full max-w-4xl rounded-2xl shadow-2xl border border-[#1A1A1A]/20 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#1A1A1A] text-[#F4F1ED] flex items-center justify-between border-b border-[#1A1A1A]">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-white/10 rounded-lg">
              <Radio className="w-4 h-4 text-[#F4F1ED]" />
            </span>
            <div>
              <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#F4F1ED]/60">
                Direct Dispatch // Module 01
              </div>
              <h3 className="font-serif text-xl font-normal italic text-[#F4F1ED]">
                Sentinel SMS Alert Dispatcher
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-[11px] text-[#F4F1ED]/70 font-mono-code">
              Sender: {settings.smsSenderId} &bull; ({settings.remainingSMSCredits.toLocaleString()} credits)
            </span>
            <button
              onClick={closeSMSModal}
              className="p-1.5 text-[#F4F1ED]/70 hover:text-[#F4F1ED] hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Two Columns (Composer & Live Phone Mockup) */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto">
          {/* Left Column: Form & Composer */}
          <div className="lg:col-span-7 space-y-4">
            {/* Target Audience */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/60 mb-2">
                1. Target Audience
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => setRecipientType('absentees')}
                  className={`p-2.5 rounded-lg border font-bold uppercase tracking-wider text-[10px] transition-all text-center cursor-pointer ${
                    recipientType === 'absentees'
                      ? 'bg-[#1A1A1A] text-[#F4F1ED] border-[#1A1A1A]'
                      : 'bg-[#F4F1ED] border-[#1A1A1A]/15 text-[#1A1A1A]/80 hover:bg-[#E8E4DF]'
                  }`}
                >
                  Absentees Today
                </button>
                <button
                  onClick={() => setRecipientType('individual')}
                  className={`p-2.5 rounded-lg border font-bold uppercase tracking-wider text-[10px] transition-all text-center cursor-pointer ${
                    recipientType === 'individual'
                      ? 'bg-[#1A1A1A] text-[#F4F1ED] border-[#1A1A1A]'
                      : 'bg-[#F4F1ED] border-[#1A1A1A]/15 text-[#1A1A1A]/80 hover:bg-[#E8E4DF]'
                  }`}
                >
                  Single Scholar
                </button>
                <button
                  onClick={() => setRecipientType('class')}
                  className={`p-2.5 rounded-lg border font-bold uppercase tracking-wider text-[10px] transition-all text-center cursor-pointer ${
                    recipientType === 'class'
                      ? 'bg-[#1A1A1A] text-[#F4F1ED] border-[#1A1A1A]'
                      : 'bg-[#F4F1ED] border-[#1A1A1A]/15 text-[#1A1A1A]/80 hover:bg-[#E8E4DF]'
                  }`}
                >
                  Homeroom Cohort
                </button>
                <button
                  onClick={() => setRecipientType('all')}
                  className={`p-2.5 rounded-lg border font-bold uppercase tracking-wider text-[10px] transition-all text-center cursor-pointer ${
                    recipientType === 'all'
                      ? 'bg-[#1A1A1A] text-[#F4F1ED] border-[#1A1A1A]'
                      : 'bg-[#F4F1ED] border-[#1A1A1A]/15 text-[#1A1A1A]/80 hover:bg-[#E8E4DF]'
                  }`}
                >
                  All Guardians
                </button>
              </div>
            </div>

            {/* If Single Student or Class selected */}
            {recipientType === 'individual' && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/70 mb-1">
                  Choose Scholar:
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[#F4F1ED] border border-[#1A1A1A]/15 rounded-lg font-mono-code text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.className}) - Guardian: {s.guardianName} ({s.guardianPhone})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {recipientType === 'class' && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/70 mb-1">
                  Choose Homeroom Cohort:
                </label>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[#F4F1ED] border border-[#1A1A1A]/15 rounded-lg font-mono-code text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.studentCount} Students) - Teacher: {c.teacher}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Template Selector */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/60 mb-2">
                2. Select Template or Draft
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {SMS_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => handleApplyTemplate(tpl.id)}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      selectedTemplateId === tpl.id
                        ? 'bg-[#1A1A1A] text-[#F4F1ED] border-[#1A1A1A]'
                        : 'bg-[#F4F1ED] border-[#1A1A1A]/15 text-[#1A1A1A]/80 hover:bg-[#E8E4DF]'
                    }`}
                  >
                    <div className="font-serif text-sm font-normal italic">{tpl.title}</div>
                    <div className="text-[10px] opacity-70 truncate mt-0.5 font-mono-code">{tpl.content}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Message Body Composer */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/60">
                  3. Message Body
                </label>
                <span className="text-[10px] text-[#1A1A1A]/60 font-mono-code">
                  {charLength} chars &bull; {creditsPerMessage} segment ({totalCreditsNeeded} total credits)
                </span>
              </div>

              <textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                rows={4}
                className="w-full p-3 text-xs font-mono-code bg-[#F4F1ED] border border-[#1A1A1A]/15 rounded-xl focus:outline-none focus:bg-white focus:border-[#1A1A1A] leading-relaxed"
                placeholder="Enter SMS message text here..."
              />

              {/* Dynamic Variables Chips */}
              <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px]">
                <span className="text-[#1A1A1A]/60 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Tag className="w-3 h-3" /> Insert Tags:
                </span>
                {['student_name', 'guardian_name', 'class_name', 'date', 'time', 'school_phone'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => insertVariable(tag)}
                    className="px-2 py-0.5 bg-[#E8E4DF] hover:bg-[#1A1A1A] hover:text-[#F4F1ED] text-[#1A1A1A] rounded font-mono-code transition-colors cursor-pointer border border-[#1A1A1A]/15"
                  >
                    {`{{${tag}}}`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Live Phone Mockup Preview */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center bg-[#F4F1ED] p-4 rounded-2xl border border-[#1A1A1A]/10">
            <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/60 mb-3 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-[#1A1A1A]" />
              Live Guardian Mobile Preview
            </div>

            {/* Phone Frame */}
            <div className="w-64 bg-[#1A1A1A] rounded-[32px] p-3 shadow-xl border-4 border-[#2E2E2E] text-white">
              {/* Speaker notch */}
              <div className="w-20 h-3 bg-black rounded-full mx-auto mb-3" />

              {/* Phone screen */}
              <div className="bg-[#FAF8F5] rounded-[20px] p-3 min-h-[300px] flex flex-col justify-between text-[#1A1A1A]">
                {/* Header in phone */}
                <div className="text-center pb-2 border-b border-[#1A1A1A]/10">
                  <div className="text-[11px] font-bold font-mono-code">{settings.smsSenderId}</div>
                  <div className="text-[9px] text-[#1A1A1A]/50">Today {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>

                {/* SMS Chat Bubble */}
                <div className="my-auto">
                  <div className="bg-[#1A1A1A] text-[#F4F1ED] p-3 rounded-2xl rounded-bl-xs text-xs font-mono-code leading-relaxed shadow-sm">
                    {previewSample}
                  </div>
                  <div className="text-[9px] text-[#1A1A1A]/50 text-right mt-1 font-mono-code">Delivered &bull; Sentinel Gateway</div>
                </div>

                {/* Simulated reply bar */}
                <div className="bg-white p-1.5 rounded-full text-[10px] text-[#1A1A1A]/40 border border-[#1A1A1A]/15 flex items-center justify-between px-2.5">
                  <span>SMS Reply...</span>
                  <span className="w-4 h-4 bg-[#1A1A1A] rounded-full text-[#F4F1ED] flex items-center justify-center text-[8px]">&uarr;</span>
                </div>
              </div>
            </div>

            {/* Recipient summary */}
            <div className="mt-3 text-center text-xs text-[#1A1A1A]/70 font-mono-code">
              Dispatching to <strong className="text-[#1A1A1A]">{recipientList.length} guardian(s)</strong>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#F4F1ED] border-t border-[#1A1A1A]/10 flex items-center justify-between">
          <button
            onClick={closeSMSModal}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#1A1A1A]/70 hover:bg-[#E8E4DF] rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleDispatch}
            disabled={isSending || sendSuccessCount !== null}
            className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-[#F4F1ED] transition-all duration-150 flex items-center gap-2 shadow-sm cursor-pointer ${
              sendSuccessCount !== null
                ? 'bg-[#2D5A27]'
                : isSending
                ? 'bg-[#1A1A1A]/80 cursor-wait'
                : 'bg-[#1A1A1A] hover:bg-black active:scale-[0.98]'
            }`}
          >
            {sendSuccessCount !== null ? (
              <>
                <Check className="w-4 h-4" />
                Sent to {sendSuccessCount} Guardian(s)!
              </>
            ) : isSending ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Dispatching SMS...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Dispatch SMS ({totalCreditsNeeded} Credits)
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
