import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AttendanceStatus } from '../types';
import { 
  CheckCircle2, 
  UserX, 
  Clock, 
  Send, 
  Check, 
  Calendar, 
  Search, 
  Filter, 
  Sparkles,
  MessageSquare,
  FileCheck,
  AlertCircle
} from 'lucide-react';

export const AttendanceView: React.FC = () => {
  const {
    classes,
    students,
    attendanceRecords,
    selectedDate,
    setSelectedDate,
    selectedClassId,
    setSelectedClassId,
    updateAttendanceRecord,
    batchMarkAttendance,
    dispatchAbsenteeSMSForClass,
    openSMSModal,
    setSelectedStudentForDrawer,
    parentExcuseSubmissions,
    updateExcuseStatus,
    settings,
    addToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | AttendanceStatus>('all');
  const [showExcusePanel, setShowExcusePanel] = useState(true);

  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const classStudents = students.filter((s) => s.classId === currentClass.id);
  const classStudentIds = new Set(classStudents.map(s => s.id));

  // Get relevant parent excuse submissions
  const relevantExcuses = parentExcuseSubmissions.filter(excuse => 
    classStudentIds.has(excuse.studentId)
  );

  // Filter students
  const filteredStudents = classStudents.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          student.studentNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (filterStatus === 'all') return true;

    const record = attendanceRecords.find(
      (r) => r.studentId === student.id && r.date === selectedDate && r.classId === currentClass.id
    );
    const status = record ? record.status : 'present';
    return status === filterStatus;
  });

  // Calculate live tallies for this class
  const classRecords = attendanceRecords.filter(
    (r) => r.classId === currentClass.id && r.date === selectedDate
  );

  const getStudentStatus = (studentId: string): { status: AttendanceStatus; remarks: string; smsStatus: string } => {
    const record = classRecords.find((r) => r.studentId === studentId);
    if (record) {
      return { status: record.status, remarks: record.remarks, smsStatus: record.smsStatus };
    }
    return { status: 'present', remarks: '', smsStatus: 'not_sent' };
  };

  const presentCount = classStudents.filter((s) => getStudentStatus(s.id).status === 'present').length;
  const absentCount = classStudents.filter((s) => getStudentStatus(s.id).status === 'absent').length;
  const lateCount = classStudents.filter((s) => getStudentStatus(s.id).status === 'late').length;
  const excusedCount = classStudents.filter((s) => getStudentStatus(s.id).status === 'excused').length;

  const handleStatusToggle = (studentId: string, newStatus: AttendanceStatus) => {
    const current = getStudentStatus(studentId);
    updateAttendanceRecord(studentId, currentClass.id, newStatus, current.remarks);
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    const current = getStudentStatus(studentId);
    updateAttendanceRecord(studentId, currentClass.id, current.status, remarks);
  };

  const handleSingleStudentSMS = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    openSMSModal({
      studentId: student.id,
      studentName: student.name,
      guardianName: student.guardianName,
      guardianPhone: student.guardianPhone,
      className: currentClass.name,
      category: 'attendance_absence',
      defaultMessage: `${settings.schoolName} Alert: ${student.name} was recorded ABSENT for ${currentClass.name} on ${selectedDate}. Please contact the Main Office to verify.`
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-16 font-sans">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1A1A1A]/15 pb-6">
        <div>
          <div className="text-[9px] uppercase tracking-[0.25em] font-bold text-[#1A1A1A]/50 mb-2">
            Section 02 // Attendance Registry
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal italic text-[#1A1A1A] leading-tight tracking-tight">
            Attendance Roll Call
          </h2>
          <p className="text-sm text-[#1A1A1A]/70 mt-1.5 max-w-xl">
            Real-time classroom roll call verification and instant guardian SMS absence notifications.
          </p>
        </div>

        {/* Date Selector Badge */}
        <div className="inline-flex items-center gap-2 bg-[#FFFFFF] border border-[#1A1A1A]/20 px-4 py-2 rounded-full text-xs font-medium text-[#1A1A1A] shadow-xs">
          <Calendar className="w-3.5 h-3.5 text-[#1A1A1A]/60" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent text-[#1A1A1A] font-semibold text-xs focus:outline-none cursor-pointer"
          />
        </div>
      </div>

      {/* Class Selector & Roll Call Controls Header */}
      <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#1A1A1A]/12 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/60">
              Select Section:
            </label>
            <div className="flex flex-wrap gap-2">
              {classes.map((cls) => (
                <button
                  key={cls.id}
                  onClick={() => setSelectedClassId(cls.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    selectedClassId === cls.id
                      ? 'bg-[#1A1A1A] text-[#F4F1ED] shadow-xs'
                      : 'bg-[#E8E4DF] text-[#1A1A1A]/80 hover:bg-[#1A1A1A]/10'
                  }`}
                >
                  {cls.name}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-[#1A1A1A]/70 font-mono-code">
            Faculty: <span className="font-semibold text-[#1A1A1A]">{currentClass.teacher}</span> &bull; Room: <span className="font-semibold text-[#1A1A1A]">{currentClass.room}</span>
          </div>
        </div>

        {/* Roll Call Tallies Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#1A1A1A]/10">
          <div 
            onClick={() => setFilterStatus(filterStatus === 'present' ? 'all' : 'present')}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              filterStatus === 'present' ? 'bg-[#E2ECE1] border-[#2D5A27]/40 shadow-xs' : 'bg-[#F4F1ED] border-[#1A1A1A]/10 hover:bg-[#E8E4DF]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#1C3D18]">Present</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2D5A27]" />
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-light text-[#1A1A1A] mt-1">
              {presentCount}
            </div>
          </div>

          <div 
            onClick={() => setFilterStatus(filterStatus === 'absent' ? 'all' : 'absent')}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              filterStatus === 'absent' ? 'bg-[#FBF0F0] border-[#9B2C2C]/40 shadow-xs' : 'bg-[#F4F1ED] border-[#1A1A1A]/10 hover:bg-[#E8E4DF]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#9B2C2C]">Absent</span>
              <UserX className="w-3.5 h-3.5 text-[#9B2C2C]" />
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-light text-[#9B2C2C] mt-1">
              {absentCount}
            </div>
          </div>

          <div 
            onClick={() => setFilterStatus(filterStatus === 'late' ? 'all' : 'late')}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              filterStatus === 'late' ? 'bg-amber-50 border-amber-400 shadow-xs' : 'bg-[#F4F1ED] border-[#1A1A1A]/10 hover:bg-[#E8E4DF]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#B7791F]">Late / Tardy</span>
              <Clock className="w-3.5 h-3.5 text-[#B7791F]" />
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-light text-[#1A1A1A] mt-1">
              {lateCount}
            </div>
          </div>

          <div 
            onClick={() => setFilterStatus(filterStatus === 'excused' ? 'all' : 'excused')}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              filterStatus === 'excused' ? 'bg-[#EBF8FF] border-blue-400 shadow-xs' : 'bg-[#F4F1ED] border-[#1A1A1A]/10 hover:bg-[#E8E4DF]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#2C5282]">Excused</span>
              <FileCheck className="w-3.5 h-3.5 text-[#2C5282]" />
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-light text-[#1A1A1A] mt-1">
              {excusedCount}
            </div>
          </div>
        </div>

        {/* Quick Batch Operation Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#1A1A1A]/10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/60">Quick Batch:</span>
            <button
              onClick={() => batchMarkAttendance(currentClass.id, 'present')}
              className="px-3 py-1.5 bg-[#E2ECE1] hover:bg-[#D5E3D4] text-[#1C3D18] text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              Mark All Present
            </button>
            <button
              onClick={() => batchMarkAttendance(currentClass.id, 'absent')}
              className="px-3 py-1.5 bg-[#FBF0F0] hover:bg-[#F5E2E2] text-[#9B2C2C] text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <UserX className="w-3.5 h-3.5" />
              Mark All Absent
            </button>
          </div>

          {absentCount > 0 && (
            <button
              onClick={() => dispatchAbsenteeSMSForClass(currentClass.id)}
              className="px-4 py-2 bg-[#1A1A1A] hover:bg-black text-[#F4F1ED] text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              Dispatch SMS to {absentCount} Absent Guardians
            </button>
          )}
        </div>
      </div>

      {/* Parent Absence Excuse Submissions Inbox */}
      {relevantExcuses.length > 0 && (
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#1A1A1A]/15 shadow-xs overflow-hidden">
          <div className="bg-[#E8E4DF] px-5 py-3 border-b border-[#1A1A1A]/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#9B2C2C] animate-pulse" />
              <h3 className="font-serif text-base italic text-[#1A1A1A]">
                Incoming Parent Absence Notes ({relevantExcuses.length})
              </h3>
            </div>
            <button
              onClick={() => setShowExcusePanel(!showExcusePanel)}
              className="text-[10px] uppercase tracking-wider font-bold text-[#1A1A1A]/60 hover:text-[#1A1A1A] cursor-pointer"
            >
              {showExcusePanel ? 'Hide Notes' : 'Show Notes'}
            </button>
          </div>

          {showExcusePanel && (
            <div className="divide-y divide-[#1A1A1A]/10 p-2">
              {relevantExcuses.map((excuse) => {
                const student = students.find((s) => s.id === excuse.studentId);
                const isPending = excuse.status === 'pending';

                return (
                  <div key={excuse.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-[#F4F1ED]/50 rounded-xl transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#1A1A1A]">
                          {student?.name || excuse.studentName}
                        </span>
                        <span className="text-[10px] bg-[#E8E4DF] text-[#1A1A1A] px-2 py-0.5 rounded font-mono-code font-bold">
                          Date: {excuse.date}
                        </span>
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                          excuse.status === 'approved' 
                            ? 'bg-[#E2ECE1] text-[#1C3D18]' 
                            : excuse.status === 'acknowledged'
                            ? 'bg-[#EBF8FF] text-[#2C5282]'
                            : 'bg-[#FEFCBF] text-[#744210]'
                        }`}>
                          {excuse.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#1A1A1A]/80 italic">
                        "{excuse.reason}"
                      </p>
                      <div className="text-[11px] text-[#1A1A1A]/50 font-mono-code flex items-center gap-2">
                        <span>Submitted by: Guardian ({excuse.parentPhone})</span>
                        <span>&bull;</span>
                        <span>{new Date(excuse.submittedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {excuse.status !== 'approved' && (
                        <button
                          onClick={() => updateExcuseStatus(excuse.id, 'approved')}
                          className="px-3 py-1.5 bg-[#1A1A1A] hover:bg-black text-[#F4F1ED] text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5 text-[#2D5A27]" />
                          <span>Approve & Excuse</span>
                        </button>
                      )}
                      {excuse.status === 'pending' && (
                        <button
                          onClick={() => updateExcuseStatus(excuse.id, 'acknowledged')}
                          className="px-3 py-1.5 bg-[#E8E4DF] hover:bg-[#1A1A1A]/10 text-[#1A1A1A] text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                        >
                          Acknowledge
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#1A1A1A]/50 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student roster by name or ID..."
            className="w-full pl-9 pr-4 py-2 bg-[#FFFFFF] border border-[#1A1A1A]/15 rounded-lg text-xs focus:outline-none focus:border-[#1A1A1A] transition-colors"
          />
        </div>
        <div className="text-[11px] text-[#1A1A1A]/60 font-mono-code">
          Showing {filteredStudents.length} of {classStudents.length} students
        </div>
      </div>

      {/* High-Density Student Attendance Table / List */}
      <div className="bg-[#FFFFFF] rounded-xl border border-[#1A1A1A]/12 shadow-xs overflow-hidden">
        <div className="divide-y divide-[#1A1A1A]/10">
          {filteredStudents.map((student) => {
            const { status, remarks, smsStatus } = getStudentStatus(student.id);

            return (
              <div
                key={student.id}
                className={`p-4 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  status === 'absent' ? 'bg-[#FBF0F0]/40' : status === 'late' ? 'bg-amber-50/40' : 'hover:bg-[#F4F1ED]/50'
                }`}
              >
                {/* Student Info */}
                <div 
                  className="flex items-center gap-3 min-w-[240px] cursor-pointer"
                  onClick={() => setSelectedStudentForDrawer(student)}
                >
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-11 h-11 rounded-full object-cover border border-[#1A1A1A]/20 filter grayscale"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif text-base font-normal italic text-[#1A1A1A] hover:underline">
                        {student.name}
                      </h4>
                      {student.status === 'probation' && (
                        <span className="text-[9px] bg-[#FBF0F0] text-[#9B2C2C] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider border border-[#9B2C2C]/20">
                          Probation
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#1A1A1A]/60 font-mono-code">
                      <span>{student.studentNumber}</span>
                      <span>&bull;</span>
                      <span className={student.attendanceRate >= 95 ? 'text-[#2D5A27]' : 'text-[#9B2C2C]'}>
                        {student.attendanceRate}% avg
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4-State Attendance Toggle Selector */}
                <div className="flex items-center gap-1.5 bg-[#F4F1ED] p-1 rounded-lg border border-[#1A1A1A]/10">
                  <button
                    onClick={() => handleStatusToggle(student.id, 'present')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                      status === 'present'
                        ? 'bg-[#1A1A1A] text-[#F4F1ED] shadow-xs'
                        : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A]'
                    }`}
                  >
                    <Check className="w-3 h-3" />
                    Present
                  </button>

                  <button
                    onClick={() => handleStatusToggle(student.id, 'absent')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                      status === 'absent'
                        ? 'bg-[#9B2C2C] text-[#F4F1ED] shadow-xs'
                        : 'text-[#1A1A1A]/70 hover:text-[#9B2C2C]'
                    }`}
                  >
                    <UserX className="w-3 h-3" />
                    Absent
                  </button>

                  <button
                    onClick={() => handleStatusToggle(student.id, 'late')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                      status === 'late'
                        ? 'bg-[#B7791F] text-[#F4F1ED] shadow-xs'
                        : 'text-[#1A1A1A]/70 hover:text-[#B7791F]'
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    Late
                  </button>

                  <button
                    onClick={() => handleStatusToggle(student.id, 'excused')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                      status === 'excused'
                        ? 'bg-[#2C5282] text-[#F4F1ED] shadow-xs'
                        : 'text-[#1A1A1A]/70 hover:text-[#2C5282]'
                    }`}
                  >
                    Excused
                  </button>
                </div>

                {/* Remarks & Guardian Action */}
                <div className="flex items-center gap-3 flex-1 max-w-sm">
                  <input
                    type="text"
                    value={remarks}
                    onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                    placeholder="Add roll call note (e.g. medical, excused)..."
                    className="w-full text-xs px-3 py-1.5 bg-[#F4F1ED] border border-[#1A1A1A]/10 rounded-lg focus:outline-none focus:bg-white focus:border-[#1A1A1A]"
                  />

                  {status === 'absent' && (
                    <button
                      onClick={() => handleSingleStudentSMS(student.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 flex-shrink-0 transition-colors cursor-pointer ${
                        smsStatus === 'sent'
                          ? 'bg-[#E2ECE1] text-[#1C3D18] border border-[#2D5A27]/30'
                          : 'bg-[#1A1A1A] hover:bg-black text-[#F4F1ED]'
                      }`}
                      title="Send SMS alert to guardian"
                    >
                      <Send className="w-3 h-3" />
                      {smsStatus === 'sent' ? 'SMS Sent' : 'SMS Alert'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {filteredStudents.length === 0 && (
            <div className="p-8 text-center text-[#1A1A1A]/50 text-xs font-mono-code uppercase tracking-wider">
              No students found matching your search filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
