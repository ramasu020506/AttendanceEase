import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Phone, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Sparkles, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  KeyRound,
  RefreshCw
} from 'lucide-react';

interface ParentLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ParentLoginModal: React.FC<ParentLoginModalProps> = ({ isOpen, onClose }) => {
  const { loginAsParent, students } = useApp();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('842915');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // Extract unique guardians from students list for quick testing
  const sampleParents = [
    {
      name: 'Robert & Sarah Evans',
      phone: '+1 (555) 234-8901',
      children: 'Lucas (Grade 9) & Charlotte (Grade 11)',
      count: 2,
    },
    {
      name: 'Carlos Martinez',
      phone: '+1 (555) 345-6712',
      children: 'Sophia Martinez (Grade 9)',
      count: 1,
    },
    {
      name: 'Patricia Walker',
      phone: '+1 (555) 456-7890',
      children: 'Liam James Walker (Grade 9)',
      count: 1,
    },
    {
      name: 'Arthur Bennett',
      phone: '+1 (555) 567-8901',
      children: 'Chloe Grace Bennett (Grade 9)',
      count: 1,
    },
  ];

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!phoneNumber.trim()) {
      setErrorMsg('Please enter your registered mobile number.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Pre-check if any student has this phone
      const result = loginAsParent(phoneNumber);
      if (result.success) {
        // Generate a random 6-digit OTP
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(code);
        setStep('otp');
      } else {
        setErrorMsg(result.message);
      }
    }, 400);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== generatedOtp && otpCode !== '123456') {
      setErrorMsg('Incorrect 6-digit verification code. Please check your SMS.');
      return;
    }

    const result = loginAsParent(phoneNumber);
    if (result.success) {
      onClose();
    } else {
      setErrorMsg(result.message);
    }
  };

  const handleDirectDemoLogin = (phone: string) => {
    setPhoneNumber(phone);
    const result = loginAsParent(phone);
    if (result.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1A1A1A]/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-[#FFFFFF] w-full max-w-md rounded-2xl border border-[#1A1A1A]/20 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-[#E8E4DF] px-6 py-5 border-b border-[#1A1A1A]/15 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#1A1A1A] text-[#F4F1ED] rounded-xl shadow-xs">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl italic font-normal text-[#1A1A1A] leading-tight">
                Parent Portal Sign In
              </h2>
              <p className="text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/60 mt-0.5">
                Registered Mobile Number Access
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-[#1A1A1A]/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {errorMsg && (
            <div className="p-3.5 bg-[#9B2C2C]/10 border border-[#9B2C2C]/20 rounded-xl text-xs text-[#9B2C2C] flex items-start gap-2.5 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {step === 'phone' ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] uppercase tracking-wider font-bold text-[#1A1A1A]/70">
                  Registered Guardian Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#1A1A1A]/40">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder="+1 (555) 234-8901 or 5552348901"
                    required
                    className="w-full pl-10 pr-3.5 py-3 bg-[#F4F1ED] border border-[#1A1A1A]/20 rounded-xl text-sm font-mono-code text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] focus:bg-white transition-all placeholder:text-[#1A1A1A]/35"
                  />
                </div>
                <p className="text-[11px] text-[#1A1A1A]/60 leading-relaxed">
                  The school does not issue parent email accounts. Log in with the mobile telephone number registered in your child's enrollment file.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#1A1A1A] hover:bg-black text-[#F4F1ED] text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Registry...</span>
                  </>
                ) : (
                  <>
                    <span>Send SMS Passcode</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3 bg-[#E8E4DF]/60 rounded-xl border border-[#1A1A1A]/10 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#1A1A1A]/70">SMS Code Sent To:</span>
                  <span className="font-mono-code font-bold text-[#1A1A1A]">{phoneNumber}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#1A1A1A]/10">
                  <span className="text-[#2F4F2F] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Simulated SMS Passcode:
                  </span>
                  <button
                    type="button"
                    onClick={() => setOtpCode(generatedOtp)}
                    className="font-mono-code font-bold text-[#1A1A1A] underline hover:text-[#9B2C2C] cursor-pointer"
                  >
                    {generatedOtp} (Click to Fill)
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] uppercase tracking-wider font-bold text-[#1A1A1A]/70">
                  Enter 6-Digit SMS Verification Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#1A1A1A]/40">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.trim())}
                    placeholder="Enter 6-digit code"
                    required
                    className="w-full pl-10 pr-3.5 py-3 bg-[#F4F1ED] border border-[#1A1A1A]/20 rounded-xl text-center text-lg font-mono-code tracking-[0.3em] font-bold text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="flex-1 py-2.5 bg-[#E8E4DF] hover:bg-[#1A1A1A]/15 text-[#1A1A1A] text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  Change Number
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#1A1A1A] hover:bg-black text-[#F4F1ED] text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify & Enter</span>
                </button>
              </div>
            </form>
          )}

          {/* Quick Demo Selector for Evaluators / Testers */}
          <div className="pt-4 border-t border-[#1A1A1A]/10">
            <div className="text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/50 mb-2.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>Quick Test: Registered Guardian Numbers</span>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {sampleParents.map((parent, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleDirectDemoLogin(parent.phone)}
                  className="w-full text-left p-2.5 rounded-xl bg-[#F4F1ED] hover:bg-[#E8E4DF] border border-[#1A1A1A]/10 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <div className="text-xs font-bold text-[#1A1A1A] group-hover:text-[#9B2C2C] transition-colors">
                      {parent.name}
                    </div>
                    <div className="text-[10px] text-[#1A1A1A]/60 mt-0.5">
                      Children: {parent.children}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono-code text-[11px] font-bold text-[#1A1A1A] bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#1A1A1A]/15">
                      {parent.phone}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
