import React, { useState, useEffect } from 'react';
import { TenantUser, TenantUserRole, SchoolTenant, ClassRoom, Student } from '../types';
import { UserCheck, Shield, BookOpen, User, Phone, Mail, Lock, Building2, CheckCircle2 } from 'lucide-react';

interface TenantUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: Omit<TenantUser, 'id' | 'createdAt'>, userId?: string) => void;
  initialUser?: TenantUser | null;
  schools: SchoolTenant[];
  defaultSchoolId?: string;
  classes: ClassRoom[];
  students: Student[];
}

export const TenantUserModal: React.FC<TenantUserModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialUser,
  schools,
  defaultSchoolId,
  classes,
  students,
}) => {
  const [schoolId, setSchoolId] = useState(defaultSchoolId || schools[0]?.id || 'school-demo');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<TenantUserRole>('teacher');
  const [designation, setDesignation] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive' | 'pending'>('active');
  const [assignedClassId, setAssignedClassId] = useState('');
  const [linkedStudentId, setLinkedStudentId] = useState('');

  useEffect(() => {
    if (initialUser) {
      setSchoolId(initialUser.schoolId);
      setName(initialUser.name);
      setEmail(initialUser.email);
      setPhone(initialUser.phone || '');
      setRole(initialUser.role);
      setDesignation(initialUser.designation || '');
      setPassword(initialUser.password || 'demo1234');
      setStatus(initialUser.status);
      setAssignedClassId(initialUser.assignedClassIds?.[0] || '');
      setLinkedStudentId(initialUser.linkedStudentIds?.[0] || '');
    } else {
      setSchoolId(defaultSchoolId || schools[0]?.id || 'school-demo');
      setName('');
      setEmail('');
      setPhone('+1 (555) 000-0000');
      setRole('teacher');
      setDesignation('Faculty Instructor');
      setPassword(`pass${Math.floor(1000 + Math.random() * 9000)}`);
      setStatus('active');
      setAssignedClassId('');
      setLinkedStudentId('');
    }
  }, [initialUser, defaultSchoolId, schools, isOpen]);

  if (!isOpen) return null;

  const schoolClasses = classes.filter((c) => (c.schoolId || 'school-demo') === schoolId);
  const schoolStudents = students.filter((s) => (s.schoolId || 'school-demo') === schoolId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const matchedClass = schoolClasses.find((c) => c.id === assignedClassId);

    const payload: Omit<TenantUser, 'id' | 'createdAt'> = {
      schoolId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || undefined,
      role,
      designation: designation.trim() || undefined,
      password: password.trim() || 'demo1234',
      status,
      assignedClassIds: assignedClassId ? [assignedClassId] : undefined,
      assignedClassName: matchedClass?.name,
      linkedStudentIds: linkedStudentId ? [linkedStudentId] : undefined,
      lastLogin: initialUser?.lastLogin,
    };

    onSave(payload, initialUser?.id);
    onClose();
  };

  const roleOptions: { role: TenantUserRole; label: string; icon: any; desc: string }[] = [
    { role: 'admin', label: 'School Admin', icon: Shield, desc: 'Full tenant authority & configuration' },
    { role: 'principal', label: 'Principal / Head', icon: Shield, desc: 'Academic leadership & reports' },
    { role: 'teacher', label: 'Teacher / Faculty', icon: BookOpen, desc: 'Classroom roll call & SMS alerts' },
    { role: 'staff', label: 'Office Staff', icon: UserCheck, desc: 'Attendance clerk & notifications' },
    { role: 'guardian', label: 'Guardian / Parent', icon: User, desc: 'Student absence notes & child records' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-[#1A1A1A]/20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-[#1A1A1A] text-[#F4F1ED] flex items-center justify-between border-b border-[#2A2A2A]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F4F1ED]">
                {initialUser ? 'Edit Tenant User Account' : 'Create User in School Tenant'}
              </h3>
              <p className="text-xs text-[#F4F1ED]/60">Platform Agent User Management Interface</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#F4F1ED]/60 hover:text-[#F4F1ED] p-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Target Tenant Selection */}
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Target School Tenant *</span>
            </label>
            <select
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F8F7F4] border border-[#1A1A1A]/15 rounded-xl text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
            >
              {schools.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code}) - {s.plan}
                </option>
              ))}
            </select>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
              User Role & Authority *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {roleOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = role === opt.role;
                return (
                  <button
                    key={opt.role}
                    type="button"
                    onClick={() => {
                      setRole(opt.role);
                      if (opt.role === 'admin') setDesignation('Lead Administrator');
                      else if (opt.role === 'principal') setDesignation('Principal Headmaster');
                      else if (opt.role === 'teacher') setDesignation('Subject Instructor');
                      else if (opt.role === 'staff') setDesignation('Attendance Officer');
                      else if (opt.role === 'guardian') setDesignation('Primary Guardian');
                    }}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500'
                        : 'border-[#1A1A1A]/10 bg-[#F8F7F4] hover:bg-[#F2EFE9]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-700' : 'text-[#1A1A1A]/50'}`} />
                      <span className="text-xs font-bold text-[#1A1A1A]">{opt.label}</span>
                    </div>
                    <span className="text-[10px] text-[#1A1A1A]/60 leading-tight">{opt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Arthur Pendelton"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#F8F7F4] border border-[#1A1A1A]/15 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                Job Title / Designation
              </label>
              <input
                type="text"
                placeholder="e.g. Dean of Students"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#F8F7F4] border border-[#1A1A1A]/15 rounded-xl text-sm focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#1A1A1A]/50" />
                <span>Email Address (Login Username) *</span>
              </label>
              <input
                type="email"
                required
                placeholder="e.g. a.pendelton@school.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#F8F7F4] border border-[#1A1A1A]/15 rounded-xl text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#1A1A1A]/50" />
                <span>Mobile Phone (For SMS Notifications)</span>
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#F8F7F4] border border-[#1A1A1A]/15 rounded-xl text-sm font-mono focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-[#1A1A1A]/50" />
                <span>Initial / Managed Password</span>
              </label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#F8F7F4] border border-[#1A1A1A]/15 rounded-xl text-sm font-mono focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                Account Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2 bg-[#F8F7F4] border border-[#1A1A1A]/15 rounded-xl text-sm focus:outline-hidden"
              >
                <option value="active">Active (Full Access)</option>
                <option value="pending">Pending Activation</option>
                <option value="inactive">Inactive / Suspended</option>
              </select>
            </div>
          </div>

          {/* Conditional Role Linking */}
          {role === 'teacher' && schoolClasses.length > 0 && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
              <label className="block text-xs font-semibold text-blue-900">
                Assign Homeroom / Subject Class
              </label>
              <select
                value={assignedClassId}
                onChange={(e) => setAssignedClassId(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-blue-200 rounded-lg text-xs"
              >
                <option value="">No specific class assigned</option>
                {schoolClasses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.room})
                  </option>
                ))}
              </select>
            </div>
          )}

          {role === 'guardian' && schoolStudents.length > 0 && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
              <label className="block text-xs font-semibold text-emerald-900">
                Link to Registered Scholar
              </label>
              <select
                value={linkedStudentId}
                onChange={(e) => setLinkedStudentId(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-emerald-200 rounded-lg text-xs"
              >
                <option value="">Select linked student</option>
                {schoolStudents.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.className}) - ID: {s.studentNumber}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Submit Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#1A1A1A]/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-[#F8F7F4] hover:bg-[#EBE7E0] text-[#1A1A1A] text-xs font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-[#1A1A1A] text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{initialUser ? 'Save User Profile' : 'Create User Account'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
