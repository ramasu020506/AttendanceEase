import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Check, 
  GraduationCap, 
  MapPin, 
  Clock, 
  Mail, 
  UploadCloud, 
  Layers
} from 'lucide-react';

export const CreateClassModal: React.FC = () => {
  const { 
    isCreateClassModalOpen, 
    setIsCreateClassModalOpen, 
    addClass, 
    openBulkUploadModal,
    currentSchool
  } = useApp();

  const [name, setName] = useState('');
  const [grade, setGrade] = useState('Grade 9');
  const [teacher, setTeacher] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [room, setRoom] = useState('Room 201');
  const [scheduleTime, setScheduleTime] = useState('08:00 AM - 09:30 AM');
  const [autoOpenBulk, setAutoOpenBulk] = useState(false);

  if (!isCreateClassModalOpen) return null;

  const handleSubmit = (e: React.FormEvent, proceedToBulk: boolean = false) => {
    e.preventDefault();
    if (!name.trim() || !teacher.trim()) {
      return;
    }

    const domain = currentSchool.code.toLowerCase().replace(/[^a-z0-9]/g, '') || 'school';
    const createdClass = addClass({
      name: name.trim(),
      grade,
      teacher: teacher.trim(),
      teacherEmail: teacherEmail.trim() || `${teacher.toLowerCase().replace(/\s+/g, '.')}@${domain}.edu`,
      room: room.trim() || 'Room 101',
      scheduleTime: scheduleTime.trim() || '08:00 AM - 09:30 AM',
    });

    // Reset fields
    setName('');
    setTeacher('');
    setTeacherEmail('');
    setRoom('Room 201');
    setIsCreateClassModalOpen(false);

    if (proceedToBulk || autoOpenBulk) {
      setTimeout(() => {
        openBulkUploadModal(createdClass.id);
      }, 100);
    }
  };

  const setPresetSchedule = (timeSlot: string) => {
    setScheduleTime(timeSlot);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-[#FFFFFF] w-full max-w-xl rounded-2xl shadow-2xl border border-[#1A1A1A]/20 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#1A1A1A] text-[#F4F1ED] flex items-center justify-between border-b border-[#1A1A1A]">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-white/10 rounded-lg">
              <Layers className="w-4 h-4 text-[#F4F1ED]" />
            </span>
            <div>
              <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#F4F1ED]/60">
                Academic Structure // Section Registry
              </div>
              <h3 className="font-serif text-xl font-normal italic text-[#F4F1ED]">
                Establish New Academic Class
              </h3>
            </div>
          </div>
          <button
            onClick={() => setIsCreateClassModalOpen(false)}
            className="p-1.5 text-[#F4F1ED]/70 hover:text-[#F4F1ED] hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={(e) => handleSubmit(e, false)} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto bg-[#FFFFFF]">
          {/* Section 1: Class Core Attributes */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/60 mb-3 flex items-center gap-1.5">
              1. Class Designation & Grade Level
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/70 mb-1">
                  Class / Homeroom Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Grade 11-A (Advanced Physics)"
                  className="w-full text-xs p-2.5 bg-[#F4F1ED] border border-[#1A1A1A]/15 rounded-lg font-serif text-[#1A1A1A] focus:outline-none focus:bg-white focus:border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/70 mb-1">
                  Grade Level
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[#F4F1ED] border border-[#1A1A1A]/15 rounded-lg font-mono-code text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                >
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 11">Grade 11</option>
                  <option value="Grade 12">Grade 12</option>
                  <option value="AP / Honors">AP / Honors</option>
                  <option value="Special Elective">Special Elective</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Faculty In-Charge */}
          <div className="pt-3 border-t border-[#1A1A1A]/10">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/60 mb-3 flex items-center gap-1.5">
              2. Faculty Allocation
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/70 mb-1 flex items-center gap-1">
                  <GraduationCap className="w-3 h-3 text-[#1A1A1A]" /> Teacher / Faculty Name *
                </label>
                <input
                  type="text"
                  required
                  value={teacher}
                  onChange={(e) => setTeacher(e.target.value)}
                  placeholder="e.g. Dr. Julian Montgomery"
                  className="w-full text-xs p-2.5 bg-[#F4F1ED] border border-[#1A1A1A]/15 rounded-lg font-serif text-[#1A1A1A] focus:outline-none focus:bg-white focus:border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/70 mb-1 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-[#1A1A1A]" /> Faculty Email
                </label>
                <input
                  type="email"
                  value={teacherEmail}
                  onChange={(e) => setTeacherEmail(e.target.value)}
                  placeholder="e.g. faculty@demoschool.edu"
                  className="w-full text-xs p-2.5 bg-[#F4F1ED] border border-[#1A1A1A]/15 rounded-lg font-mono-code text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Hall & Schedule Period */}
          <div className="pt-3 border-t border-[#1A1A1A]/10">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/60 mb-3 flex items-center gap-1.5">
              3. Room & Timetable Schedule
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/70 mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#1A1A1A]" /> Classroom / Lab / Wing
                </label>
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="e.g. Science Lab 304"
                  className="w-full text-xs p-2.5 bg-[#F4F1ED] border border-[#1A1A1A]/15 rounded-lg font-mono-code text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/70 mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#1A1A1A]" /> Meeting Period
                </label>
                <input
                  type="text"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  placeholder="e.g. 08:00 AM - 09:30 AM"
                  className="w-full text-xs p-2.5 bg-[#F4F1ED] border border-[#1A1A1A]/15 rounded-lg font-mono-code text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>
            </div>

            {/* Quick schedule preset pills */}
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[10px]">
              <span className="text-[#1A1A1A]/50 font-bold uppercase tracking-wider">Presets:</span>
              {[
                '08:00 AM - 09:30 AM',
                '09:45 AM - 11:15 AM',
                '11:45 AM - 01:15 PM',
                '01:30 PM - 03:00 PM',
              ].map((timeSlot) => (
                <button
                  type="button"
                  key={timeSlot}
                  onClick={() => setPresetSchedule(timeSlot)}
                  className={`px-2 py-0.5 rounded font-mono-code border transition-colors cursor-pointer ${
                    scheduleTime === timeSlot
                      ? 'bg-[#1A1A1A] text-[#F4F1ED] border-[#1A1A1A]'
                      : 'bg-[#E8E4DF] text-[#1A1A1A]/80 border-[#1A1A1A]/15 hover:bg-[#1A1A1A] hover:text-[#F4F1ED]'
                  }`}
                >
                  {timeSlot}
                </button>
              ))}
            </div>
          </div>

          {/* Action Choice Notice */}
          <div className="p-3.5 bg-[#F4F1ED] rounded-xl border border-[#1A1A1A]/12 text-xs flex items-start gap-2.5">
            <UploadCloud className="w-4 h-4 text-[#1A1A1A] flex-shrink-0 mt-0.5" />
            <div className="text-[11px] text-[#1A1A1A]/80 leading-relaxed">
              <strong className="text-[#1A1A1A]">Bulk Student Import Available:</strong> You can create this class empty, or choose <strong className="text-[#1A1A1A]">"Create & Upload Roster"</strong> to immediately upload or paste scholar records via CSV.
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#1A1A1A]/10">
            <button
              type="button"
              onClick={() => setIsCreateClassModalOpen(false)}
              className="w-full sm:w-auto px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#1A1A1A]/70 hover:bg-[#E8E4DF] rounded-lg transition-colors cursor-pointer text-center"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="submit"
                className="flex-1 sm:flex-initial px-4 py-2 bg-[#E8E4DF] hover:bg-[#1A1A1A] hover:text-[#F4F1ED] text-[#1A1A1A] text-xs font-bold uppercase tracking-wider rounded-lg border border-[#1A1A1A]/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                Create Section Only
              </button>

              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                className="flex-1 sm:flex-initial px-5 py-2 bg-[#1A1A1A] hover:bg-black text-[#F4F1ED] text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <UploadCloud className="w-4 h-4" />
                Create & Upload Roster
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
