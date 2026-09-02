import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Smartphone, 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  Key, 
  CheckCircle2, 
  Sparkles, 
  UserCheck, 
  PhoneCall, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export const UnifiedAuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalTab, 
    openAuthModal, 
    openRegisterModal,
    schools, 
    loginAsSchoolAdmin, 
    loginAsParent, 
    loginAsSuperAdmin,
    allStudents,
    addToast
  } = useApp();

  // Tab State
  const [activeTab, setActiveTab] = useState<'admin' | 'parent' | 'super_admin'>(authModalTab || 'admin');

  // School Admin form state
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [schoolCode, setSchoolCode] = useState('');
  const [adminError, setAdminError] = useState('');

  // Parent form state
  const [parentPhone, setParentPhone] = useState('');
  const [parentOtp, setParentOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [parentError, setParentError] = useState('');

  // Super Admin form state
  const [superAdminPasscode, setSuperAdminPasscode] = useState('');

  if (!isAuthModalOpen) return null;

  // Handler: School Admin Login
  const handleSchoolAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');

    if (!adminEmail.trim()) {
      setAdminError('Please enter your administrator login email.');
      return;
    }

    const result = loginAsSchoolAdmin(adminEmail, adminPassword, schoolCode);
    if (!result.success) {
      setAdminError(result.message);
    }
  };

  // Handler: Parent Send OTP & Login
  const handleParentSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setParentError('');
    if (!parentPhone.trim() || parentPhone.replace(/\D/g, '').length < 7) {
      setParentError('Please enter a valid registered 10-digit mobile telephone number.');
      return;
    }

    // Verify phone exists
    const result = loginAsParent(parentPhone);
    if (result.success) {
      setOtpSent(true);
      // Auto-populate simulation OTP
      setParentOtp('849201');
    } else {
      setParentError(result.message);
    }
  };

  const handleParentOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    // Finish login
    loginAsParent(parentPhone);
  };

  // Handler: Super Admin Login
  const handleSuperAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsSuperAdmin(superAdminPasscode);
  };

  // Sample Registered Parents for 1-Click Quick Testing
  const sampleParents = [
    { name: 'Robert & Sarah Evans (Demo School)', phone: '+1 (555) 234-8901', child: 'Lucas Evans' },
    { name: 'Patricia Walker (Demo School)', phone: '+1 (555) 456-7890', child: 'Liam Walker' },
    { name: 'Dr. Linda Zhang (Beacon Hill)', phone: '+1 (555) 901-2345', child: 'Alexander Zhang' },
    { name: 'Sister Clara Moreau (St. Jude)', phone: '+1 (555) 789-0123', child: 'Dominic Paul' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-[#1A1A1A]/20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-[#1A1A1A] text-[#F4F1ED] flex items-center justify-between border-b border-[#2A2A2A]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F4F1ED]">Unified Access Portal</h3>
              <p className="text-xs text-[#F4F1ED]/60">Select your access role to proceed</p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="text-[#F4F1ED]/60 hover:text-[#F4F1ED] p-1.5 rounded-lg text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 bg-[#F4F1ED] p-1.5 border-b border-[#1A1A1A]/10 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setActiveTab('admin'); setAdminError(''); }}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition-all ${
              activeTab === 'admin'
                ? 'bg-white text-[#1A1A1A] shadow-xs'
                : 'text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>School Admin</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('parent'); setParentError(''); }}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition-all ${
              activeTab === 'parent'
                ? 'bg-white text-[#1A1A1A] shadow-xs'
                : 'text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Parent Login</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('super_admin'); }}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition-all ${
              activeTab === 'super_admin'
                ? 'bg-[#1A1A1A] text-amber-400 shadow-xs'
                : 'text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Super Admin</span>
          </button>
        </div>

        {/* Tab 1: School Admin Login */}
        {activeTab === 'admin' && (
          <div className="p-6 space-y-5">
            <div>
              <h4 className="text-sm font-bold text-[#1A1A1A]">School Administrator Login</h4>
              <p className="text-xs text-[#1A1A1A]/60 mt-0.5">
                Sign in with the institutional credentials provided by the platform owner to manage your school.
              </p>
            </div>

            {adminError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{adminError}</span>
              </div>
            )}

            <form onSubmit={handleSchoolAdminSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                  Administrator Email / Username *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#1A1A1A]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. admin@demoschool.edu"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-[#F8F7F4] border border-[#1A1A1A]/15 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#1A1A1A]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-[#F8F7F4] border border-[#1A1A1A]/15 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#1A1A1A] hover:bg-[#333333] text-white text-sm font-bold rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
              >
                <span>Log In to School Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsAuthModalOpen(false);
                    openRegisterModal();
                  }}
                  className="text-xs font-bold text-amber-800 hover:text-amber-950 underline underline-offset-2 flex items-center justify-center gap-1 mx-auto cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Start 14-Day Free SaaS Trial / Register New School</span>
                </button>
              </div>
            </form>

            {/* Quick 1-Click School Admin Switcher Chips for effortless demoing */}
            <div className="pt-3 border-t border-[#1A1A1A]/10">
              <div className="text-[11px] font-bold text-[#1A1A1A]/50 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Quick Demo Accounts (1-Click Switch)</span>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {schools.map((school) => (
                  <button
                    key={school.id}
                    type="button"
                    onClick={() => {
                      setAdminEmail(school.adminEmail);
                      setAdminPassword(school.adminPassword || 'demo123');
                      loginAsSchoolAdmin(school.adminEmail, school.adminPassword);
                    }}
                    className="text-left p-2.5 bg-[#F8F7F4] hover:bg-[#EFECE6] rounded-xl border border-[#1A1A1A]/5 flex items-center justify-between text-xs transition-colors group"
                  >
                    <div>
                      <div className="font-bold text-[#1A1A1A] group-hover:text-amber-800">{school.name}</div>
                      <div className="text-[11px] text-[#1A1A1A]/60 font-mono">{school.adminEmail}</div>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-[#1A1A1A]/10 text-[#1A1A1A]/70">
                      {school.code}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Parent Login via Mobile Number */}
        {activeTab === 'parent' && (
          <div className="p-6 space-y-5">
            <div>
              <h4 className="text-sm font-bold text-[#1A1A1A]">Parent & Guardian Mobile Access</h4>
              <p className="text-xs text-[#1A1A1A]/60 mt-0.5">
                Enter your registered mobile phone number. No email required — view only your child's attendance & excuses.
              </p>
            </div>

            {parentError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{parentError}</span>
              </div>
            )}

            {!otpSent ? (
              <form onSubmit={handleParentSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                    Registered Mobile Phone Number *
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-[#1A1A1A]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +1 (555) 234-8901"
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-[#F8F7F4] border border-[#1A1A1A]/15 rounded-xl text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Send Security Verification Code (SMS)</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleParentOtpVerify} className="space-y-4">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                  A 6-digit verification code has been dispatched via SMS to <strong>{parentPhone}</strong>.
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                    SMS One-Time Passcode (OTP)
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={parentOtp}
                    onChange={(e) => setParentOtp(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F8F7F4] border border-[#1A1A1A]/15 rounded-xl text-center font-mono text-lg tracking-widest font-bold focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="w-1/3 py-2.5 bg-[#F8F7F4] text-[#1A1A1A] text-xs font-semibold rounded-xl"
                  >
                    Change Number
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold rounded-xl shadow-md"
                  >
                    Verify & Access Records
                  </button>
                </div>
              </form>
            )}

            {/* Quick 1-Click Registered Parent Test Chips */}
            <div className="pt-3 border-t border-[#1A1A1A]/10">
              <div className="text-[11px] font-bold text-[#1A1A1A]/50 uppercase tracking-wider mb-2 flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-emerald-600" />
                <span>Test with Registered Parent Phone Numbers</span>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {sampleParents.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setParentPhone(p.phone);
                      loginAsParent(p.phone);
                    }}
                    className="text-left p-2.5 bg-[#F8F7F4] hover:bg-emerald-50/50 rounded-xl border border-[#1A1A1A]/5 flex items-center justify-between text-xs transition-colors"
                  >
                    <div>
                      <div className="font-bold text-[#1A1A1A]">{p.name}</div>
                      <div className="text-[11px] text-[#1A1A1A]/60">Scholar: {p.child}</div>
                    </div>
                    <code className="font-mono text-xs font-semibold text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-[#1A1A1A]/10">
                      {p.phone}
                    </code>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Super Admin (Master SaaS Owner) */}
        {activeTab === 'super_admin' && (
          <div className="p-6 space-y-5 bg-[#FAF9F6]">
            <div className="flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-900">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <strong>Master SaaS Owner Access:</strong> Manage school client buyers, issue credentials, configure plans, and inject SMS credits.
              </div>
            </div>

            <form onSubmit={handleSuperAdminSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                  Master Super Admin Passcode (Optional for Demo)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#1A1A1A]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="Enter master key (or click button below)"
                    value={superAdminPasscode}
                    onChange={(e) => setSuperAdminPasscode(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#1A1A1A]/15 rounded-xl text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-[#1A1A1A] text-sm font-bold rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Open Super Admin Client Dashboard</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
