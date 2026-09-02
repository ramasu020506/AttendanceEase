import React, { useState } from 'react';
import { useApp, matchPhoneNumbers } from '../context/AppContext';
import { 
  User, 
  GraduationCap, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  FileText, 
  MessageSquare, 
  Send, 
  Phone, 
  Shield, 
  LogOut, 
  Sparkles, 
  ChevronRight,
  Info,
  HeartPulse,
  Mail,
  Building,
  School,
  ArrowRight,
  Bot
} from 'lucide-react';
import { AttendanceStatus } from '../types';

export const ParentPortalView: React.FC = () => {
  const { 
    parentSession, 
    students, 
    classes, 
    attendanceRecords, 
    smsAlerts, 
    settings, 
    logout,
    openChatbot,
    selectedChildIdForParent,
    setSelectedChildIdForParent,
    parentExcuseSubmissions,
    submitParentExcuse
  } = useApp();

  // Selected child logic
  const myChildren = students.filter((s) => parentSession?.studentIds.includes(s.id));
  
  const currentChild = myChildren.find((c) => c.id === selectedChildIdForParent) || myChildren[0] || null;

  // Form state for excuse note
  const [excuseDate, setExcuseDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [excuseReasonType, setExcuseReasonType] = useState<string>('Medical / Illness');
  const [excuseDetails, setExcuseDetails] = useState<string>('');
  const [isSubmittingExcuse, setIsSubmittingExcuse] = useState<boolean>(false);

  // Active sub-tab in parent portal
  const [activeParentTab, setActiveParentTab] = useState<'attendance' | 'excuses' | 'sms' | 'faculty'>('attendance');

  if (!parentSession || myChildren.length === 0 || !currentChild) {
    return (
      <div className="min-h-screen bg-[#F4F1ED] flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-[#FFFFFF] rounded-2xl border border-[#1A1A1A]/15 p-8 text-center shadow-lg">
          <div className="w-16 h-16 rounded-full bg-[#9B2C2C]/10 text-[#9B2C2C] flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl italic text-[#1A1A1A] mb-2">No Scholar Records Linked</h2>
          <p className="text-sm text-[#1A1A1A]/70 mb-6 leading-relaxed">
            No active student profiles are linked to the mobile number <span className="font-mono-code font-bold text-[#1A1A1A]">{parentSession?.phone || 'Unknown'}</span>.
          </p>
          <button
            onClick={logout}
            className="w-full py-3 bg-[#1A1A1A] text-[#F4F1ED] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-black transition-colors"
          >
            Return to Main Portal
          </button>
        </div>
      </div>
    );
  }

  // Get current child's class
  const childClass = classes.find((c) => c.id === currentChild.classId);

  // Get child's attendance records
  const childAttendance = attendanceRecords.filter((r) => r.studentId === currentChild.id);
  
  // Today's attendance
  const todayRecord = childAttendance.find((r) => r.date === '2026-08-29');

  // SMS alerts for this parent (scoped strictly to guardianPhone / parent phone)
  const parentSMS = smsAlerts.filter((alert) => 
    alert.studentId === currentChild.id ||
    (parentSession.phone && matchPhoneNumbers(alert.recipientPhone, parentSession.phone))
  );

  // Excuses for this child
  const childExcuses = parentExcuseSubmissions.filter((e) => e.studentId === currentChild.id);

  const handleExcuseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!excuseDetails.trim()) return;

    setIsSubmittingExcuse(true);
    const fullReason = `${excuseReasonType}: ${excuseDetails.trim()}`;
    submitParentExcuse(currentChild.id, excuseDate, fullReason);
    setExcuseDetails('');
    setIsSubmittingExcuse(false);
  };

  const getStatusBadge = (status?: AttendanceStatus) => {
    switch (status) {
      case 'present':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#2F4F2F]/10 text-[#2F4F2F] border border-[#2F4F2F]/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Present & On Time
          </span>
        );
      case 'late':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#B7791F]/15 text-[#B7791F] border border-[#B7791F]/25">
            <Clock className="w-3.5 h-3.5" />
            Tardy / Arrived Late
          </span>
        );
      case 'absent':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#9B2C2C]/10 text-[#9B2C2C] border border-[#9B2C2C]/20">
            <AlertCircle className="w-3.5 h-3.5" />
            Recorded Absent
          </span>
        );
      case 'excused':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#1A1A1A]/10 text-[#1A1A1A] border border-[#1A1A1A]/20">
            <FileText className="w-3.5 h-3.5" />
            Excused Absence
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#1A1A1A]/5 text-[#1A1A1A]/60">
            Pending Period Attendance
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1ED] text-[#1A1A1A] font-sans pb-20">
      {/* Top Parent Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#E8E4DF] border-b border-[#1A1A1A]/15 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full overflow-hidden bg-white border border-[#1A1A1A]/20 flex items-center justify-center p-0.5 flex-shrink-0">
            <img
              src={settings.logoUrl}
              alt={settings.schoolName}
              className="w-full h-full object-cover rounded-full filter grayscale"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="font-serif text-lg sm:text-xl font-normal italic text-[#1A1A1A] leading-tight">
              {settings.schoolName}
            </div>
            <div className="text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/60 flex items-center gap-1.5">
              <span>Parent Portal</span>
              <span>•</span>
              <span className="text-[#2F4F2F] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2F4F2F] animate-pulse" />
                Verified Guardian Session
              </span>
            </div>
          </div>
        </div>

        {/* Parent session info & Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => openChatbot(`I need help regarding ${currentChild.name}'s attendance or drafting an excuse note.`)}
            className="px-3 py-1.5 bg-[#1A1A1A] hover:bg-black text-amber-300 text-xs font-bold rounded-lg border border-[#1A1A1A] shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            title="Ask Sentinel AI Assistant"
          >
            <Bot className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline text-white">Ask AI Assistant</span>
          </button>

          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-[#1A1A1A] truncate max-w-[200px]">
              {parentSession.parentName || 'Registered Parent'}
            </span>
            <span className="text-[10px] font-mono-code text-[#1A1A1A]/60 flex items-center justify-end gap-1">
              <Phone className="w-2.5 h-2.5" />
              {parentSession.phone}
            </span>
          </div>

          <button
            id="parent-logout-btn"
            onClick={logout}
            className="px-3.5 py-1.5 bg-[#FFFFFF] hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-[#F4F1ED] text-xs font-bold uppercase tracking-wider rounded-lg border border-[#1A1A1A]/15 shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        
        {/* Child Selection Bar (If parent has multiple children) */}
        {myChildren.length > 1 && (
          <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#1A1A1A]/15 shadow-xs">
            <div className="text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/60 mb-2.5 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Select Scholar Profile ({myChildren.length} Registered Children)</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {myChildren.map((child) => {
                const isSelected = child.id === currentChild.id;
                return (
                  <button
                    key={child.id}
                    onClick={() => setSelectedChildIdForParent(child.id)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#1A1A1A] text-[#F4F1ED] border-[#1A1A1A] shadow-xs'
                        : 'bg-[#F4F1ED] hover:bg-[#E8E4DF] text-[#1A1A1A] border-[#1A1A1A]/15'
                    }`}
                  >
                    <img
                      src={child.avatar}
                      alt={child.name}
                      className="w-8 h-8 rounded-full object-cover filter grayscale border border-white/20"
                      referrerPolicy="no-referrer"
                    />
                    <div className="text-left">
                      <div className="text-xs font-bold leading-tight">{child.name}</div>
                      <div className={`text-[10px] ${isSelected ? 'text-white/70' : 'text-[#1A1A1A]/60'}`}>
                        {child.grade} • {child.className}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected Child Hero Banner */}
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#1A1A1A]/15 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#1A1A1A]/10">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-2xl overflow-hidden border border-[#1A1A1A]/20 bg-[#F4F1ED] flex-shrink-0 shadow-xs">
                <img
                  src={currentChild.avatar}
                  alt={currentChild.name}
                  className="w-full h-full object-cover filter grayscale"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-mono-code text-xs px-2 py-0.5 rounded bg-[#E8E4DF] text-[#1A1A1A] font-bold">
                    {currentChild.studentNumber}
                  </span>
                  <span className="text-xs font-bold text-[#1A1A1A]/60 uppercase tracking-wider">
                    {currentChild.grade}
                  </span>
                </div>

                <h1 className="font-serif text-2xl sm:text-3xl font-normal italic text-[#1A1A1A]">
                  {currentChild.name}
                </h1>

                <p className="text-xs text-[#1A1A1A]/70 mt-1 flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-[#1A1A1A]">{currentChild.className}</span>
                  <span>•</span>
                  <span>Room: {childClass?.room || 'Assigned Hall'}</span>
                  <span>•</span>
                  <span>Teacher: {childClass?.teacher || 'Homeroom Faculty'}</span>
                </p>
              </div>
            </div>

            {/* Attendance Rate Metric */}
            <div className="flex items-center gap-4 bg-[#F4F1ED] p-4 rounded-xl border border-[#1A1A1A]/10 self-start md:self-auto">
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/60">
                  Scholastic Attendance
                </div>
                <div className="font-mono-code text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
                  {currentChild.attendanceRate}%
                </div>
              </div>
              <div className="h-10 w-px bg-[#1A1A1A]/15" />
              <div className="text-xs space-y-0.5">
                <div className="text-[#2F4F2F] font-bold">{currentChild.totalPresent} Days Present</div>
                <div className="text-[#9B2C2C] font-semibold">{currentChild.totalAbsent} Absences</div>
                <div className="text-[#B7791F]">{currentChild.totalLate} Tardies</div>
              </div>
            </div>
          </div>

          {/* Today's Live Attendance Callout */}
          <div className="mt-6 p-4 sm:p-5 rounded-xl bg-[#E8E4DF]/50 border border-[#1A1A1A]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#1A1A1A]/15 text-[#1A1A1A]">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/60">
                  Today's Attendance Status (Aug 29, 2026)
                </div>
                <div className="text-sm font-semibold text-[#1A1A1A] mt-0.5 flex items-center gap-2">
                  <span>Section Session: {childClass?.scheduleTime || '08:00 AM - 09:30 AM'}</span>
                </div>
              </div>
            </div>

            <div>
              {getStatusBadge(todayRecord?.status || 'present')}
            </div>
          </div>
        </div>

        {/* Parent Portal Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#1A1A1A]/15 overflow-x-auto pb-px">
          <button
            onClick={() => setActiveParentTab('attendance')}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeParentTab === 'attendance'
                ? 'border-[#1A1A1A] text-[#1A1A1A]'
                : 'border-transparent text-[#1A1A1A]/50 hover:text-[#1A1A1A]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Attendance Records</span>
          </button>

          <button
            onClick={() => setActiveParentTab('excuses')}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeParentTab === 'excuses'
                ? 'border-[#1A1A1A] text-[#1A1A1A]'
                : 'border-transparent text-[#1A1A1A]/50 hover:text-[#1A1A1A]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Submit Absence Excuse</span>
            {childExcuses.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[#1A1A1A]/10 font-mono-code font-bold">
                {childExcuses.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveParentTab('sms')}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeParentTab === 'sms'
                ? 'border-[#1A1A1A] text-[#1A1A1A]'
                : 'border-transparent text-[#1A1A1A]/50 hover:text-[#1A1A1A]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>SMS Notifications</span>
            {parentSMS.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[#2F4F2F]/15 text-[#2F4F2F] font-mono-code font-bold">
                {parentSMS.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveParentTab('faculty')}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeParentTab === 'faculty'
                ? 'border-[#1A1A1A] text-[#1A1A1A]'
                : 'border-transparent text-[#1A1A1A]/50 hover:text-[#1A1A1A]'
            }`}
          >
            <School className="w-4 h-4" />
            <span>Faculty & Contacts</span>
          </button>
        </div>

        {/* TAB 1: Attendance Records & Timeline */}
        {activeParentTab === 'attendance' && (
          <div className="space-y-6">
            <div className="bg-[#FFFFFF] rounded-xl border border-[#1A1A1A]/15 overflow-hidden shadow-xs">
              <div className="p-4 sm:p-5 border-b border-[#1A1A1A]/10 flex items-center justify-between bg-[#F4F1ED]/50">
                <div>
                  <h3 className="font-serif text-lg italic text-[#1A1A1A]">Official Attendance Registry</h3>
                  <p className="text-xs text-[#1A1A1A]/60">Academic session logs recorded by faculty instructors</p>
                </div>
                <span className="text-xs font-mono-code text-[#1A1A1A]/70">
                  {childAttendance.length} Logged Entries
                </span>
              </div>

              {childAttendance.length === 0 ? (
                <div className="p-8 text-center text-sm text-[#1A1A1A]/60">
                  No attendance marks recorded for the active period.
                </div>
              ) : (
                <div className="divide-y divide-[#1A1A1A]/10">
                  {childAttendance.map((record) => (
                    <div key={record.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F4F1ED]/40 transition-colors">
                      <div className="flex items-start gap-3.5">
                        <div className="p-2 rounded-lg bg-[#E8E4DF] text-[#1A1A1A] flex-shrink-0 mt-0.5">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#1A1A1A]">{record.date}</span>
                            <span className="text-xs text-[#1A1A1A]/50 font-mono-code">{record.timeRecorded}</span>
                          </div>
                          <div className="text-xs text-[#1A1A1A]/70 mt-0.5">
                            {currentChild.className} • Recorded by {childClass?.teacher || 'Faculty Staff'}
                          </div>
                          {record.remarks && (
                            <div className="text-xs italic text-[#1A1A1A]/80 mt-1 bg-[#E8E4DF]/50 px-2.5 py-1 rounded inline-block">
                              Note: {record.remarks}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="self-start sm:self-auto">
                        {getStatusBadge(record.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Submit Absence Excuse */}
        {activeParentTab === 'excuses' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Form */}
            <div className="lg:col-span-6 bg-[#FFFFFF] rounded-xl border border-[#1A1A1A]/15 p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#1A1A1A]/10">
                <FileText className="w-5 h-5 text-[#1A1A1A]" />
                <div>
                  <h3 className="font-serif text-lg italic text-[#1A1A1A]">Submit Absence / Tardy Notice</h3>
                  <p className="text-xs text-[#1A1A1A]/60">Formal notice delivered directly to the Academic Office</p>
                </div>
              </div>

              <form onSubmit={handleExcuseSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-[#1A1A1A]/70 mb-1.5">
                    Date of Absence / Delay
                  </label>
                  <input
                    type="date"
                    value={excuseDate}
                    onChange={(e) => setExcuseDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-[#F4F1ED] border border-[#1A1A1A]/20 rounded-lg text-xs font-mono-code text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-[#1A1A1A]/70 mb-1.5">
                    Primary Reason Category
                  </label>
                  <select
                    value={excuseReasonType}
                    onChange={(e) => setExcuseReasonType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F4F1ED] border border-[#1A1A1A]/20 rounded-lg text-xs font-sans text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                  >
                    <option value="Medical / Illness">Medical / Severe Illness</option>
                    <option value="Doctor / Dental Appointment">Doctor / Dental Specialist Appointment</option>
                    <option value="Family Bereavement or Emergency">Family Bereavement or Emergency</option>
                    <option value="Transportation / Commute Delay">Transportation / Bus Commute Delay</option>
                    <option value="Religious Observance">Religious Observance</option>
                    <option value="Other Legitimate Circumstance">Other Legitimate Circumstance</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-[#1A1A1A]/70">
                      Detailed Explanation & Doctor Note Notes
                    </label>
                    <button
                      type="button"
                      onClick={() => openChatbot(`Please draft a polite, formal school absence excuse note for my child ${currentChild.name} (${currentChild.className}) regarding: ${excuseReasonType}`)}
                      className="text-[11px] text-amber-900 bg-amber-500/15 hover:bg-amber-500/25 px-2 py-0.5 rounded font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Sparkles className="w-3 h-3 text-amber-700" />
                      <span>Draft with AI Copilot</span>
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={excuseDetails}
                    onChange={(e) => setExcuseDetails(e.target.value)}
                    placeholder="Provide details regarding the reason for absence, expected return time, or medical treatment..."
                    required
                    className="w-full px-3.5 py-2.5 bg-[#F4F1ED] border border-[#1A1A1A]/20 rounded-lg text-xs font-sans text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] placeholder:text-[#1A1A1A]/40"
                  />
                </div>

                <div className="p-3 bg-[#E8E4DF]/60 rounded-lg text-xs text-[#1A1A1A]/70 flex items-start gap-2">
                  <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#1A1A1A]" />
                  <span>
                    Submissions are signed electronically with your verified mobile number <span className="font-mono-code font-bold">{parentSession.phone}</span>.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingExcuse || !excuseDetails.trim()}
                  className="w-full py-3 bg-[#1A1A1A] hover:bg-black disabled:opacity-50 text-[#F4F1ED] text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Formal Excuse</span>
                </button>
              </form>
            </div>

            {/* Submitted Excuses List */}
            <div className="lg:col-span-6 bg-[#FFFFFF] rounded-xl border border-[#1A1A1A]/15 p-6 shadow-xs flex flex-col">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1A1A1A]/10">
                <div>
                  <h3 className="font-serif text-lg italic text-[#1A1A1A]">Submission History</h3>
                  <p className="text-xs text-[#1A1A1A]/60">Status of submitted absence notifications</p>
                </div>
                <span className="text-xs font-mono-code text-[#1A1A1A]/60">
                  {childExcuses.length} Records
                </span>
              </div>

              {childExcuses.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-sm text-[#1A1A1A]/50">
                  <FileText className="w-8 h-8 opacity-30 mb-2" />
                  <p>No absence excuse notes submitted yet for {currentChild.name}.</p>
                </div>
              ) : (
                <div className="space-y-3 overflow-y-auto max-h-96 pr-1">
                  {childExcuses.map((excuse) => (
                    <div key={excuse.id} className="p-3.5 bg-[#F4F1ED] rounded-xl border border-[#1A1A1A]/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#1A1A1A] flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          Absence Date: {excuse.date}
                        </span>
                        
                        {excuse.status === 'approved' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#2F4F2F]/15 text-[#2F4F2F] border border-[#2F4F2F]/20">
                            Approved by Dean
                          </span>
                        )}
                        {excuse.status === 'acknowledged' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#B7791F]/15 text-[#B7791F] border border-[#B7791F]/25">
                            Under Review
                          </span>
                        )}
                        {excuse.status === 'pending' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#1A1A1A]/10 text-[#1A1A1A]/70">
                            Pending Review
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#1A1A1A]/80 leading-relaxed">
                        {excuse.reason}
                      </p>

                      <div className="text-[10px] text-[#1A1A1A]/50 font-mono-code">
                        Submitted: {excuse.submittedAt}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: SMS Alerts Dispatched to Parent */}
        {activeParentTab === 'sms' && (
          <div className="bg-[#FFFFFF] rounded-xl border border-[#1A1A1A]/15 overflow-hidden shadow-xs">
            <div className="p-4 sm:p-5 border-b border-[#1A1A1A]/10 flex items-center justify-between bg-[#F4F1ED]/50">
              <div>
                <h3 className="font-serif text-lg italic text-[#1A1A1A]">Official SMS Notification Archive</h3>
                <p className="text-xs text-[#1A1A1A]/60">
                  Direct mobile notifications dispatched to <span className="font-mono-code font-bold text-[#1A1A1A]">{parentSession.phone}</span>
                </p>
              </div>
              <span className="text-xs font-mono-code text-[#1A1A1A]/70">
                {parentSMS.length} Alerts Received
              </span>
            </div>

            {parentSMS.length === 0 ? (
              <div className="p-12 text-center text-sm text-[#1A1A1A]/60">
                <MessageSquare className="w-8 h-8 opacity-30 mx-auto mb-2" />
                <p>No SMS alerts have been dispatched to your mobile number yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#1A1A1A]/10">
                {parentSMS.map((alert) => (
                  <div key={alert.id} className="p-4 sm:p-5 hover:bg-[#F4F1ED]/30 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#1A1A1A] text-[#F4F1ED]">
                          {alert.category.replace('_', ' ')}
                        </span>
                        <span className="text-xs font-mono-code text-[#1A1A1A]/60">
                          {alert.timestamp}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#2F4F2F] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Delivered to Handset
                      </span>
                    </div>

                    <div className="bg-[#F4F1ED] p-3.5 rounded-lg text-xs text-[#1A1A1A] font-mono-code border border-[#1A1A1A]/10 leading-relaxed">
                      {alert.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Faculty & Contacts */}
        {activeParentTab === 'faculty' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Homeroom Faculty */}
            <div className="bg-[#FFFFFF] rounded-xl border border-[#1A1A1A]/15 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#1A1A1A]/10">
                <Building className="w-5 h-5 text-[#1A1A1A]" />
                <div>
                  <h3 className="font-serif text-lg italic text-[#1A1A1A]">Assigned Academic Section</h3>
                  <p className="text-xs text-[#1A1A1A]/60">Faculty instructor & classroom details</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[#F4F1ED] rounded-lg">
                  <div className="text-[10px] uppercase font-bold text-[#1A1A1A]/50 tracking-wider">Class Section</div>
                  <div className="font-bold text-sm text-[#1A1A1A] mt-0.5">{currentChild.className}</div>
                </div>

                <div className="p-3 bg-[#F4F1ED] rounded-lg">
                  <div className="text-[10px] uppercase font-bold text-[#1A1A1A]/50 tracking-wider">Faculty Teacher</div>
                  <div className="font-bold text-sm text-[#1A1A1A] mt-0.5">{childClass?.teacher || 'Dr. Assigned Faculty'}</div>
                  <div className="text-xs text-[#1A1A1A]/70 flex items-center gap-1 mt-1">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{childClass?.teacherEmail || 'faculty@demoschool.edu'}</span>
                  </div>
                </div>

                <div className="p-3 bg-[#F4F1ED] rounded-lg">
                  <div className="text-[10px] uppercase font-bold text-[#1A1A1A]/50 tracking-wider">Classroom & Hours</div>
                  <div className="font-bold text-sm text-[#1A1A1A] mt-0.5">{childClass?.room || 'Room 204'}</div>
                  <div className="text-xs text-[#1A1A1A]/70 flex items-center gap-1 mt-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{childClass?.scheduleTime || '08:00 AM - 09:30 AM'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Guardian & Health Records On File */}
            <div className="bg-[#FFFFFF] rounded-xl border border-[#1A1A1A]/15 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#1A1A1A]/10">
                <Shield className="w-5 h-5 text-[#1A1A1A]" />
                <div>
                  <h3 className="font-serif text-lg italic text-[#1A1A1A]">Registered Scholar Records</h3>
                  <p className="text-xs text-[#1A1A1A]/60">Information maintained on school registry</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[#F4F1ED] rounded-lg">
                  <div className="text-[10px] uppercase font-bold text-[#1A1A1A]/50 tracking-wider">Primary Guardian Contact</div>
                  <div className="font-bold text-sm text-[#1A1A1A] mt-0.5">{currentChild.guardianName} ({currentChild.guardianRelationship})</div>
                  <div className="text-xs font-mono-code text-[#1A1A1A]/70 mt-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{currentChild.guardianPhone}</span>
                  </div>
                </div>

                <div className="p-3 bg-[#F4F1ED] rounded-lg">
                  <div className="text-[10px] uppercase font-bold text-[#1A1A1A]/50 tracking-wider">Emergency Secondary Contact</div>
                  <div className="font-bold text-sm text-[#1A1A1A] mt-0.5">{currentChild.emergencyContact}</div>
                  <div className="text-xs font-mono-code text-[#1A1A1A]/70 mt-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{currentChild.emergencyPhone}</span>
                  </div>
                </div>

                {currentChild.medicalNotes && (
                  <div className="p-3 bg-[#9B2C2C]/5 border border-[#9B2C2C]/15 rounded-lg text-[#9B2C2C]">
                    <div className="text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
                      <HeartPulse className="w-3.5 h-3.5" />
                      <span>Health & Medical Notes on File</span>
                    </div>
                    <div className="text-xs mt-1 leading-relaxed">
                      {currentChild.medicalNotes}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
