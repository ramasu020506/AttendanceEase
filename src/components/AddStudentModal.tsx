import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, UserPlus, GraduationCap, Phone, Mail, Shield, Check, UploadCloud } from 'lucide-react';

export const AddStudentModal: React.FC = () => {
  const { isAddStudentModalOpen, setIsAddStudentModalOpen, classes, addStudent, openBulkUploadModal, currentSchool } = useApp();

  const [name, setName] = useState('');
  const [grade, setGrade] = useState('Grade 9');
  const [classId, setClassId] = useState(classes[0]?.id || 'cls-9a');
  const [guardianName, setGuardianName] = useState('');
  const [guardianRelationship, setGuardianRelationship] = useState('Parents');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [notes, setNotes] = useState('');

  if (!isAddStudentModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !guardianName.trim() || !guardianPhone.trim()) {
      alert('Please fill out student name, guardian name, and phone number.');
      return;
    }

    const selectedClass = classes.find((c) => c.id === classId) || classes[0];
    const studentNumber = `${currentSchool.code}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    addStudent({
      studentNumber,
      name,
      avatar: `https://images.unsplash.com/photo-${1530000000000 + Math.floor(Math.random() * 10000000)}?w=150&auto=format&fit=crop&q=80`,
      grade,
      classId,
      className: selectedClass?.name || 'Class',
      guardianName,
      guardianRelationship,
      guardianPhone,
      guardianEmail: guardianEmail || 'guardian@email.com',
      emergencyContact: emergencyContact || guardianName,
      emergencyPhone: emergencyPhone || guardianPhone,
      status: 'active',
      notes,
    });

    setIsAddStudentModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-[#FFFFFF] w-full max-w-xl rounded-2xl shadow-2xl border border-[#1A1A1A]/20 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#1A1A1A] text-[#F4F1ED] flex items-center justify-between border-b border-[#1A1A1A]">
          <div className="flex items-center gap-2.5">
            <UserPlus className="w-5 h-5 text-[#F4F1ED]" />
            <div>
              <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#F4F1ED]/60">
                Enrollment Registry // Intake
              </div>
              <h3 className="font-serif text-xl font-normal italic text-[#F4F1ED]">
                Enroll New Scholar
              </h3>
            </div>
          </div>
          <button
            onClick={() => setIsAddStudentModalOpen(false)}
            className="p-1.5 text-[#F4F1ED]/70 hover:text-[#F4F1ED] hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto bg-[#FFFFFF]">
          {/* Student Info */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/60 mb-3">
              1. Scholar Record
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/70 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Benjamin Hayes"
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
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/70 mb-1">
                  Assigned Homeroom
                </label>
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[#F4F1ED] border border-[#1A1A1A]/15 rounded-lg font-mono-code text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Guardian Info */}
          <div className="pt-3 border-t border-[#1A1A1A]/10">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/60 mb-3">
              2. Guardian & Emergency Contacts
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/70 mb-1">
                  Guardian Name *
                </label>
                <input
                  type="text"
                  required
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  placeholder="e.g. Diane Hayes"
                  className="w-full text-xs p-2.5 bg-[#F4F1ED] border border-[#1A1A1A]/15 rounded-lg font-serif text-[#1A1A1A] focus:outline-none focus:bg-white focus:border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/70 mb-1">
                  Relationship
                </label>
                <input
                  type="text"
                  value={guardianRelationship}
                  onChange={(e) => setGuardianRelationship(e.target.value)}
                  placeholder="e.g. Mother, Father, Guardian"
                  className="w-full text-xs p-2.5 bg-[#F4F1ED] border border-[#1A1A1A]/15 rounded-lg font-mono-code text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/70 mb-1">
                  Primary Mobile Phone (for SMS Alerts) *
                </label>
                <input
                  type="tel"
                  required
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(e.target.value)}
                  placeholder="+1 (555) 012-3456"
                  className="w-full text-xs p-2.5 bg-[#F4F1ED] border border-[#1A1A1A]/15 rounded-lg font-mono-code text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/70 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={guardianEmail}
                  onChange={(e) => setGuardianEmail(e.target.value)}
                  placeholder="guardian@example.com"
                  className="w-full text-xs p-2.5 bg-[#F4F1ED] border border-[#1A1A1A]/15 rounded-lg font-mono-code text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="pt-3 border-t border-[#1A1A1A]/10">
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/60 mb-1">
              3. Notes or Special Instructions
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Allergies, transportation notes, counselor requirements..."
              rows={2}
              className="w-full text-xs p-2.5 bg-[#F4F1ED] border border-[#1A1A1A]/15 rounded-lg font-mono-code text-[#1A1A1A] focus:outline-none focus:bg-white focus:border-[#1A1A1A]"
            />
          </div>

          {/* Submit & Bulk Switch */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#1A1A1A]/10">
            <button
              type="button"
              onClick={() => {
                setIsAddStudentModalOpen(false);
                openBulkUploadModal(classId);
              }}
              className="text-xs font-mono-code text-[#1A1A1A]/70 hover:text-[#1A1A1A] flex items-center gap-1.5 underline cursor-pointer self-start sm:self-auto"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              Switch to Bulk Ingestion (CSV / TSV)
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => setIsAddStudentModalOpen(false)}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#1A1A1A]/70 hover:bg-[#E8E4DF] rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#1A1A1A] hover:bg-black text-[#F4F1ED] text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                Complete Enrollment
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
