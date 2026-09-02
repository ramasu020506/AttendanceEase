import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  GraduationCap, 
  Users, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Mail, 
  Plus, 
  Send,
  Calendar,
  Search,
  BookOpen,
  UploadCloud,
  Layers
} from 'lucide-react';

export const ClassesView: React.FC = () => {
  const { 
    classes, 
    students, 
    attendanceRecords, 
    selectedDate, 
    setSelectedClassId, 
    setActiveTab, 
    openSMSModal, 
    dispatchAbsenteeSMSForClass,
    setIsCreateClassModalOpen,
    openBulkUploadModal,
    settings
  } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClasses = classes.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.room.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTakeAttendance = (classId: string) => {
    setSelectedClassId(classId);
    setActiveTab('attendance');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1A1A1A]/15 pb-6">
        <div>
          <div className="text-[9px] uppercase tracking-[0.25em] font-bold text-[#1A1A1A]/50 mb-2">
            Section 03 // Academic Cohorts
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal italic text-[#1A1A1A] leading-tight tracking-tight">
            Academic Classes & Sections
          </h2>
          <p className="text-sm text-[#1A1A1A]/70 mt-1.5 max-w-xl">
            Manage homerooms, faculty allocations, student rosters, and roll call statuses.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#1A1A1A]/50 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search classes or faculty..."
              className="pl-9 pr-4 py-2 bg-[#FFFFFF] border border-[#1A1A1A]/15 rounded-lg text-xs focus:outline-none focus:border-[#1A1A1A]"
            />
          </div>

          <button
            onClick={() => openBulkUploadModal()}
            className="px-4 py-2 bg-[#E8E4DF] hover:bg-[#1A1A1A] hover:text-[#F4F1ED] text-[#1A1A1A] text-xs font-bold uppercase tracking-wider rounded-lg border border-[#1A1A1A]/15 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <UploadCloud className="w-4 h-4" />
            Bulk Ingest Roster
          </button>

          <button
            onClick={() => setIsCreateClassModalOpen(true)}
            className="px-4 py-2 bg-[#1A1A1A] hover:bg-black text-[#F4F1ED] text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Class
          </button>
        </div>
      </div>

      {/* Grid of Class Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((cls) => {
          const classStudents = students.filter((s) => s.classId === cls.id);
          const classRecords = attendanceRecords.filter((r) => r.classId === cls.id && r.date === selectedDate);
          const absentToday = classRecords.filter((r) => r.status === 'absent').length;
          const presentToday = classRecords.filter((r) => r.status === 'present').length;
          const isComplete = cls.attendanceTakenToday;

          return (
            <div
              key={cls.id}
              className="bg-[#FFFFFF] rounded-xl border border-[#1A1A1A]/12 hover:border-[#1A1A1A]/30 transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-xs"
            >
              <div className="p-6 border-b border-[#1A1A1A]/10">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A] bg-[#E8E4DF] px-2 py-0.5 rounded border border-[#1A1A1A]/10">
                    {cls.grade}
                  </span>
                  <span
                    className={`text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-full font-bold border ${
                      isComplete ? 'border-[#2D5A27]/30 bg-[#E2ECE1] text-[#1C3D18]' : 'border-[#9B2C2C]/30 bg-[#FBF0F0] text-[#9B2C2C]'
                    }`}
                  >
                    {isComplete ? 'Roll Call Done' : 'Pending'}
                  </span>
                </div>

                <h3 className="font-serif text-2xl font-normal italic text-[#1A1A1A] mb-1">
                  {cls.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-[#1A1A1A]/60 font-mono-code mb-4">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{cls.scheduleTime}</span>
                </div>

                <div className="space-y-2 text-xs text-[#1A1A1A]/80 bg-[#F4F1ED] p-3 rounded-lg border border-[#1A1A1A]/10">
                  <div className="flex items-center justify-between">
                    <span className="text-[#1A1A1A]/60 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-[#1A1A1A]" /> Faculty:
                    </span>
                    <span className="font-semibold text-[#1A1A1A]">{cls.teacher}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#1A1A1A]/60 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#1A1A1A]" /> Room:
                    </span>
                    <span className="font-semibold text-[#1A1A1A] font-mono-code">{cls.room}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#1A1A1A]/60 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#1A1A1A]" /> Enrolled:
                    </span>
                    <span className="font-bold text-[#1A1A1A] font-mono-code">{classStudents.length} Students</span>
                  </div>
                </div>

                {/* Today's Stats snippet */}
                <div className="mt-4 pt-3 border-t border-[#1A1A1A]/10 flex items-center justify-between text-xs font-mono-code">
                  <span className="text-[#2D5A27] font-semibold">
                    Present: {presentToday || (classStudents.length > 0 ? classStudents.length - (isComplete ? 1 : 0) : 0)}
                  </span>
                  <span className="text-[#9B2C2C] font-semibold">
                    Absent: {absentToday > 0 ? absentToday : (isComplete ? (classStudents.length > 0 ? 1 : 0) : 0)}
                  </span>
                  <span className="text-[#1A1A1A]/60">
                    Rate: <span className="font-bold text-[#1A1A1A]">{cls.attendanceRateToday}%</span>
                  </span>
                </div>
              </div>

              <div className="p-4 bg-[#F4F1ED] flex items-center justify-between gap-2 border-t border-[#1A1A1A]/10">
                <button
                  onClick={() => handleTakeAttendance(cls.id)}
                  className="flex-1 py-2 bg-[#1A1A1A] hover:bg-black text-[#F4F1ED] text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Take Attendance
                </button>

                <button
                  onClick={() => openBulkUploadModal(cls.id)}
                  className="p-2 bg-[#E8E4DF] hover:bg-[#1A1A1A] hover:text-[#F4F1ED] text-[#1A1A1A] rounded-lg transition-colors border border-[#1A1A1A]/10 cursor-pointer"
                  title={`Bulk upload students into ${cls.name}`}
                >
                  <UploadCloud className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    openSMSModal({
                      className: cls.name,
                      category: 'general_announcement',
                      defaultMessage: `${settings.schoolName} Announcement for ${cls.name}: `
                    });
                  }}
                  className="p-2 bg-[#E8E4DF] hover:bg-[#1A1A1A] hover:text-[#F4F1ED] text-[#1A1A1A] rounded-lg transition-colors border border-[#1A1A1A]/10 cursor-pointer"
                  title="Broadcast SMS to this class"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

