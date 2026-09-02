import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Phone, 
  Mail, 
  Send, 
  UserCheck, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  Shield, 
  FileText, 
  CheckCircle2,
  Edit2
} from 'lucide-react';

export const StudentProfileDrawer: React.FC = () => {
  const { 
    selectedStudentForDrawer, 
    setSelectedStudentForDrawer, 
    attendanceRecords, 
    smsAlerts, 
    openSMSModal,
    updateStudent,
    settings 
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [editedNotes, setEditedNotes] = useState('');
  const [editedStatus, setEditedStatus] = useState<'active' | 'probation' | 'inactive'>('active');

  if (!selectedStudentForDrawer) return null;
  const student = selectedStudentForDrawer;

  // Student specific records
  const studentAttendance = attendanceRecords.filter((r) => r.studentId === student.id);
  const studentSMS = smsAlerts.filter((s) => s.studentId === student.id);

  const handleSaveEdit = () => {
    updateStudent({
      ...student,
      notes: editedNotes || student.notes,
      status: editedStatus,
    });
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    setEditedNotes(student.notes || '');
    setEditedStatus(student.status);
    setIsEditing(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 flex justify-end animate-in fade-in duration-200 font-sans">
      <div className="w-full max-w-xl bg-[#FFFFFF] h-full shadow-2xl flex flex-col justify-between border-l border-[#1A1A1A]/15 overflow-y-auto">
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#1A1A1A]/12 bg-[#F4F1ED]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A] bg-[#E8E4DF] px-2.5 py-1 rounded border border-[#1A1A1A]/15">
              Scholar Record // Profile Dossier
            </span>
            <button
              onClick={() => setSelectedStudentForDrawer(null)}
              className="p-1.5 text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-[#E8E4DF] rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#1A1A1A] shadow-sm filter grayscale"
            />
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl font-normal italic text-[#1A1A1A]">
                {student.name}
              </h3>
              <div className="flex items-center gap-2 text-xs text-[#1A1A1A]/60 font-mono-code mt-0.5">
                <span>{student.studentNumber}</span>
                <span>&bull;</span>
                <span className="font-semibold text-[#1A1A1A]">{student.className}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="p-6 space-y-6 flex-1 bg-[#FFFFFF]">
          {/* Attendance KPI Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 bg-[#F4F1ED] rounded-xl border border-[#1A1A1A]/10 text-center">
              <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#1A1A1A]/60">Attendance</span>
              <div className={`font-serif text-2xl sm:text-3xl font-light mt-1 ${
                student.attendanceRate >= 95 ? 'text-[#1C3D18]' : 'text-[#9B2C2C]'
              }`}>
                {student.attendanceRate}%
              </div>
            </div>

            <div className="p-4 bg-[#F4F1ED] rounded-xl border border-[#1A1A1A]/10 text-center">
              <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#9B2C2C]">Absences</span>
              <div className="font-serif text-2xl sm:text-3xl font-light text-[#9B2C2C] mt-1">
                {student.totalAbsent}
              </div>
            </div>

            <div className="p-4 bg-[#F4F1ED] rounded-xl border border-[#1A1A1A]/10 text-center">
              <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#B7791F]">Tardies</span>
              <div className="font-serif text-2xl sm:text-3xl font-light text-[#B7791F] mt-1">
                {student.totalLate}
              </div>
            </div>
          </div>

          {/* Primary Guardian & Emergency Contacts */}
          <div className="bg-[#F4F1ED] p-5 rounded-xl border border-[#1A1A1A]/10 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#1A1A1A]/10">
              <h4 className="font-serif text-lg font-normal italic text-[#1A1A1A]">
                Primary Guardian Contact
              </h4>
              <span className="text-[10px] uppercase font-mono-code text-[#1A1A1A]/60">
                {student.guardianRelationship}
              </span>
            </div>

            <div className="space-y-2 text-xs text-[#1A1A1A]/80">
              <div className="flex items-center justify-between">
                <span className="text-[#1A1A1A]/60">Guardian Name:</span>
                <span className="font-serif font-normal italic text-[#1A1A1A]">{student.guardianName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#1A1A1A]/60">Parent Login Mobile:</span>
                <span className="font-mono-code font-bold text-[#1A1A1A] bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#1A1A1A]/15">
                  {student.guardianPhone}
                </span>
              </div>
              {student.studentPhone && (
                <div className="flex items-center justify-between">
                  <span className="text-[#1A1A1A]/60">Student Direct Mobile:</span>
                  <span className="font-mono-code text-[#1A1A1A]">
                    {student.studentPhone}
                  </span>
                </div>
              )}
              {student.guardianEmail && (
                <div className="flex items-center justify-between">
                  <span className="text-[#1A1A1A]/60">Guardian Email:</span>
                  <a href={`mailto:${student.guardianEmail}`} className="font-mono-code text-[#1A1A1A] hover:underline">
                    {student.guardianEmail}
                  </a>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-[#1A1A1A]/10">
                <span className="text-[#1A1A1A]/60">Emergency Secondary:</span>
                <span className="font-mono-code text-[#1A1A1A]">{student.emergencyContact} ({student.emergencyPhone})</span>
              </div>
            </div>
          </div>

          {/* Medical & Administrative Notes */}
          <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#1A1A1A]/12 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#1A1A1A]/10">
              <h4 className="font-serif text-lg font-normal italic text-[#1A1A1A] flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#1A1A1A]" />
                Administrative & Health Records
              </h4>
              {!isEditing && (
                <button
                  onClick={handleStartEdit}
                  className="text-xs text-[#1A1A1A] hover:underline flex items-center gap-1 font-bold uppercase tracking-wider text-[10px]"
                >
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
              )}
            </div>

            {student.medicalNotes && (
              <div className="text-xs p-3 bg-[#FBF0F0] border border-[#9B2C2C]/30 rounded-lg text-[#9B2C2C] font-mono-code">
                <strong>Medical:</strong> {student.medicalNotes}
              </div>
            )}

            {isEditing ? (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/60">Status:</label>
                  <select
                    value={editedStatus}
                    onChange={(e) => setEditedStatus(e.target.value as any)}
                    className="w-full mt-1 text-xs p-2.5 bg-[#F4F1ED] border border-[#1A1A1A]/15 rounded-lg font-mono-code focus:outline-none focus:border-[#1A1A1A]"
                  >
                    <option value="active">Active</option>
                    <option value="probation">Probation</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/60">Notes:</label>
                  <textarea
                    value={editedNotes}
                    onChange={(e) => setEditedNotes(e.target.value)}
                    className="w-full mt-1 text-xs p-2.5 bg-[#F4F1ED] border border-[#1A1A1A]/15 rounded-lg font-mono-code focus:outline-none focus:border-[#1A1A1A]"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveEdit}
                    className="px-3.5 py-1.5 bg-[#1A1A1A] hover:bg-black text-[#F4F1ED] text-xs font-bold uppercase tracking-wider rounded-lg"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3.5 py-1.5 bg-[#E8E4DF] text-[#1A1A1A] text-xs font-bold uppercase tracking-wider rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#1A1A1A]/70 italic">
                {student.notes || 'No custom administrative notes recorded for this student.'}
              </p>
            )}
          </div>

          {/* Previous SMS Dispatch History */}
          <div className="space-y-2">
            <div className="flex items-center justify-between pb-1">
              <h4 className="font-serif text-lg font-normal italic text-[#1A1A1A]">
                SMS Dispatch History
              </h4>
              <span className="text-[10px] uppercase font-mono-code text-[#1A1A1A]/60">{studentSMS.length} Alerts Dispatched</span>
            </div>

            <div className="divide-y divide-[#1A1A1A]/10 max-h-48 overflow-y-auto border border-[#1A1A1A]/12 rounded-xl bg-white">
              {studentSMS.map((sms) => (
                <div key={sms.id} className="p-3 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[10px] uppercase tracking-wider text-[#1A1A1A]">
                      {sms.category.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-[#1A1A1A]/50 font-mono-code">{sms.timestamp}</span>
                  </div>
                  <p className="text-[#1A1A1A]/80 font-mono-code bg-[#F4F1ED] p-2.5 rounded border border-[#1A1A1A]/10">
                    {sms.message}
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-[#1C3D18] text-[10px] font-semibold font-mono-code">
                    <CheckCircle2 className="w-3 h-3 text-[#2D5A27]" /> Delivered to {sms.recipientPhone}
                  </div>
                </div>
              ))}

              {studentSMS.length === 0 && (
                <div className="p-4 text-center text-xs text-[#1A1A1A]/50 font-mono-code">
                  No SMS notifications have been sent to this student's guardian yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-[#1A1A1A]/12 bg-[#F4F1ED] flex items-center justify-between gap-3">
          <button
            onClick={() => setSelectedStudentForDrawer(null)}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#1A1A1A]/70 hover:bg-[#E8E4DF] rounded-lg transition-colors"
          >
            Close Drawer
          </button>

          <button
            onClick={() => {
              openSMSModal({
                studentId: student.id,
                studentName: student.name,
                guardianName: student.guardianName,
                guardianPhone: student.guardianPhone,
                className: student.className,
                category: 'academic',
                defaultMessage: `Dear ${student.guardianName}, regarding ${student.name} at ${settings.schoolName}: `
              });
            }}
            className="px-4 py-2 bg-[#1A1A1A] hover:bg-black text-[#F4F1ED] text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            Dispatch Direct SMS
          </button>
        </div>
      </div>
    </div>
  );
};
