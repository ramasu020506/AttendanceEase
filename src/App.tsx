/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { ClassesView } from './components/ClassesView';
import { StudentsView } from './components/StudentsView';
import { AttendanceView } from './components/AttendanceView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { BillingView } from './components/BillingView';
import { ParentPortalView } from './components/ParentPortalView';
import { SuperAdminPortalView } from './components/SuperAdminPortalView';
import { UnifiedAuthModal } from './components/UnifiedAuthModal';
import { RegisterSchoolModal } from './components/RegisterSchoolModal';
import { SMSAlertModal } from './components/SMSAlertModal';
import { StudentProfileDrawer } from './components/StudentProfileDrawer';
import { AddStudentModal } from './components/AddStudentModal';
import { CreateClassModal } from './components/CreateClassModal';
import { BulkUploadStudentsModal } from './components/BulkUploadStudentsModal';
import { ChatbotWidget } from './components/ChatbotWidget';
import { ToastContainer } from './components/ToastContainer';
import { Building2, ArrowLeft, ShieldCheck } from 'lucide-react';

function MainLayout() {
  const { 
    activeTab, 
    userRole, 
    setUserRole, 
    currentSchool 
  } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // View 1: Super Admin Master Control Plane
  if (userRole === 'super_admin') {
    return (
      <div className="min-h-screen bg-[#F8F7F4] text-[#1A1A1A] antialiased font-sans flex flex-col">
        {/* Return to School Navigation Sticky Bar */}
        <div className="bg-[#111111] text-white px-6 py-2.5 flex items-center justify-between text-xs border-b border-[#222222]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-bold text-amber-400">Master SaaS Super Admin Mode</span>
            <span className="text-white/40">•</span>
            <span className="text-white/70">Managing multi-tenant school buyers</span>
          </div>

          <button
            onClick={() => setUserRole('admin')}
            className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to School Workspace ({currentSchool.name})</span>
          </button>
        </div>

        <div className="flex-1">
          <SuperAdminPortalView />
        </div>

        <ChatbotWidget />
        <UnifiedAuthModal />
        <ToastContainer />
      </div>
    );
  }

  // View 2: Dedicated Secure Parent Portal (Logged in via phone number)
  if (userRole === 'parent') {
    return (
      <div className="min-h-screen bg-[#F4F1ED] text-[#1A1A1A] antialiased font-sans">
        <ParentPortalView />
        <ChatbotWidget />
        <UnifiedAuthModal />
        <ToastContainer />
      </div>
    );
  }

  // View 3: School Administrator Portal (Scoped strictly to currentSchool)
  return (
    <div className="flex h-screen bg-[#F4F1ED] text-[#1A1A1A] overflow-hidden antialiased font-sans">
      {/* Desktop Fixed Side Navigation */}
      <aside className="hidden md:flex flex-shrink-0 z-30 h-full">
        <Sidebar />
      </aside>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-[#1A1A1A]/60 backdrop-blur-xs flex">
          <div className="w-64 h-full bg-[#E8E4DF] shadow-2xl border-r border-[#1A1A1A]/15 animate-in slide-in-from-left duration-200">
            <Sidebar onCloseMobile={() => setIsMobileMenuOpen(false)} />
          </div>
          <div 
            className="flex-1 h-full" 
            onClick={() => setIsMobileMenuOpen(false)} 
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header 
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        <main className="flex-1 overflow-y-auto pt-16 md:pt-8 px-4 sm:px-6 md:px-10 pb-16 bg-[#F4F1ED]">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'classes' && <ClassesView />}
            {activeTab === 'students' && <StudentsView />}
            {activeTab === 'attendance' && <AttendanceView />}
            {activeTab === 'reports' && <ReportsView />}
            {activeTab === 'billing' && <BillingView />}
            {activeTab === 'settings' && <SettingsView />}
          </div>
        </main>
      </div>

      {/* Persistent Modals & Drawers */}
      <ChatbotWidget />
      <SMSAlertModal />
      <StudentProfileDrawer />
      <AddStudentModal />
      <CreateClassModal />
      <BulkUploadStudentsModal />
      <RegisterSchoolModal />
      <UnifiedAuthModal />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
