import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Settings, 
  Radio, 
  Shield, 
  Clock, 
  Send, 
  Check, 
  RefreshCw, 
  Smartphone, 
  BellRing,
  Building2,
  CheckCircle2
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, dispatchSMSAlert, addToast, currentSchool } = useApp();

  const [schoolName, setSchoolName] = useState(settings.schoolName);
  const [adminName, setAdminName] = useState(settings.adminName);
  const [adminEmail, setAdminEmail] = useState(settings.adminEmail);
  const [smsSenderId, setSmsSenderId] = useState(settings.smsSenderId);
  const [cutoffTime, setCutoffTime] = useState(settings.attendanceCutoffTime);
  const [autoSMS, setAutoSMS] = useState(settings.autoDispatchAbsenteeSMS);

  // Sync state when active school changes
  React.useEffect(() => {
    setSchoolName(settings.schoolName);
    setAdminName(settings.adminName);
    setAdminEmail(settings.adminEmail);
    setSmsSenderId(settings.smsSenderId);
    setCutoffTime(settings.attendanceCutoffTime);
    setAutoSMS(settings.autoDispatchAbsenteeSMS);
  }, [settings]);

  // Test SMS Simulator state
  const [testPhone, setTestPhone] = useState('+1 (555) 890-1234');
  const [testMessage, setTestMessage] = useState(`${settings.schoolName} Alert: SMS Gateway test message verified.`);
  const [isSendingTest, setIsSendingTest] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      schoolName,
      adminName,
      adminEmail,
      smsSenderId,
      attendanceCutoffTime: cutoffTime,
      autoDispatchAbsenteeSMS: autoSMS,
    });
  };

  const handleSendTestSMS = async () => {
    if (!testPhone.trim() || !testMessage.trim()) return;

    setIsSendingTest(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    await dispatchSMSAlert({
      recipientName: 'Test Recipient / Administrator',
      recipientPhone: testPhone,
      category: 'general_announcement',
      message: testMessage,
      status: 'sent',
      creditsUsed: 1,
    });

    setIsSendingTest(false);
    addToast({
      title: 'Test SMS Delivered',
      message: `Test message routed to ${testPhone} with status 200 OK.`,
      type: 'success',
    });
  };

  const handleReloadCredits = () => {
    updateSettings({
      remainingSMSCredits: settings.remainingSMSCredits + 5000,
    });
    addToast({
      title: 'Credits Added',
      message: 'Added 5,000 SMS credits to institutional gateway balance.',
      type: 'success',
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1A1A1A]/15 pb-6">
        <div>
          <div className="text-[9px] uppercase tracking-[0.25em] font-bold text-[#1A1A1A]/50 mb-2">
            Section 06 // Gateway & System Preferences
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal italic text-[#1A1A1A] leading-tight tracking-tight">
            Portal & Gateway Settings
          </h2>
          <p className="text-sm text-[#1A1A1A]/70 mt-1.5 max-w-xl">
            Configure institutional profiles, automated roll call cutoffs, and Sentinel SMS credentials.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: General Configuration (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSaveSettings} className="bg-[#FFFFFF] p-6 sm:p-7 rounded-xl border border-[#1A1A1A]/12 shadow-xs space-y-6">
            <div>
              <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A]/50 mb-1">
                Institutional Roster
              </div>
              <h3 className="font-serif text-2xl font-normal italic text-[#1A1A1A] flex items-center gap-2 mb-4">
                <Building2 className="w-4 h-4 text-[#1A1A1A]" />
                Academy Profile Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1A1A]/70 mb-1.5">
                    Academy Name
                  </label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[#F4F1ED] border border-[#1A1A1A]/15 rounded-lg focus:outline-none focus:bg-white focus:border-[#1A1A1A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1A1A]/70 mb-1.5">
                    School Registration Code
                  </label>
                  <input
                    type="text"
                    disabled
                    value={settings.schoolCode}
                    className="w-full text-xs p-2.5 bg-[#E8E4DF] border border-[#1A1A1A]/15 rounded-lg font-mono-code text-[#1A1A1A]/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1A1A]/70 mb-1.5">
                    Lead Administrator Name
                  </label>
                  <input
                    type="text"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[#F4F1ED] border border-[#1A1A1A]/15 rounded-lg focus:outline-none focus:bg-white focus:border-[#1A1A1A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1A1A]/70 mb-1.5">
                    Administrative Email
                  </label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[#F4F1ED] border border-[#1A1A1A]/15 rounded-lg focus:outline-none focus:bg-white focus:border-[#1A1A1A]"
                  />
                </div>
              </div>
            </div>

            {/* Attendance & Automated Triggers */}
            <div className="pt-6 border-t border-[#1A1A1A]/10">
              <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A]/50 mb-1">
                Automation
              </div>
              <h3 className="font-serif text-2xl font-normal italic text-[#1A1A1A] flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-[#1A1A1A]" />
                Daily Attendance Automation Rules
              </h3>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 bg-[#F4F1ED] rounded-xl border border-[#1A1A1A]/10">
                  <div>
                    <div className="text-xs font-bold text-[#1A1A1A]">Morning Attendance Cutoff Time</div>
                    <div className="text-[11px] text-[#1A1A1A]/60">
                      Classes not submitted by this time trigger teacher reminders.
                    </div>
                  </div>
                  <input
                    type="time"
                    value={cutoffTime}
                    onChange={(e) => setCutoffTime(e.target.value)}
                    className="text-xs p-2 bg-white border border-[#1A1A1A]/20 rounded-lg font-mono-code"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-[#F4F1ED] rounded-xl border border-[#1A1A1A]/10">
                  <div>
                    <div className="text-xs font-bold text-[#1A1A1A]">
                      Automatic Absentee SMS Dispatch
                    </div>
                    <div className="text-[11px] text-[#1A1A1A]/60">
                      Automatically send SMS notification to guardians of unexcused absentees at 09:15 AM.
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoSMS}
                      onChange={(e) => setAutoSMS(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#E8E4DF] border border-[#1A1A1A]/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#1A1A1A]/30 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1A1A1A]"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-black text-[#F4F1ED] text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                Save Configuration Changes
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: SMS Gateway Status & Live Test Simulator */}
        <div className="space-y-6">
          {/* Gateway Status Box */}
          <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#1A1A1A]/12 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A]/50">
                  Telemetry
                </div>
                <h3 className="font-serif text-xl font-normal italic text-[#1A1A1A] flex items-center gap-2">
                  <Radio className="w-4 h-4 text-[#1A1A1A]" />
                  Sentinel SMS Gateway
                </h3>
              </div>
              <span className="text-[10px] bg-[#E2ECE1] text-[#1C3D18] border border-[#2D5A27]/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#2D5A27]" /> Connected
              </span>
            </div>

            <div className="bg-[#F4F1ED] p-3.5 rounded-lg border border-[#1A1A1A]/10 space-y-2 text-xs font-mono-code">
              <div className="flex justify-between">
                <span className="text-[#1A1A1A]/60 font-sans">Sender ID:</span>
                <span className="font-bold text-[#1A1A1A]">{settings.smsSenderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#1A1A1A]/60 font-sans">Available Credits:</span>
                <span className="font-bold text-[#1A1A1A]">
                  {settings.remainingSMSCredits.toLocaleString()} SMS
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#1A1A1A]/60 font-sans">Delivery SLA:</span>
                <span className="font-semibold text-[#1C3D18]">&lt; 3.2s avg latency</span>
              </div>
            </div>

            <button
              onClick={handleReloadCredits}
              className="w-full py-2.5 bg-[#E8E4DF] hover:bg-[#1A1A1A] hover:text-[#F4F1ED] text-[#1A1A1A] text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-[#1A1A1A]/15"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reload 5,000 SMS Credits
            </button>
          </div>

          {/* Live SMS Gateway Test Sandbox */}
          <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#1A1A1A]/12 shadow-xs space-y-4">
            <div>
              <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A]/50">
                Sandbox
              </div>
              <h3 className="font-serif text-xl font-normal italic text-[#1A1A1A] flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#1A1A1A]" />
                Direct Test Dispatch
              </h3>
            </div>
            <p className="text-xs text-[#1A1A1A]/70">
              Send an instant live test SMS dispatch to verify route availability.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-[10px] text-[#1A1A1A]/70 mb-1">
                  Recipient Phone Number:
                </label>
                <input
                  type="tel"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  className="w-full p-2 bg-[#F4F1ED] border border-[#1A1A1A]/15 rounded-lg font-mono-code focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[10px] text-[#1A1A1A]/70 mb-1">
                  Test Payload:
                </label>
                <textarea
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  rows={3}
                  className="w-full p-2 bg-[#F4F1ED] border border-[#1A1A1A]/15 rounded-lg font-mono-code focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <button
                onClick={handleSendTestSMS}
                disabled={isSendingTest}
                className="w-full py-2.5 bg-[#1A1A1A] hover:bg-black text-[#F4F1ED] text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isSendingTest ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending Payload...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Send Live Test SMS
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
