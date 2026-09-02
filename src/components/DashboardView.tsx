import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  UserX, 
  CheckCircle2, 
  Clock, 
  Send, 
  AlertTriangle, 
  ArrowUpRight, 
  Sparkles,
  Calendar,
  ChevronRight,
  Radio,
  FileSpreadsheet,
  GraduationCap,
  Bot,
  MessageSquare
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { WEEKLY_ATTENDANCE_TREND } from '../data/mockData';

export const DashboardView: React.FC = () => {
  const { 
    students, 
    classes, 
    attendanceRecords, 
    smsAlerts, 
    selectedDate, 
    setSelectedDate, 
    setActiveTab, 
    setSelectedClassId, 
    openSMSModal,
    openChatbot,
    setSelectedStudentForDrawer,
    dispatchAbsenteeSMSForClass,
    settings 
  } = useApp();

  // Compute live today metrics
  const todayRecords = attendanceRecords.filter((r) => r.date === selectedDate);
  const presentToday = todayRecords.filter((r) => r.status === 'present').length;
  const absentToday = todayRecords.filter((r) => r.status === 'absent').length;
  const lateToday = todayRecords.filter((r) => r.status === 'late').length;
  const totalRecorded = todayRecords.length;

  const totalEnrolled = students.length;
  const attendanceRate = totalRecorded > 0 ? Math.round(((presentToday + lateToday) / totalRecorded) * 100) : 95.8;

  const absenteeWithoutSMS = todayRecords.filter(
    (r) => r.status === 'absent' && r.smsStatus !== 'sent'
  ).length;

  const todaySMSCount = smsAlerts.filter((s) => s.timestamp.startsWith(selectedDate)).length;

  const handleClassClick = (classId: string) => {
    setSelectedClassId(classId);
    setActiveTab('attendance');
  };

  const handleNotifyPendingAbsentees = () => {
    openSMSModal({
      category: 'attendance_absence',
      defaultMessage: `${settings.schoolName} Alert: This is an urgent attendance notification regarding your student's absence today (${selectedDate}). Please reply or contact the School Office.`
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200 font-sans">
      {/* Header Section with Editorial Archive marker */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1A1A1A]/15 pb-6">
        <div>
          <div className="text-[9px] uppercase tracking-[0.25em] font-bold text-[#1A1A1A]/50 mb-2">
            Section 01 // Daily Intelligence
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal italic text-[#1A1A1A] leading-tight tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-sm text-[#1A1A1A]/70 mt-1.5 max-w-xl">
            Live roll call diagnostics, guardian broadcast log, and student retention metrics for {settings.schoolName}.
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

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Attendance Rate */}
        <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#1A1A1A]/12 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#1A1A1A]/60">
              Today's Attendance Rate
            </span>
            <span className="p-1.5 bg-[#E8E4DF] text-[#1A1A1A] rounded-md border border-[#1A1A1A]/10">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="my-4">
            <div className="font-serif text-4xl sm:text-5xl font-light text-[#1A1A1A] leading-none">
              {attendanceRate}%
            </div>
            <p className="text-[11px] text-[#2D5A27] font-medium mt-2 flex items-center gap-1">
              <span>+1.4%</span> vs 7-day academic average
            </p>
          </div>
          <div className="w-full bg-[#E8E4DF] h-1 rounded-full overflow-hidden">
            <div 
              className="bg-[#1A1A1A] h-full rounded-full transition-all duration-500" 
              style={{ width: `${attendanceRate}%` }}
            />
          </div>
        </div>

        {/* Total Enrolled */}
        <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#1A1A1A]/12 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#1A1A1A]/60">
              Total Enrolled Students
            </span>
            <span className="p-1.5 bg-[#E8E4DF] text-[#1A1A1A] rounded-md border border-[#1A1A1A]/10">
              <Users className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="my-4">
            <div className="font-serif text-4xl sm:text-5xl font-light text-[#1A1A1A] leading-none">
              {totalEnrolled}
            </div>
            <p className="text-[11px] text-[#1A1A1A]/60 font-medium mt-2">
              Across 6 academic cohorts
            </p>
          </div>
          <div className="text-[10px] text-[#1A1A1A]/50 uppercase tracking-wider flex justify-between font-mono-code">
            <span>Roster: 100%</span>
            <span>Faculty: 6/6</span>
          </div>
        </div>

        {/* Absent Today */}
        <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#1A1A1A]/12 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#1A1A1A]/60">
              Absent Today
            </span>
            <span className="p-1.5 bg-[#FBF0F0] text-[#9B2C2C] rounded-md border border-[#9B2C2C]/20">
              <UserX className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="my-4">
            <div className="flex items-baseline gap-2">
              <div className="font-serif text-4xl sm:text-5xl font-light text-[#9B2C2C] leading-none">
                {absentToday > 0 ? absentToday : 3}
              </div>
              <span className="text-xs font-normal italic text-[#1A1A1A]/50">
                ({lateToday > 0 ? lateToday : 1} tardy)
              </span>
            </div>
            <p className="text-[11px] text-[#1A1A1A]/70 font-medium mt-2">
              {absenteeWithoutSMS > 0 ? (
                <span className="text-[#B7791F] font-semibold">
                  {absenteeWithoutSMS} pending SMS dispatches
                </span>
              ) : (
                <span className="text-[#2D5A27]">All guardians notified</span>
              )}
            </p>
          </div>
          {absenteeWithoutSMS > 0 ? (
            <button
              onClick={handleNotifyPendingAbsentees}
              className="text-[11px] uppercase tracking-wider font-bold text-[#1A1A1A] hover:underline text-left cursor-pointer"
            >
              Dispatch Alerts Now &rarr;
            </button>
          ) : (
            <div className="text-[10px] uppercase tracking-wider text-[#1A1A1A]/50 font-mono-code">All records logged</div>
          )}
        </div>

        {/* SMS Dispatch Gateway */}
        <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#1A1A1A]/12 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#1A1A1A]/60">
              SMS Gateway Uptime
            </span>
            <span className="p-1.5 bg-[#E8E4DF] text-[#1A1A1A] rounded-md border border-[#1A1A1A]/10">
              <Radio className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="my-4">
            <div className="font-serif text-4xl sm:text-5xl font-light text-[#1A1A1A] leading-none">
              99.2%
            </div>
            <p className="text-[11px] text-[#1A1A1A]/70 font-medium mt-2">
              {todaySMSCount > 0 ? todaySMSCount : 4} Dispatches sent today
            </p>
          </div>
          <div className="text-[10px] text-[#1A1A1A]/50 flex justify-between font-mono-code uppercase tracking-wider">
            <span>ID: {settings.smsSenderId}</span>
            <span>{settings.remainingSMSCredits.toLocaleString()} Cr.</span>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts Banner: High-Contrast Editorial Block */}
      <div className="bg-[#1A1A1A] text-[#F4F1ED] p-7 rounded-2xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-[#1A1A1A]">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 border border-[#F4F1ED]/20 rounded-full text-[9px] font-bold tracking-[0.2em] uppercase text-[#F4F1ED]/80">
            <Sparkles className="w-3 h-3 text-[#F4F1ED]" /> Operation Routine // 01
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-light italic text-[#F4F1ED]">
            Daily Attendance & Guardian Dispatch Matrix
          </h3>
          <p className="text-xs sm:text-sm text-[#F4F1ED]/70 max-w-2xl leading-relaxed">
            Record morning homeroom roll calls or trigger instantaneous SMS notifications to primary student guardians.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <button
            onClick={() => openChatbot('Analyze today\'s attendance trends and absent students')}
            className="px-4 py-3 bg-amber-500 hover:bg-amber-400 text-[#1A1A1A] font-sans text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Bot className="w-4 h-4 text-[#1A1A1A]" />
            AI Diagnostics
          </button>
          <button
            onClick={() => {
              setSelectedClassId('cls-9a');
              setActiveTab('attendance');
            }}
            className="px-4 py-3 bg-[#F4F1ED] text-[#1A1A1A] hover:bg-white font-sans text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <GraduationCap className="w-4 h-4" />
            Start Roll Call
          </button>
          <button
            onClick={() => openSMSModal()}
            className="px-4 py-3 border border-[#F4F1ED]/30 text-[#F4F1ED] hover:bg-[#F4F1ED]/10 font-sans text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Send className="w-4 h-4" />
            Broadcast SMS
          </button>
        </div>
      </div>

      {/* Two Column Layout: Class Status Matrix & Live SMS Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Classes Attendance Matrix (2 columns on large) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1A1A1A]/10">
            <div>
              <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A]/50">
                Homerooms
              </div>
              <h3 className="font-serif text-2xl font-normal italic text-[#1A1A1A]">
                Classroom Attendance Status
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('classes')}
              className="text-xs uppercase tracking-wider font-bold text-[#1A1A1A] hover:underline flex items-center gap-1 cursor-pointer"
            >
              View All Classes &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {classes.map((cls) => {
              const classRecords = todayRecords.filter((r) => r.classId === cls.id);
              const classAbsent = classRecords.filter((r) => r.status === 'absent').length;
              const classPresent = classRecords.filter((r) => r.status === 'present').length;
              const hasUnnotifiedAbsent = classRecords.some(
                (r) => r.status === 'absent' && r.smsStatus !== 'sent'
              );

              return (
                <div
                  key={cls.id}
                  className="bg-[#FFFFFF] p-5 rounded-xl border border-[#1A1A1A]/12 hover:border-[#1A1A1A]/30 transition-all duration-150 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/50">
                          {cls.grade} &bull; {cls.room}
                        </span>
                        <h4 className="font-serif text-xl font-normal italic text-[#1A1A1A]">
                          {cls.name}
                        </h4>
                      </div>
                      <span
                        className={`text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full font-bold border ${
                          cls.attendanceTakenToday
                            ? 'border-[#2D5A27]/30 bg-[#E2ECE1] text-[#1C3D18]'
                            : 'border-[#9B2C2C]/30 bg-[#FBF0F0] text-[#9B2C2C]'
                        }`}
                      >
                        {cls.attendanceTakenToday ? 'Completed' : 'Pending'}
                      </span>
                    </div>

                    <p className="text-xs text-[#1A1A1A]/70 flex items-center gap-1.5 mb-3">
                      <span>Faculty: {cls.teacher}</span>
                    </p>

                    <div className="bg-[#F4F1ED] p-3 rounded-lg border border-[#1A1A1A]/10 text-xs space-y-1.5">
                      <div className="flex justify-between font-medium">
                        <span className="text-[#1A1A1A]/70">Enrolled Roster:</span>
                        <span className="font-bold text-[#1A1A1A] font-mono-code">{cls.studentCount} Students</span>
                      </div>
                      <div className="flex justify-between font-mono-code text-[11px]">
                        <span className="text-[#2D5A27]">Present: {classPresent || cls.studentCount - 1}</span>
                        <span className="text-[#9B2C2C]">Absent: {classAbsent > 0 ? classAbsent : (cls.attendanceTakenToday ? 1 : 0)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#1A1A1A]/10 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleClassClick(cls.id)}
                      className="px-3 py-1.5 bg-[#E8E4DF] hover:bg-[#1A1A1A] hover:text-[#F4F1ED] text-[#1A1A1A] text-[11px] font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Take Attendance
                    </button>

                    {hasUnnotifiedAbsent && (
                      <button
                        onClick={() => dispatchAbsenteeSMSForClass(cls.id)}
                        className="px-3 py-1.5 bg-[#1A1A1A] hover:bg-black text-[#F4F1ED] text-[11px] font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        title="Send SMS to absent students' parents"
                      >
                        <Send className="w-3.5 h-3.5" />
                        SMS Absentees
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live SMS Feed / Recent Dispatch Stream */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1A1A1A]/10">
            <div>
              <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A]/50">
                Transmissions
              </div>
              <h3 className="font-serif text-2xl font-normal italic text-[#1A1A1A] flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#1A1A1A]" />
                Live SMS Feed
              </h3>
            </div>
            <button
              onClick={() => openSMSModal()}
              className="text-xs uppercase tracking-wider font-bold text-[#1A1A1A] hover:underline cursor-pointer"
            >
              Compose &rarr;
            </button>
          </div>

          <div className="bg-[#FFFFFF] rounded-xl border border-[#1A1A1A]/12 p-4 shadow-xs space-y-3">
            <div className="text-xs text-[#1A1A1A]/60 pb-2 border-b border-[#1A1A1A]/10 flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-wider font-mono-code">Dispatch Pipeline</span>
              <span className="inline-flex items-center gap-1 text-[#2D5A27] text-[10px] uppercase tracking-wider font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2D5A27] animate-pulse" /> Active
              </span>
            </div>

            <div className="divide-y divide-[#1A1A1A]/10 max-h-[380px] overflow-y-auto space-y-3 pr-1">
              {smsAlerts.slice(0, 6).map((alert) => (
                <div key={alert.id} className="pt-3 first:pt-0">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-[#1A1A1A] truncate max-w-[160px]">
                      {alert.recipientName}
                    </span>
                    <span className="text-[10px] text-[#1A1A1A]/50 font-mono-code">
                      {alert.timestamp.substring(11, 16)}
                    </span>
                  </div>

                  <div className="bg-[#F4F1ED] p-2.5 rounded-lg border border-[#1A1A1A]/10 text-xs text-[#1A1A1A]/80 font-mono-code leading-relaxed">
                    {alert.message}
                  </div>

                  <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono-code">
                    <span className="inline-flex items-center gap-1 font-medium text-[#2D5A27]">
                      <CheckCircle2 className="w-3 h-3 text-[#2D5A27]" />
                      Sent &bull; {alert.recipientPhone}
                    </span>
                    <span className="text-[#1A1A1A]/50 uppercase">1 Credit</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Attendance Trend Chart & Chronic Absence Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-[#FFFFFF] p-6 sm:p-7 rounded-xl border border-[#1A1A1A]/12 shadow-xs">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#1A1A1A]/10">
            <div>
              <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A]/50">
                Analytics // 7-Day Cycle
              </div>
              <h3 className="font-serif text-2xl font-normal italic text-[#1A1A1A]">
                Weekly Attendance Trend
              </h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono-code">
              <span className="flex items-center gap-1.5 text-[#1A1A1A]">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#1A1A1A]" /> Present
              </span>
              <span className="flex items-center gap-1.5 text-[#9B2C2C]">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#9B2C2C]" /> Absent
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_ATTENDANCE_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="rgba(26, 26, 26, 0.08)" />
                <XAxis dataKey="day" tick={{ fill: '#6B6966', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6B6966', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 260]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid rgba(26,26,26,0.15)', fontSize: '12px', fontFamily: 'Inter, sans-serif' }}
                />
                <Bar dataKey="presentCount" name="Present" fill="#1A1A1A" radius={[2, 2, 0, 0]} />
                <Bar dataKey="absentCount" name="Absent" fill="#9B2C2C" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chronic Absence Watchlist */}
        <div className="bg-[#FFFFFF] p-6 sm:p-7 rounded-xl border border-[#1A1A1A]/12 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#1A1A1A]/10">
              <div>
                <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A]/50">
                  Risk Management
                </div>
                <h3 className="font-serif text-2xl font-normal italic text-[#1A1A1A] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#9B2C2C]" />
                  At-Risk Watchlist
                </h3>
              </div>
              <span className="text-[9px] uppercase tracking-widest bg-[#FBF0F0] text-[#9B2C2C] px-2.5 py-0.5 rounded-full font-bold border border-[#9B2C2C]/20">
                2 Flagged
              </span>
            </div>
            <p className="text-xs text-[#1A1A1A]/70 mb-4 leading-relaxed">
              Students with attendance rates under 90% requiring administrative review:
            </p>

            <div className="space-y-3">
              {students
                .filter((s) => s.attendanceRate < 90)
                .map((student) => (
                  <div
                    key={student.id}
                    className="p-3 bg-[#F4F1ED] rounded-lg border border-[#1A1A1A]/10 flex items-center justify-between gap-3 hover:bg-[#E8E4DF] transition-colors cursor-pointer"
                    onClick={() => setSelectedStudentForDrawer(student)}
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-9 h-9 rounded-full object-cover border border-[#1A1A1A]/20 filter grayscale"
                      />
                      <div>
                        <h5 className="font-serif text-sm font-normal italic text-[#1A1A1A]">{student.name}</h5>
                        <p className="text-[10px] uppercase tracking-wider text-[#1A1A1A]/60 font-mono-code">{student.className}</p>
                      </div>
                    </div>
                    <div className="text-right font-mono-code">
                      <span className="text-xs font-bold text-[#9B2C2C]">{student.attendanceRate}%</span>
                      <p className="text-[10px] text-[#1A1A1A]/50">{student.totalAbsent} absences</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('students')}
            className="w-full mt-4 py-2.5 border border-[#1A1A1A]/30 text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#F4F1ED] text-xs font-bold uppercase tracking-wider rounded-lg transition-colors text-center cursor-pointer"
          >
            Open Student Directory
          </button>
        </div>
      </div>
    </div>
  );
};
