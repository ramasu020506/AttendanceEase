import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Student } from '../types';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  AlertCircle, 
  ChevronRight, 
  Send, 
  ShieldAlert,
  FileSpreadsheet,
  CheckCircle2,
  UploadCloud
} from 'lucide-react';

export const StudentsView: React.FC = () => {
  const { students, setSelectedStudentForDrawer, setIsAddStudentModalOpen, openBulkUploadModal, openSMSModal, settings } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'at_risk' | 'probation'>('all');

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.guardianName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.className.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedGrade !== 'all' && student.grade !== selectedGrade) return false;

    if (selectedStatusFilter === 'at_risk' && student.attendanceRate >= 90) return false;
    if (selectedStatusFilter === 'probation' && student.status !== 'probation') return false;

    return true;
  });

  const handleSendDirectSMS = (student: Student, e: React.MouseEvent) => {
    e.stopPropagation();
    openSMSModal({
      studentId: student.id,
      studentName: student.name,
      guardianName: student.guardianName,
      guardianPhone: student.guardianPhone,
      className: student.className,
      category: 'academic',
      defaultMessage: `Dear ${student.guardianName}, this is an update regarding ${student.name} from ${settings.schoolName}: `
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1A1A1A]/15 pb-6">
        <div>
          <div className="text-[9px] uppercase tracking-[0.25em] font-bold text-[#1A1A1A]/50 mb-2">
            Section 04 // Scholar Registry
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal italic text-[#1A1A1A] leading-tight tracking-tight">
            Student Directory
          </h2>
          <p className="text-sm text-[#1A1A1A]/70 mt-1.5 max-w-xl">
            Complete student roster, primary guardian contact profiles, and academic attendance tracking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          <button
            onClick={() => openBulkUploadModal()}
            className="px-4 py-2.5 bg-[#E8E4DF] hover:bg-[#1A1A1A] hover:text-[#F4F1ED] text-[#1A1A1A] text-xs font-bold uppercase tracking-wider rounded-lg border border-[#1A1A1A]/15 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <UploadCloud className="w-4 h-4" />
            Bulk Ingest Roster
          </button>

          <button
            onClick={() => setIsAddStudentModalOpen(true)}
            className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-black text-[#F4F1ED] text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Enroll Individual
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#1A1A1A]/12 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-[#1A1A1A]/50 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, ID (e.g. OA-2026-0814), guardian or cohort..."
              className="w-full pl-9 pr-4 py-2 bg-[#F4F1ED] border border-[#1A1A1A]/15 rounded-lg text-xs focus:outline-none focus:bg-white focus:border-[#1A1A1A]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {['all', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGrade(g)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  selectedGrade === g
                    ? 'bg-[#1A1A1A] text-[#F4F1ED]'
                    : 'bg-[#E8E4DF] text-[#1A1A1A]/80 hover:bg-[#1A1A1A]/10'
                }`}
              >
                {g === 'all' ? 'All Grades' : g}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 pt-3 border-t border-[#1A1A1A]/10 text-xs font-mono-code">
          <span className="text-[#1A1A1A]/60 uppercase tracking-wider text-[10px] font-bold">Filter By:</span>
          <button
            onClick={() => setSelectedStatusFilter('all')}
            className={`px-3 py-1 rounded-md text-xs cursor-pointer ${
              selectedStatusFilter === 'all' ? 'bg-[#1A1A1A] text-[#F4F1ED] font-bold' : 'text-[#1A1A1A]/70 hover:bg-[#E8E4DF]'
            }`}
          >
            All ({students.length})
          </button>
          <button
            onClick={() => setSelectedStatusFilter('at_risk')}
            className={`px-3 py-1 rounded-md text-xs cursor-pointer flex items-center gap-1.5 ${
              selectedStatusFilter === 'at_risk' ? 'bg-[#FBF0F0] text-[#9B2C2C] font-bold border border-[#9B2C2C]/30' : 'text-[#9B2C2C] hover:bg-[#FBF0F0]'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            At-Risk &lt;90% ({students.filter((s) => s.attendanceRate < 90).length})
          </button>
          <button
            onClick={() => setSelectedStatusFilter('probation')}
            className={`px-3 py-1 rounded-md text-xs cursor-pointer ${
              selectedStatusFilter === 'probation' ? 'bg-[#FBF0F0] text-[#9B2C2C] font-bold border border-[#9B2C2C]/30' : 'text-[#1A1A1A]/70 hover:bg-[#E8E4DF]'
            }`}
          >
            On Probation ({students.filter((s) => s.status === 'probation').length})
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-[#FFFFFF] rounded-xl border border-[#1A1A1A]/12 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F4F1ED] border-b border-[#1A1A1A]/10 text-[9px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/60">
              <tr>
                <th className="py-3.5 px-4">Student Profile</th>
                <th className="py-3.5 px-4">Grade & Homeroom</th>
                <th className="py-3.5 px-4">Primary Guardian</th>
                <th className="py-3.5 px-4">Attendance Rate</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]/10">
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  onClick={() => setSelectedStudentForDrawer(student)}
                  className="hover:bg-[#F4F1ED]/50 transition-colors cursor-pointer group"
                >
                  {/* Student */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-10 h-10 rounded-full object-cover border border-[#1A1A1A]/20 filter grayscale"
                      />
                      <div>
                        <div className="font-serif text-base font-normal italic text-[#1A1A1A] group-hover:underline transition-colors">
                          {student.name}
                        </div>
                        <div className="text-[11px] text-[#1A1A1A]/60 font-mono-code">
                          {student.studentNumber}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Grade & Section */}
                  <td className="py-3.5 px-4">
                    <div className="font-serif text-sm font-normal italic text-[#1A1A1A]">
                      {student.className}
                    </div>
                    <div className="text-[10px] text-[#1A1A1A]/50 uppercase tracking-wider font-mono-code">
                      {student.grade}
                    </div>
                  </td>

                  {/* Guardian */}
                  <td className="py-3.5 px-4">
                    <div className="text-xs font-semibold text-[#1A1A1A]">
                      {student.guardianName}
                    </div>
                    <div className="text-[11px] text-[#1A1A1A]/60 flex items-center gap-1 font-mono-code mt-0.5">
                      <Phone className="w-3 h-3" />
                      <span>{student.guardianPhone}</span>
                    </div>
                  </td>

                  {/* Attendance Rate */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold font-mono-code px-2 py-0.5 rounded-full border ${
                          student.attendanceRate >= 95
                            ? 'bg-[#E2ECE1] text-[#1C3D18] border-[#2D5A27]/30'
                            : student.attendanceRate >= 90
                            ? 'bg-amber-50 text-[#B7791F] border-amber-300'
                            : 'bg-[#FBF0F0] text-[#9B2C2C] border-[#9B2C2C]/30'
                        }`}
                      >
                        {student.attendanceRate}%
                      </span>
                      <span className="text-[10px] text-[#1A1A1A]/50 font-mono-code">
                        ({student.totalAbsent} absent)
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                        student.status === 'active'
                          ? 'text-[#1C3D18] bg-[#E2ECE1] border-[#2D5A27]/30'
                          : 'text-[#9B2C2C] bg-[#FBF0F0] border-[#9B2C2C]/30'
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={(e) => handleSendDirectSMS(student, e)}
                        className="p-2 text-[#1A1A1A] hover:bg-[#E8E4DF] rounded-lg transition-colors border border-[#1A1A1A]/10"
                        title="Send Direct SMS to Guardian"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setSelectedStudentForDrawer(student)}
                        className="p-2 text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-[#E8E4DF] rounded-lg transition-colors"
                        title="View Full Profile"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#1A1A1A]/50 text-xs font-mono-code uppercase tracking-wider">
                    No students match the search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
