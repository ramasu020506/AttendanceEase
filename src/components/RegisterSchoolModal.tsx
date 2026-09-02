import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Check, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Phone, 
  Compass, 
  Zap, 
  CheckCircle2, 
  CreditCard, 
  Gift 
} from 'lucide-react';
import { PLAN_TIERS } from '../data/mockData';
import { SaaSSubscriptionPlan, BillingCycle } from '../types';

export const RegisterSchoolModal: React.FC = () => {
  const { 
    isRegisterModalOpen, 
    setIsRegisterModalOpen, 
    createSchoolTenant, 
    switchActiveSchool, 
    addToast 
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [schoolName, setSchoolName] = useState('');
  const [schoolCode, setSchoolCode] = useState('');
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [phone, setPhone] = useState('+1 (555) 300-4000');
  const [address, setAddress] = useState('100 Campus Parkway, Suite 200');

  // Plan Selection
  const [selectedPlan, setSelectedPlan] = useState<SaaSSubscriptionPlan>('Pro Academy');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('annual');
  const [isTrial, setIsTrial] = useState(true);

  // Admin Account
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminRole, setAdminRole] = useState('Head of School');
  const [smsSenderId, setSmsSenderId] = useState('');

  if (!isRegisterModalOpen) return null;

  const handleNameChange = (val: string) => {
    setSchoolName(val);
    if (!schoolCode || schoolCode.startsWith('SCH-')) {
      const generatedCode = val
        .replace(/[^a-zA-Z]/g, '')
        .slice(0, 4)
        .toUpperCase();
      if (generatedCode.length >= 3) {
        setSchoolCode(`${generatedCode}-${Math.floor(100 + Math.random() * 900)}`);
      }
    }
  };

  const handleCompleteRegistration = (e: React.FormEvent) => {
    e.preventDefault();

    if (!schoolName.trim() || !adminEmail.trim() || !adminPassword.trim()) {
      addToast({
        title: 'Missing Required Fields',
        message: 'Please complete all required identity and account details.',
        type: 'error',
      });
      return;
    }

    const planConfig = PLAN_TIERS.find((p) => p.id === selectedPlan) || PLAN_TIERS[1];
    const finalCode = (schoolCode.trim() || `SCH-${Math.floor(1000 + Math.random() * 9000)}`).toUpperCase();
    const finalSenderId = (smsSenderId.trim() || finalCode.replace('-', '')).slice(0, 11).toUpperCase();

    const newSchool = createSchoolTenant({
      name: schoolName.trim(),
      code: finalCode,
      academicYear,
      logoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=120&auto=format&fit=crop&q=80',
      adminName: adminName.trim() || 'Principal Administrator',
      adminRole: adminRole.trim() || 'Principal',
      adminEmail: adminEmail.trim().toLowerCase(),
      adminPassword: adminPassword.trim(),
      adminAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
      plan: selectedPlan,
      status: isTrial ? 'trial' : 'active',
      remainingSMSCredits: planConfig.includedSMSCredits,
      smsSenderId: finalSenderId,
      autoDispatchAbsenteeSMS: true,
      attendanceCutoffTime: '09:00',
      phone: phone.trim(),
      address: address.trim(),
    });

    setIsRegisterModalOpen(false);
    switchActiveSchool(newSchool.id);

    addToast({
      title: 'Tenant Workspace Provisioned!',
      message: `Welcome to Sentinel SaaS! ${newSchool.name} is live with ${planConfig.includedSMSCredits.toLocaleString()} SMS credits.`,
      type: 'success',
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#1A1A1A]/20 overflow-hidden animate-in zoom-in-95 duration-200 font-sans flex flex-col max-h-[90vh]">
        {/* Modal Top Header */}
        <div className="bg-[#1A1A1A] text-white p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-400 text-amber-950 font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold">
                  SaaS Institutional Onboarding
                </span>
                <h3 className="font-serif text-2xl font-bold text-white leading-tight">
                  Launch School Workspace
                </h3>
              </div>
            </div>

            <button
              onClick={() => setIsRegisterModalOpen(false)}
              className="text-white/60 hover:text-white p-1 font-bold text-xl"
            >
              ✕
            </button>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-white/10 text-xs">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-amber-300 font-bold' : 'text-white/40'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-amber-400 text-black font-bold' : 'bg-white/10'}`}>
                1
              </span>
              <span>School Identity</span>
            </div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-amber-300 font-bold' : 'text-white/40'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-amber-400 text-black font-bold' : 'bg-white/10'}`}>
                2
              </span>
              <span>SaaS Plan</span>
            </div>
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-amber-300 font-bold' : 'text-white/40'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-amber-400 text-black font-bold' : 'bg-white/10'}`}>
                3
              </span>
              <span>Admin Account</span>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {/* STEP 1: School Identity */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h4 className="font-serif text-xl font-bold text-[#1A1A1A]">
                  Step 1: Academic Profile & Subdomain
                </h4>
                <p className="text-xs text-[#1A1A1A]/65 mt-0.5">
                  Enter your institution details. We will configure an isolated multi-tenant database sandbox for you.
                </p>
              </div>

              <div className="space-y-3 pt-2 text-xs">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[10px] text-[#1A1A1A]/70 mb-1">
                    Institution / School Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. St. Peter Preparatory Academy"
                    value={schoolName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full p-2.5 bg-[#F4F1ED] border border-[#1A1A1A]/15 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-[#1A1A1A]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-[10px] text-[#1A1A1A]/70 mb-1">
                      Unique School Identifier / Code *
                    </label>
                    <input
                      type="text"
                      placeholder="STP-101"
                      value={schoolCode}
                      onChange={(e) => setSchoolCode(e.target.value.toUpperCase())}
                      className="w-full p-2.5 bg-[#F4F1ED] border border-[#1A1A1A]/15 rounded-xl text-xs font-mono font-bold focus:bg-white focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-[10px] text-[#1A1A1A]/70 mb-1">
                      Academic Year
                    </label>
                    <select
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      className="w-full p-2.5 bg-[#F4F1ED] border border-[#1A1A1A]/15 rounded-xl text-xs font-medium"
                    >
                      <option value="2026-2027">2026-2027</option>
                      <option value="2025-2026">2025-2026</option>
                      <option value="2027-2028">2027-2028</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-[10px] text-[#1A1A1A]/70 mb-1">
                      Main Campus Phone
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-2.5 bg-[#F4F1ED] border border-[#1A1A1A]/15 rounded-xl text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-[10px] text-[#1A1A1A]/70 mb-1">
                      Campus Physical Address
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full p-2.5 bg-[#F4F1ED] border border-[#1A1A1A]/15 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Plan Selection */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-xl font-bold text-[#1A1A1A]">
                    Step 2: Choose SaaS Plan & Trial
                  </h4>
                  <p className="text-xs text-[#1A1A1A]/65 mt-0.5">
                    Select your license tier. Includes a 14-day free trial with no credit card upfront.
                  </p>
                </div>

                <div className="flex items-center gap-1 bg-[#E8E4DF] p-1 rounded-lg text-xs">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                      billingCycle === 'monthly' ? 'bg-[#1A1A1A] text-white' : 'text-[#1A1A1A]/70'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('annual')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                      billingCycle === 'annual' ? 'bg-[#1A1A1A] text-white' : 'text-[#1A1A1A]/70'
                    }`}
                  >
                    Annual (-20%)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {PLAN_TIERS.map((tier) => {
                  const isSelected = selectedPlan === tier.id;
                  const price = billingCycle === 'annual' ? tier.annualPricePerMonth : tier.monthlyPrice;

                  return (
                    <div
                      key={tier.id}
                      onClick={() => setSelectedPlan(tier.id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-amber-600 bg-amber-500/5 shadow-sm ring-1 ring-amber-500/30'
                          : 'border-[#1A1A1A]/12 hover:border-[#1A1A1A]/30 bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-serif text-base font-bold text-[#1A1A1A]">
                            {tier.name}
                          </span>
                          {tier.popular && (
                            <span className="text-[8px] bg-amber-400 text-amber-950 font-black px-1.5 py-0.2 rounded uppercase">
                              Popular
                            </span>
                          )}
                        </div>

                        <div className="my-2">
                          <span className="font-serif text-2xl font-bold text-[#1A1A1A]">
                            ${price}
                          </span>
                          <span className="text-[10px] text-[#1A1A1A]/60">/mo</span>
                        </div>

                        <div className="space-y-1.5 text-[11px] text-[#1A1A1A]/70 border-t border-[#1A1A1A]/10 pt-2">
                          <div>• Max {tier.maxStudents.toLocaleString()} Scholars</div>
                          <div>• {tier.includedSMSCredits.toLocaleString()} SMS Credits</div>
                          <div>• Daily Attendance Roster</div>
                          {tier.id !== 'Starter' && <div>• Sentinel AI Copilot</div>}
                        </div>
                      </div>

                      <div className="pt-3 mt-3 border-t border-[#1A1A1A]/10 flex items-center justify-center">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-amber-800' : 'text-[#1A1A1A]/40'}`}>
                          {isSelected ? '✓ Selected Plan' : 'Click to Select'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Free Trial Callout */}
              <div className="bg-[#FAF9F6] p-3.5 rounded-xl border border-amber-400/40 flex items-center gap-3">
                <Gift className="w-5 h-5 text-amber-700 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-[#1A1A1A]">14-Day Full Access Free Trial Included: </span>
                  <span className="text-[#1A1A1A]/70">
                    Your institutional workspace starts immediately with full access to Sentinel SMS dispatching and AI copilot.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Administrator Credentials */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h4 className="font-serif text-xl font-bold text-[#1A1A1A]">
                  Step 3: Head Administrator Account
                </h4>
                <p className="text-xs text-[#1A1A1A]/65 mt-0.5">
                  Set up the primary administrative master login credentials for this school tenant.
                </p>
              </div>

              <div className="space-y-3 pt-2 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-[10px] text-[#1A1A1A]/70 mb-1">
                      Administrator Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Dr. Jordan Hayes"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      className="w-full p-2.5 bg-[#F4F1ED] border border-[#1A1A1A]/15 rounded-xl text-xs font-medium focus:bg-white focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-[10px] text-[#1A1A1A]/70 mb-1">
                      Administrative Title / Role
                    </label>
                    <input
                      type="text"
                      placeholder="Principal / Superintendent"
                      value={adminRole}
                      onChange={(e) => setAdminRole(e.target.value)}
                      className="w-full p-2.5 bg-[#F4F1ED] border border-[#1A1A1A]/15 rounded-xl text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-[10px] text-[#1A1A1A]/70 mb-1">
                      Official Admin Email *
                    </label>
                    <input
                      type="email"
                      placeholder="admin@stpeter.edu"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="w-full p-2.5 bg-[#F4F1ED] border border-[#1A1A1A]/15 rounded-xl text-xs font-medium focus:bg-white focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-[10px] text-[#1A1A1A]/70 mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full p-2.5 bg-[#F4F1ED] border border-[#1A1A1A]/15 rounded-xl text-xs font-medium focus:bg-white focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-[10px] text-[#1A1A1A]/70 mb-1">
                    Custom Telecom SMS Sender ID (Max 11 Chars)
                  </label>
                  <input
                    type="text"
                    maxLength={11}
                    placeholder="e.g. STPETER-ALRT"
                    value={smsSenderId}
                    onChange={(e) => setSmsSenderId(e.target.value.toUpperCase())}
                    className="w-full p-2.5 bg-[#F4F1ED] border border-[#1A1A1A]/15 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="bg-[#FAF9F6] px-6 sm:px-8 py-4 border-t border-[#1A1A1A]/10 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((step - 1) as any)}
              className="px-4 py-2 text-xs font-bold text-[#1A1A1A] hover:bg-[#E8E4DF] rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous Step</span>
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && !schoolName.trim()) {
                  addToast({ title: 'School Name Required', message: 'Please enter the institution name.', type: 'warning' });
                  return;
                }
                setStep((step + 1) as any);
              }}
              className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCompleteRegistration}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-sm flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>Launch School Workspace</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
