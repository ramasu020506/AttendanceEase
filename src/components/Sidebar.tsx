import React from 'react';
import { useApp, ActiveTab } from '../context/AppContext';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  ClipboardCheck, 
  BarChart3, 
  Settings, 
  Megaphone, 
  LogOut,
  Sparkles,
  ShieldCheck,
  Smartphone,
  Building2,
  Key,
  Bot,
  CreditCard,
  Plus
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { 
    activeTab, 
    setActiveTab, 
    openSMSModal, 
    openAuthModal, 
    openChatbot,
    openRegisterModal,
    settings, 
    currentSchool, 
    setUserRole,
    schools,
    switchActiveSchool
  } = useApp();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'classes', label: 'Classes', icon: <GraduationCap className="w-5 h-5" /> },
    { id: 'students', label: 'Students', icon: <Users className="w-5 h-5" /> },
    { id: 'attendance', label: 'Attendance', icon: <ClipboardCheck className="w-5 h-5" /> },
    { id: 'reports', label: 'Reports', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'billing', label: 'SaaS & Billing', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'settings', label: 'School Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  const handleSwitchSchool = () => {
    openAuthModal('admin');
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <nav className="w-64 h-full flex flex-col bg-[#E8E4DF] border-r border-[#1A1A1A]/15 select-none font-sans">
      {/* Brand Header */}
      <div className="px-6 py-6 flex flex-col items-center border-b border-[#1A1A1A]/15 mb-3 text-center">
        <div className="text-[9px] uppercase tracking-[0.25em] font-bold opacity-50 mb-2.5 font-sans">
          Institutional Portal
        </div>
        <div className="h-14 w-14 rounded-2xl overflow-hidden bg-white mb-2.5 border border-[#1A1A1A]/20 shadow-xs flex items-center justify-center p-1">
          <img
            src={settings.logoUrl}
            alt={settings.schoolName}
            className="w-full h-full object-contain rounded-xl"
            referrerPolicy="no-referrer"
          />
        </div>
        <h1 className="font-serif text-[19px] font-bold text-[#1A1A1A] leading-tight w-full truncate">
          {settings.schoolName}
        </h1>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-[#1A1A1A]/70 bg-white/70 px-2 py-0.5 rounded border border-[#1A1A1A]/10">
            {settings.schoolCode}
          </span>
          <span className="text-[9px] uppercase tracking-wider font-mono font-black text-amber-950 bg-amber-300 px-1.5 py-0.5 rounded">
            {currentSchool.plan}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 flex flex-col gap-1 overflow-y-auto">
        <div className="px-3 pb-1 text-[9px] uppercase tracking-[0.25em] font-bold opacity-40">
          Management
        </div>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] tracking-wide transition-all duration-150 text-left cursor-pointer ${
                isActive
                  ? 'bg-[#1A1A1A] text-[#F4F1ED] font-medium shadow-xs'
                  : 'text-[#1A1A1A]/70 hover:bg-[#1A1A1A]/5 hover:text-[#1A1A1A] font-normal'
              }`}
            >
              <span className={isActive ? 'text-[#F4F1ED]' : 'text-[#1A1A1A]/60'}>
                {item.icon}
              </span>
              <span className="font-sans">{item.label}</span>
            </button>
          );
        })}

        {/* Super Admin Control Access */}
        <div className="pt-2 mt-2 border-t border-[#1A1A1A]/10">
          <button
            onClick={() => {
              setUserRole('super_admin');
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[12px] font-bold text-amber-900 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-left cursor-pointer transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Super Admin Hub</span>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 my-2 space-y-2">
        <button
          id="btn-sidebar-ai-copilot"
          onClick={() => {
            openChatbot();
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full bg-white hover:bg-[#FAF9F6] border border-[#1A1A1A]/15 text-[#1A1A1A] py-2 px-3 rounded-xl text-[11px] font-bold transition-all duration-150 shadow-2xs flex items-center justify-center gap-2 cursor-pointer group"
        >
          <Bot className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
          <span>Sentinel AI Copilot</span>
        </button>

        <button
          id="btn-send-sms-alert"
          onClick={() => openSMSModal()}
          className="w-full bg-[#1A1A1A] hover:bg-black active:scale-[0.98] text-[#F4F1ED] py-2.5 px-4 rounded-xl text-[11px] font-bold uppercase tracking-[0.18em] transition-all duration-150 shadow-xs flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <Megaphone className="w-4 h-4 text-amber-400" />
          <span>Send SMS Alert</span>
        </button>

        <button
          id="btn-parent-portal-sidebar"
          onClick={() => {
            openAuthModal('parent');
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full bg-emerald-800 hover:bg-emerald-900 text-white py-2 px-3 rounded-xl text-[11px] font-bold transition-all duration-150 shadow-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Parent Phone Login</span>
        </button>
      </div>

      {/* Footer */}
      <div className="px-4 border-t border-[#1A1A1A]/15 pt-2.5 pb-3 mt-auto flex items-center justify-between">
        <button
          id="btn-switch-school"
          onClick={handleSwitchSchool}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-[#1A1A1A]/70 hover:text-[#1A1A1A] cursor-pointer"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Switch School</span>
        </button>

        <span className="text-[10px] font-mono text-[#1A1A1A]/40">
          SMS: {currentSchool.remainingSMSCredits}
        </span>
      </div>
    </nav>
  );
};
