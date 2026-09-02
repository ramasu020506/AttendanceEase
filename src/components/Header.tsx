import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Menu, 
  X, 
  Bell, 
  HelpCircle, 
  Calendar as CalendarIcon, 
  Radio, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Building2,
  ChevronDown,
  ShieldCheck,
  Smartphone,
  LogOut,
  Sparkles,
  Key,
  Bot
} from 'lucide-react';

interface HeaderProps {
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu, isMobileMenuOpen }) => {
  const { 
    settings, 
    selectedDate, 
    setSelectedDate, 
    smsAlerts, 
    openSMSModal, 
    openAuthModal,
    openChatbot,
    schools,
    activeSchoolId,
    currentSchool,
    switchActiveSchool,
    currentTenantUser,
    tenantUsers,
    switchTenantUser,
    userRole,
    setUserRole,
    logout
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const recentAlerts = smsAlerts.slice(0, 5);

  return (
    <>
      {/* Mobile Top Header (< md) */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-[#E8E4DF] border-b border-[#1A1A1A]/15 px-4 flex items-center justify-between font-sans">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onToggleMobileMenu}
            className="p-1.5 rounded-lg text-[#1A1A1A] hover:bg-[#1A1A1A]/10 cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="flex items-center gap-1.5 truncate">
            <span className="font-serif text-[17px] font-bold text-[#1A1A1A] truncate">
              {currentSchool.name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => openAuthModal('parent')}
            className="px-2 py-1 bg-emerald-800 text-white text-[10px] font-bold uppercase tracking-wider rounded-md flex items-center gap-1 cursor-pointer shadow-xs"
            title="Parent Portal Sign In"
          >
            <Smartphone className="w-3 h-3" />
            <span>Parent</span>
          </button>

          <button
            onClick={() => openAuthModal('admin')}
            className="px-2 py-1 bg-[#1A1A1A] text-white text-[10px] font-bold uppercase tracking-wider rounded-md flex items-center gap-1 cursor-pointer shadow-xs"
            title="Switch School"
          >
            <Building2 className="w-3 h-3 text-amber-400" />
            <span>Switch</span>
          </button>

          <button
            id="btn-mobile-open-chat"
            onClick={() => openChatbot()}
            className="p-1.5 rounded-lg bg-[#1A1A1A] text-amber-400 hover:bg-black transition-colors cursor-pointer"
            title="Sentinel AI Assistant"
          >
            <Bot className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-1.5 rounded-full text-[#1A1A1A]/80 hover:bg-[#1A1A1A]/10 transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#9B2C2C] rounded-full ring-2 ring-[#E8E4DF]" />
          </button>
        </div>
      </header>

      {/* Desktop Top Header Bar (md+) */}
      <div className="hidden md:flex items-center justify-between px-8 py-3 bg-[#E8E4DF] border-b border-[#1A1A1A]/15 select-none font-sans">
        <div className="flex items-center gap-4">
          {/* Active School Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSchoolDropdown(!showSchoolDropdown)}
              className="flex items-center gap-2.5 px-3 py-1.5 bg-white hover:bg-[#FAF9F6] border border-[#1A1A1A]/15 rounded-xl text-xs font-bold text-[#1A1A1A] shadow-2xs transition-all cursor-pointer group"
            >
              <div className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-900 flex items-center justify-center font-bold text-[10px]">
                <Building2 className="w-3 h-3 text-amber-800" />
              </div>
              <span className="max-w-[180px] truncate">{currentSchool.name}</span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 bg-[#F4F1ED] rounded text-[#1A1A1A]/70 font-normal">
                {currentSchool.code}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#1A1A1A]/40 group-hover:text-[#1A1A1A]" />
            </button>

            {/* School Switcher Popup */}
            {showSchoolDropdown && (
              <div className="absolute top-full left-0 mt-1.5 w-72 bg-white rounded-xl shadow-xl border border-[#1A1A1A]/15 p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/50 border-b border-[#1A1A1A]/10 mb-1">
                  Active Client Schools
                </div>
                <div className="space-y-1 max-h-56 overflow-y-auto">
                  {schools.map((school) => (
                    <button
                      key={school.id}
                      onClick={() => {
                        switchActiveSchool(school.id);
                        setShowSchoolDropdown(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        school.id === activeSchoolId
                          ? 'bg-[#1A1A1A] text-white font-bold'
                          : 'hover:bg-[#F4F1ED] text-[#1A1A1A]'
                      }`}
                    >
                      <div className="truncate">
                        <div className="truncate">{school.name}</div>
                        <div className="text-[10px] opacity-70 font-mono">{school.adminEmail}</div>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        school.id === activeSchoolId ? 'bg-white/20 text-white' : 'bg-[#1A1A1A]/5 text-[#1A1A1A]/60'
                      }`}>
                        {school.code}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="pt-2 mt-1 border-t border-[#1A1A1A]/10 flex flex-col gap-1">
                  <button
                    onClick={() => {
                      setUserRole('super_admin');
                      setShowSchoolDropdown(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 flex items-center gap-2"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                    <span>Open Super Admin Manager</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#1A1A1A]/70">
            <CalendarIcon className="w-3.5 h-3.5 text-[#1A1A1A]/60" />
            <span className="font-medium">Roll Call Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-[#FFFFFF] border border-[#1A1A1A]/15 rounded-lg px-2 py-0.5 text-xs font-mono font-medium text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* AI Assistant Quick Launcher */}
          <button
            id="btn-header-open-chatbot"
            onClick={() => openChatbot()}
            className="px-3 py-1.5 bg-[#1A1A1A] hover:bg-black text-[#F4F1ED] text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs group"
            title="Open Sentinel AI Copilot"
          >
            <Bot className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>Sentinel AI</span>
          </button>

          {/* Super Admin Switcher */}
          <button
            id="super-admin-header-btn"
            onClick={() => setUserRole('super_admin')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
              userRole === 'super_admin'
                ? 'bg-amber-500 text-[#1A1A1A] ring-2 ring-amber-500/30'
                : 'bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-amber-400 border border-[#1A1A1A]/15'
            }`}
            title="Super Admin Master Control"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Super Admin</span>
          </button>

          {/* Unified Login Modal Launcher */}
          <button
            id="btn-switch-parent-portal"
            onClick={() => openAuthModal('parent')}
            className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Parent Login (Phone)</span>
          </button>

          {/* SMS Dispatch Archive Notification */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-[#1A1A1A]/80 hover:bg-[#1A1A1A]/10 transition-colors cursor-pointer"
            title="SMS Dispatches"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#9B2C2C] rounded-full ring-2 ring-[#E8E4DF]" />
          </button>

          {/* Help button */}
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="p-2 rounded-lg text-[#1A1A1A]/80 hover:bg-[#1A1A1A]/10 transition-colors cursor-pointer"
            title="Documentation & Guidance"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* User Profile & Tenant User Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 pl-2 border-l border-[#1A1A1A]/15 hover:opacity-80 transition-opacity cursor-pointer group text-left"
              title="Click to switch staff account or role"
            >
              <div className="h-8 w-8 rounded-full overflow-hidden border border-[#1A1A1A]/20 flex-shrink-0 bg-amber-100 flex items-center justify-center font-bold text-xs text-amber-900">
                {currentTenantUser.avatar ? (
                  <img
                    src={currentTenantUser.avatar}
                    alt={currentTenantUser.name}
                    className="w-full h-full object-cover filter grayscale"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  currentTenantUser.name.charAt(0)
                )}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-[#1A1A1A] leading-tight truncate max-w-[130px] flex items-center gap-1">
                  <span>{currentTenantUser.name}</span>
                  <ChevronDown className="w-3 h-3 text-[#1A1A1A]/40 group-hover:text-[#1A1A1A]" />
                </div>
                <div className="text-[10px] uppercase tracking-wider text-[#1A1A1A]/60 font-medium truncate max-w-[130px]">
                  {currentTenantUser.designation || currentTenantUser.role}
                </div>
              </div>
            </button>

            {/* User Switcher Dropdown */}
            {showUserDropdown && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-[#1A1A1A]/15 p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/50 border-b border-[#1A1A1A]/10 mb-1 flex items-center justify-between">
                  <span>Tenant Users ({currentSchool.name})</span>
                  <span className="text-[9px] px-1 bg-amber-100 text-amber-800 rounded font-mono">🔒 Sandboxed</span>
                </div>
                <div className="space-y-1 max-h-56 overflow-y-auto">
                  {tenantUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        switchTenantUser(user.id);
                        setShowUserDropdown(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        user.id === currentTenantUser.id
                          ? 'bg-[#1A1A1A] text-white font-bold'
                          : 'hover:bg-[#F4F1ED] text-[#1A1A1A]'
                      }`}
                    >
                      <div className="truncate">
                        <div className="truncate flex items-center gap-1.5">
                          <span>{user.name}</span>
                          <span className={`text-[9px] px-1 py-0.2 rounded uppercase font-mono ${
                            user.id === currentTenantUser.id ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-900'
                          }`}>
                            {user.role}
                          </span>
                        </div>
                        <div className="text-[10px] opacity-70 font-mono">{user.email}</div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-2 mt-1 border-t border-[#1A1A1A]/10 flex flex-col gap-1">
                  <button
                    onClick={() => {
                      logout();
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold text-red-800 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-600" />
                    <span>Log Out / Switch Institution</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notifications Popover */}
      {showNotifications && (
        <div className="fixed top-14 right-4 md:right-8 z-50 w-80 sm:w-96 bg-[#FFFFFF] rounded-xl shadow-2xl border border-[#1A1A1A]/15 p-4 text-sm animate-in fade-in slide-in-from-top-2 duration-150 font-sans">
          <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]/10">
            <div className="font-serif text-base italic text-[#1A1A1A] flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#1A1A1A]" />
              <span>SMS Dispatch Archive ({currentSchool.name})</span>
            </div>
            <button
              onClick={() => setShowNotifications(false)}
              className="text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
            >
              Close
            </button>
          </div>

          <div className="divide-y divide-[#1A1A1A]/10 max-h-80 overflow-y-auto my-2 pr-1">
            {recentAlerts.length > 0 ? (
              recentAlerts.map((alert) => (
                <div key={alert.id} className="py-2.5 px-1 hover:bg-[#F4F1ED] rounded-md transition-colors">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-[#1A1A1A] truncate max-w-[180px]">
                      {alert.recipientName}
                    </span>
                    <span className="text-[#1A1A1A]/50 text-[10px] font-mono">
                      {alert.timestamp.substring(11, 16)}
                    </span>
                  </div>
                  <p className="text-xs text-[#1A1A1A]/80 line-clamp-2">{alert.message}</p>
                  <div className="mt-1.5 flex items-center justify-between text-[11px]">
                    <span className="inline-flex items-center gap-1 text-[#2D5A27] font-medium text-[10px] uppercase tracking-wider">
                      <CheckCircle2 className="w-3 h-3 text-[#2D5A27]" /> Delivered
                    </span>
                    <span className="text-[#1A1A1A]/50 font-mono text-[11px]">{alert.recipientPhone}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-[#1A1A1A]/50">
                No recent SMS broadcasts for this school.
              </div>
            )}
          </div>

          <div className="pt-2.5 border-t border-[#1A1A1A]/10 flex justify-between items-center text-xs">
            <span className="text-[10px] uppercase tracking-wider text-[#1A1A1A]/50 font-mono">
              Credits: {currentSchool.remainingSMSCredits}
            </span>
            <button
              onClick={() => {
                setShowNotifications(false);
                openSMSModal();
              }}
              className="text-[11px] uppercase tracking-wider font-bold text-[#1A1A1A] hover:underline"
            >
              Dispatch New SMS &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 bg-[#1A1A1A]/50 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
          <div className="bg-[#FFFFFF] rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#1A1A1A]/20">
            <div className="text-[9px] uppercase tracking-[0.25em] font-bold opacity-50 mb-1">
              Multi-Tenant Architecture Guide
            </div>
            <h3 className="font-serif text-2xl font-normal italic text-[#1A1A1A] mb-3">
              Multi-School SaaS Portal Guide
            </h3>
            <p className="text-sm text-[#1A1A1A]/80 mb-4 leading-relaxed">
              When selling this software to multiple schools, each school receives isolated credentials to manage their own classes, students, roll-calls, and SMS alerts.
            </p>
            <div className="space-y-2.5 text-xs text-[#1A1A1A]/80 bg-[#F4F1ED] p-4 rounded-xl border border-[#1A1A1A]/10 mb-5">
              <div><strong className="text-[#1A1A1A]">1. Super Admin:</strong> Click the "Super Admin" button in the top bar to provision client schools and generate login credentials.</div>
              <div><strong className="text-[#1A1A1A]">2. School Admin:</strong> Log in with the school's admin email and password. School admins only see and edit their own school's data.</div>
              <div><strong className="text-[#1A1A1A]">3. Parents:</strong> Log in with their registered phone number. They only see records for their own children.</div>
            </div>
            <button
              onClick={() => setShowHelp(false)}
              className="w-full bg-[#1A1A1A] hover:bg-black text-[#F4F1ED] py-3 rounded-lg text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors"
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
