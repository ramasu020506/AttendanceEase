import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Plus, 
  Key, 
  Users, 
  GraduationCap, 
  Send, 
  ShieldCheck, 
  ExternalLink, 
  Copy, 
  Check, 
  Search, 
  Edit3, 
  Trash2, 
  Sparkles, 
  Smartphone, 
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  Calendar,
  Lock,
  Mail,
  Compass,
  CreditCard,
  Layers,
  Bot,
  UserCheck,
  BookOpen,
  UserPlus,
  Filter,
  Activity,
  Phone,
  Shield,
  Clock
} from 'lucide-react';
import { SchoolTenant, TenantUser, TenantUserRole, SaaSInvoice } from '../types';
import { TenantUserModal } from './TenantUserModal';
import { PLAN_TIERS } from '../data/mockData';

export const SuperAdminPortalView: React.FC = () => {
  const { 
    schools, 
    activeSchoolId, 
    switchActiveSchool, 
    createSchoolTenant, 
    updateSchoolTenant, 
    deleteSchoolTenant,
    allStudents,
    allClasses,
    allAttendanceRecords,
    allSMSAlerts,
    allTenantUsers,
    allInvoices,
    createTenantUser,
    updateTenantUser,
    deleteTenantUser,
    loginAsSchoolAdmin,
    loginAsParent,
    addToast,
    setUserRole,
    openChatbot
  } = useApp();

  // Active Main Tab: 'schools' | 'users' | 'analytics' | 'billing'
  const [activeMainTab, setActiveMainTab] = useState<'schools' | 'users' | 'analytics' | 'billing'>('schools');

  // Search & Filter for Schools
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState<string>('all');

  // Search & Filter for Tenant Users
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userTenantFilter, setUserTenantFilter] = useState<string>('all');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');

  // Provision New School Modal State
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminRole, setAdminRole] = useState('Head of School');
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [plan, setPlan] = useState<'Starter' | 'Pro Academy' | 'Enterprise Multi-Campus'>('Pro Academy');
  const [smsCredits, setSmsCredits] = useState(5000);
  const [smsSenderId, setSmsSenderId] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  // Password visibility map
  const [visiblePasswords, setVisiblePasswords] = useState<{ [key: string]: boolean }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Edit School Modal State
  const [editingSchool, setEditingSchool] = useState<SchoolTenant | null>(null);

  // Tenant User Modal State
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<TenantUser | null>(null);
  const [targetSchoolForNewUser, setTargetSchoolForNewUser] = useState<string | undefined>(undefined);

  // Overall platform statistics
  const totalSchools = schools.length;
  const activeSchoolsCount = schools.filter((s) => s.status === 'active').length;
  const totalGlobalStudents = allStudents.length;
  const totalGlobalSMS = allSMSAlerts.length;
  const totalGlobalUsers = allTenantUsers.length;

  const handleOpenProvision = () => {
    const randomCodeNum = Math.floor(100 + Math.random() * 900);
    setName('');
    setCode(`SCH-${randomCodeNum}`);
    setAdminName('');
    setAdminEmail('');
    setAdminPassword(`pass${Math.floor(1000 + Math.random() * 9000)}`);
    setAdminRole('Principal Administrator');
    setAcademicYear('2026-2027');
    setPlan('Pro Academy');
    setSmsCredits(10000);
    setSmsSenderId('CAMPUS-SMS');
    setPhone('+1 (555) 000-0000');
    setAddress('100 Academic Way, Suite A');
    setLogoUrl('https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=120&auto=format&fit=crop&q=80');
    setIsProvisionModalOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !adminEmail.trim() || !adminPassword.trim()) {
      addToast({
        title: 'Missing Required Fields',
        message: 'Please provide School Name, Admin Email, and Admin Password.',
        type: 'error',
      });
      return;
    }

    const created = createSchoolTenant({
      name: name.trim(),
      code: code.trim().toUpperCase() || `SCH-${Math.floor(1000 + Math.random() * 9000)}`,
      academicYear,
      logoUrl: logoUrl.trim() || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=120&auto=format&fit=crop&q=80',
      adminName: adminName.trim() || 'Principal Administrator',
      adminRole: adminRole.trim() || 'Principal',
      adminEmail: adminEmail.trim().toLowerCase(),
      adminPassword: adminPassword.trim(),
      adminAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      plan,
      status: 'active',
      remainingSMSCredits: Number(smsCredits) || 5000,
      smsSenderId: (smsSenderId.trim() || 'SCH-SMS').toUpperCase().slice(0, 11),
      autoDispatchAbsenteeSMS: true,
      attendanceCutoffTime: '09:00',
      phone: phone.trim(),
      address: address.trim(),
    });

    setIsProvisionModalOpen(false);

    navigator.clipboard?.writeText(
      `--- SCHOOL CREDENTIALS ---\nSchool: ${created.name}\nCode: ${created.code}\nAdmin Email: ${created.adminEmail}\nPassword: ${created.adminPassword}\nLogin Portal: Campus Connect Attendance`
    );
  };

  const handleCopyCredentials = (school: SchoolTenant) => {
    const text = `--- ${school.name} Administrative Access ---\nInstitution Code: ${school.code}\nLogin Email: ${school.adminEmail}\nInitial Password: ${school.adminPassword || 'demo1234'}\nAcademic Year: ${school.academicYear}\nSMS Sender ID: ${school.smsSenderId}`;
    navigator.clipboard.writeText(text);
    setCopiedId(school.id);
    addToast({
      title: 'Credentials Copied',
      message: `Access packet copied for ${school.name}.`,
      type: 'success',
    });
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handleCopyUserCredentials = (user: TenantUser) => {
    const school = schools.find((s) => s.id === user.schoolId);
    const text = `--- ${school?.name || 'School'} User Access ---\nUser: ${user.name} (${user.role})\nLogin Email / Phone: ${user.email} / ${user.phone || 'N/A'}\nPassword: ${user.password || 'demo1234'}\nDesignation: ${user.designation || 'Staff'}`;
    navigator.clipboard.writeText(text);
    setCopiedId(user.id);
    addToast({
      title: 'User Credentials Copied',
      message: `Login sheet copied for ${user.name}.`,
      type: 'success',
    });
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handleLaunchSchoolPortal = (schoolId: string) => {
    switchActiveSchool(schoolId);
    setUserRole('admin');
  };

  const handleImpersonateUser = (user: TenantUser) => {
    switchActiveSchool(user.schoolId);
    if (user.role === 'guardian' && user.phone) {
      loginAsParent(user.phone);
    } else {
      loginAsSchoolAdmin(user.email, user.password);
    }
  };

  const togglePasswordVisibility = (key: string) => {
    setVisiblePasswords((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Filter schools
  const filteredSchools = schools.filter((s) => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.adminEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.adminName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPlan = filterPlan === 'all' || s.plan.toLowerCase().includes(filterPlan.toLowerCase());
    return matchesSearch && matchesPlan;
  });

  // Filter tenant users
  const filteredUsers = allTenantUsers.filter((u) => {
    const matchesSearch = 
      u.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      (u.phone && u.phone.toLowerCase().includes(userSearchTerm.toLowerCase())) ||
      (u.designation && u.designation.toLowerCase().includes(userSearchTerm.toLowerCase()));

    const matchesTenant = userTenantFilter === 'all' || u.schoolId === userTenantFilter;
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;

    return matchesSearch && matchesTenant && matchesRole;
  });

  const openCreateUserForSchool = (schoolId: string) => {
    setTargetSchoolForNewUser(schoolId);
    setSelectedUserForEdit(null);
    setIsUserModalOpen(true);
  };

  const openManageUsersForSchool = (schoolId: string) => {
    setUserTenantFilter(schoolId);
    setActiveMainTab('users');
  };

  const handleSaveTenantUser = (userData: Omit<TenantUser, 'id' | 'createdAt'>, userId?: string) => {
    if (userId) {
      updateTenantUser(userId, userData);
    } else {
      createTenantUser(userData);
    }
  };

  const getRoleBadge = (role: TenantUserRole) => {
    switch (role) {
      case 'admin':
        return { bg: 'bg-red-50 text-red-700 border-red-200', icon: Shield, label: 'Admin' };
      case 'principal':
        return { bg: 'bg-purple-50 text-purple-700 border-purple-200', icon: ShieldCheck, label: 'Principal' };
      case 'teacher':
        return { bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: BookOpen, label: 'Teacher' };
      case 'staff':
        return { bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: UserCheck, label: 'Staff' };
      case 'guardian':
        return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: Smartphone, label: 'Guardian' };
      default:
        return { bg: 'bg-gray-50 text-gray-700 border-gray-200', icon: Users, label: role };
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#1A1A1A] font-sans pb-24">
      {/* Super Admin Top Header */}
      <div className="bg-[#1A1A1A] text-[#F4F1ED] border-b border-[#2A2A2A] px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Platform Agent Control Center
                </span>
                <span className="text-xs text-[#F4F1ED]/50 font-mono">v4.2 Multi-Tenant Core</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-[#F4F1ED] mt-0.5">
                Tenant & User Provisioning Manager
              </h1>
              <p className="text-xs text-[#F4F1ED]/70 mt-0.5">
                Create and manage school tenants, assign roles and credentials, and oversee platform users.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => openChatbot('How do I provision a new tenant or create users for Demo School?')}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl transition-all border border-white/20 cursor-pointer"
            >
              <Bot className="w-4 h-4 text-amber-400" />
              <span>Sentinel AI Copilot</span>
            </button>

            <button
              onClick={() => {
                setTargetSchoolForNewUser(undefined);
                setSelectedUserForEdit(null);
                setIsUserModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-white/15 hover:bg-white/25 text-white font-semibold text-xs rounded-xl transition-all border border-white/20 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-emerald-400" />
              <span>+ Create Tenant User</span>
            </button>

            <button
              id="provision-new-school-btn"
              onClick={handleOpenProvision}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-[#1A1A1A] font-bold text-xs rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Provision School Tenant</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8">
        {/* KPI Platform Overview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-[#1A1A1A]/10 shadow-xs">
            <div className="flex items-center justify-between text-[#1A1A1A]/60 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">School Tenants</span>
              <Building2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">{totalSchools}</div>
            <div className="text-xs text-emerald-700 mt-1 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{activeSchoolsCount} active tenant workspaces</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#1A1A1A]/10 shadow-xs">
            <div className="flex items-center justify-between text-[#1A1A1A]/60 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Tenant Users</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">{totalGlobalUsers}</div>
            <div className="text-xs text-[#1A1A1A]/60 mt-1 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              <span>Admins, Teachers, Staff & Guardians</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#1A1A1A]/10 shadow-xs">
            <div className="flex items-center justify-between text-[#1A1A1A]/60 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Enrolled Scholars</span>
              <GraduationCap className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">{totalGlobalStudents}</div>
            <div className="text-xs text-[#1A1A1A]/60 mt-1 flex items-center gap-1">
              <span>Across {allClasses.length} academic classes</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#1A1A1A]/10 shadow-xs">
            <div className="flex items-center justify-between text-[#1A1A1A]/60 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Workspace</span>
              <Compass className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-lg font-bold text-[#1A1A1A] truncate tracking-tight">
              {schools.find((s) => s.id === activeSchoolId)?.name || 'Demo School'}
            </div>
            <button
              onClick={() => handleLaunchSchoolPortal(activeSchoolId)}
              className="text-xs text-amber-800 hover:underline mt-1 inline-flex items-center gap-1 font-semibold"
            >
              <span>Launch active school dashboard</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Top View Selector Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-[#1A1A1A]/10 pb-3">
          <button
            onClick={() => setActiveMainTab('schools')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeMainTab === 'schools'
                ? 'bg-[#1A1A1A] text-white shadow-xs'
                : 'bg-white text-[#1A1A1A]/70 hover:text-[#1A1A1A] border border-[#1A1A1A]/10'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>School Tenants ({schools.length})</span>
          </button>

          <button
            onClick={() => setActiveMainTab('users')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeMainTab === 'users'
                ? 'bg-[#1A1A1A] text-white shadow-xs'
                : 'bg-white text-[#1A1A1A]/70 hover:text-[#1A1A1A] border border-[#1A1A1A]/10'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Tenant Users Directory ({allTenantUsers.length})</span>
          </button>

          <button
            onClick={() => setActiveMainTab('analytics')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeMainTab === 'analytics'
                ? 'bg-[#1A1A1A] text-white shadow-xs'
                : 'bg-white text-[#1A1A1A]/70 hover:text-[#1A1A1A] border border-[#1A1A1A]/10'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Platform Telemetry & Gateways</span>
          </button>

          <button
            onClick={() => setActiveMainTab('billing')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeMainTab === 'billing'
                ? 'bg-[#1A1A1A] text-white shadow-xs'
                : 'bg-white text-[#1A1A1A]/70 hover:text-[#1A1A1A] border border-[#1A1A1A]/10'
            }`}
          >
            <CreditCard className="w-4 h-4 text-amber-600" />
            <span>SaaS Subscriptions & Invoices ({allInvoices.length})</span>
          </button>
        </div>

        {/* TAB 1: SCHOOL TENANTS */}
        {activeMainTab === 'schools' && (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-[#1A1A1A]/10 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#1A1A1A]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search tenants by school name, code (e.g. SCH-DEMO), admin email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F8F7F4] border border-[#1A1A1A]/10 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={filterPlan}
                  onChange={(e) => setFilterPlan(e.target.value)}
                  className="px-3.5 py-2.5 bg-[#F8F7F4] border border-[#1A1A1A]/10 rounded-xl text-xs font-semibold text-[#1A1A1A] focus:outline-hidden"
                >
                  <option value="all">All Subscription Plans</option>
                  <option value="Starter">Starter Plan</option>
                  <option value="Pro">Pro Academy</option>
                  <option value="Enterprise">Enterprise Multi-Campus</option>
                </select>
              </div>
            </div>

            {/* Schools List Cards */}
            <div className="space-y-4">
              {filteredSchools.map((school) => {
                const schoolStudents = allStudents.filter((s) => (s.schoolId || 'school-demo') === school.id);
                const schoolClasses = allClasses.filter((c) => (c.schoolId || 'school-demo') === school.id);
                const schoolUsers = allTenantUsers.filter((u) => u.schoolId === school.id);
                const isSelected = school.id === activeSchoolId;
                const isPassVisible = visiblePasswords[school.id];

                return (
                  <div
                    key={school.id}
                    className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md ${
                      isSelected ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-[#1A1A1A]/10'
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        {/* School Identity */}
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-14 h-14 rounded-2xl bg-[#F4F1ED] border border-[#1A1A1A]/10 overflow-hidden shrink-0 flex items-center justify-center p-1">
                            {school.logoUrl ? (
                              <img
                                src={school.logoUrl}
                                alt={school.name}
                                className="w-full h-full object-contain rounded-xl"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <Building2 className="w-6 h-6 text-[#1A1A1A]/40" />
                            )}
                          </div>

                          <div className="space-y-1 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h2 className="text-lg font-bold text-[#1A1A1A] tracking-tight">{school.name}</h2>
                              <span className="font-mono text-xs font-semibold px-2.5 py-0.5 bg-[#1A1A1A]/5 text-[#1A1A1A]/80 rounded-md border border-[#1A1A1A]/10">
                                {school.code}
                              </span>
                              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                                school.status === 'active' 
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {school.status.toUpperCase()}
                              </span>
                              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-100">
                                {school.plan}
                              </span>
                              {isSelected && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white uppercase tracking-wider">
                                  Active Workspace
                                </span>
                              )}
                            </div>

                            <div className="text-xs text-[#1A1A1A]/60 flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-[#1A1A1A]/40" />
                                Academic Year: <strong>{school.academicYear}</strong>
                              </span>
                              <span className="flex items-center gap-1">
                                <Send className="w-3.5 h-3.5 text-[#1A1A1A]/40" />
                                SMS Sender: <strong>{school.smsSenderId}</strong>
                              </span>
                              <span className="flex items-center gap-1">
                                <CreditCard className="w-3.5 h-3.5 text-[#1A1A1A]/40" />
                                SMS Credits: <strong>{school.remainingSMSCredits.toLocaleString()}</strong>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* School Metrics */}
                        <div className="grid grid-cols-3 gap-2 shrink-0 lg:w-64 bg-[#F8F7F4] p-3 rounded-xl border border-[#1A1A1A]/5 text-center">
                          <div>
                            <div className="text-[10px] uppercase font-bold text-[#1A1A1A]/50">Users</div>
                            <div className="text-base font-extrabold text-[#1A1A1A]">{schoolUsers.length}</div>
                          </div>
                          <div>
                            <div className="text-[10px] uppercase font-bold text-[#1A1A1A]/50">Classes</div>
                            <div className="text-base font-extrabold text-[#1A1A1A]">{schoolClasses.length}</div>
                          </div>
                          <div>
                            <div className="text-[10px] uppercase font-bold text-[#1A1A1A]/50">Scholars</div>
                            <div className="text-base font-extrabold text-[#1A1A1A]">{schoolStudents.length}</div>
                          </div>
                        </div>
                      </div>

                      {/* School Administrator Login Credentials Card */}
                      <div className="mt-5 pt-4 border-t border-[#1A1A1A]/10 bg-[#FAF9F6] p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/50 flex items-center gap-1.5">
                            <Key className="w-3.5 h-3.5 text-amber-600" />
                            <span>Primary Tenant Administrator Credentials</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-xs">
                            <div>
                              <span className="text-[#1A1A1A]/60 mr-1">Admin:</span>
                              <strong className="text-[#1A1A1A]">{school.adminName}</strong> ({school.adminRole})
                            </div>
                            <div>
                              <span className="text-[#1A1A1A]/60 mr-1">Login Email:</span>
                              <code className="font-mono font-bold bg-white px-2 py-0.5 rounded-md border border-[#1A1A1A]/10 text-emerald-800">
                                {school.adminEmail}
                              </code>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[#1A1A1A]/60 mr-1">Password:</span>
                              <code className="font-mono font-bold bg-white px-2 py-0.5 rounded-md border border-[#1A1A1A]/10 text-purple-800">
                                {isPassVisible ? (school.adminPassword || 'demo1234') : '••••••••••••'}
                              </code>
                              <button
                                onClick={() => togglePasswordVisibility(school.id)}
                                className="text-[#1A1A1A]/50 hover:text-[#1A1A1A] p-1"
                                title={isPassVisible ? 'Hide password' : 'Show password'}
                              >
                                {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => openManageUsersForSchool(school.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#F4F1ED] border border-[#1A1A1A]/15 text-[#1A1A1A] text-xs font-semibold rounded-lg transition-colors shadow-xs"
                          >
                            <Users className="w-3.5 h-3.5 text-blue-600" />
                            <span>Manage Users ({schoolUsers.length})</span>
                          </button>

                          <button
                            onClick={() => openCreateUserForSchool(school.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#F4F1ED] border border-[#1A1A1A]/15 text-[#1A1A1A] text-xs font-semibold rounded-lg transition-colors shadow-xs"
                          >
                            <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
                            <span>+ User</span>
                          </button>

                          <button
                            onClick={() => handleCopyCredentials(school)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#F4F1ED] border border-[#1A1A1A]/15 text-[#1A1A1A] text-xs font-semibold rounded-lg transition-colors shadow-xs"
                          >
                            {copiedId === school.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#1A1A1A]/60" />}
                            <span>{copiedId === school.id ? 'Copied!' : 'Copy Sheet'}</span>
                          </button>

                          <button
                            onClick={() => setEditingSchool(school)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-[#F4F1ED] border border-[#1A1A1A]/15 text-[#1A1A1A] text-xs font-semibold rounded-lg transition-colors shadow-xs"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-[#1A1A1A]/60" />
                            <span>Edit</span>
                          </button>

                          <button
                            id={`launch-school-${school.id}`}
                            onClick={() => handleLaunchSchoolPortal(school.id)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1A1A1A] hover:bg-[#333333] text-white text-xs font-bold rounded-lg transition-all shadow-xs"
                          >
                            <span>Launch Portal</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredSchools.length === 0 && (
                <div className="bg-white p-12 rounded-2xl border border-[#1A1A1A]/10 text-center space-y-3">
                  <Building2 className="w-10 h-10 text-[#1A1A1A]/30 mx-auto" />
                  <div className="text-base font-bold text-[#1A1A1A]">No client schools match your search</div>
                  <p className="text-xs text-[#1A1A1A]/60 max-w-sm mx-auto">
                    Try searching by a different school name, institution code, or click "Provision New School Tenant".
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: TENANT USER DIRECTORY & ROLE MATRIX */}
        {activeMainTab === 'users' && (
          <div className="space-y-6">
            {/* Filter & Action Controls */}
            <div className="bg-white p-4 rounded-2xl border border-[#1A1A1A]/10 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#1A1A1A]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search users by name, email, phone number, or job title..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F8F7F4] border border-[#1A1A1A]/10 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Filter by Tenant */}
                <select
                  value={userTenantFilter}
                  onChange={(e) => setUserTenantFilter(e.target.value)}
                  className="px-3.5 py-2.5 bg-[#F8F7F4] border border-[#1A1A1A]/10 rounded-xl text-xs font-semibold text-[#1A1A1A] focus:outline-hidden"
                >
                  <option value="all">All School Tenants ({schools.length})</option>
                  {schools.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>

                {/* Filter by Role */}
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="px-3.5 py-2.5 bg-[#F8F7F4] border border-[#1A1A1A]/10 rounded-xl text-xs font-semibold text-[#1A1A1A] focus:outline-hidden"
                >
                  <option value="all">All User Roles</option>
                  <option value="admin">Administrators</option>
                  <option value="principal">Principals</option>
                  <option value="teacher">Teachers / Faculty</option>
                  <option value="staff">Office Staff</option>
                  <option value="guardian">Guardians / Parents</option>
                </select>

                <button
                  onClick={() => {
                    setTargetSchoolForNewUser(userTenantFilter !== 'all' ? userTenantFilter : undefined);
                    setSelectedUserForEdit(null);
                    setIsUserModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#1A1A1A] hover:bg-[#333333] text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                >
                  <UserPlus className="w-3.5 h-3.5 text-amber-400" />
                  <span>+ Create Tenant User</span>
                </button>
              </div>
            </div>

            {/* Tenant Users Table */}
            <div className="bg-white rounded-2xl border border-[#1A1A1A]/10 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF9F6] text-[#1A1A1A]/60 font-semibold border-b border-[#1A1A1A]/10 uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3.5">User & Identity</th>
                      <th className="px-4 py-3.5">School Tenant</th>
                      <th className="px-4 py-3.5">Role & Designation</th>
                      <th className="px-4 py-3.5">Contact Details</th>
                      <th className="px-4 py-3.5">Credentials / Password</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Platform Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A1A1A]/5">
                    {filteredUsers.map((user) => {
                      const school = schools.find((s) => s.id === user.schoolId);
                      const roleBadge = getRoleBadge(user.role);
                      const RoleIcon = roleBadge.icon;
                      const isPassVis = visiblePasswords[user.id];

                      return (
                        <tr key={user.id} className="hover:bg-[#FDFCFB] transition-colors">
                          {/* User & Identity */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 font-bold flex items-center justify-center text-xs shrink-0">
                                {user.name.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-bold text-[#1A1A1A] text-sm">{user.name}</div>
                                <div className="text-[11px] text-[#1A1A1A]/50 font-mono">{user.email}</div>
                              </div>
                            </div>
                          </td>

                          {/* School Tenant */}
                          <td className="px-4 py-4">
                            {school ? (
                              <div>
                                <div className="font-semibold text-[#1A1A1A]">{school.name}</div>
                                <span className="font-mono text-[10px] font-bold text-[#1A1A1A]/60 px-1.5 py-0.5 bg-[#1A1A1A]/5 rounded">
                                  {school.code}
                                </span>
                              </div>
                            ) : (
                              <span className="text-[#1A1A1A]/40 italic">Unknown School</span>
                            )}
                          </td>

                          {/* Role & Designation */}
                          <td className="px-4 py-4">
                            <div className="space-y-1">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${roleBadge.bg}`}>
                                <RoleIcon className="w-3 h-3" />
                                <span>{roleBadge.label}</span>
                              </span>
                              {user.designation && (
                                <div className="text-[11px] text-[#1A1A1A]/60 font-medium">{user.designation}</div>
                              )}
                              {user.assignedClassName && (
                                <div className="text-[10px] text-blue-700 font-medium">Class: {user.assignedClassName}</div>
                              )}
                            </div>
                          </td>

                          {/* Contact Details */}
                          <td className="px-4 py-4">
                            <div className="space-y-0.5">
                              {user.phone ? (
                                <div className="flex items-center gap-1 font-mono text-[11px] text-[#1A1A1A]">
                                  <Phone className="w-3 h-3 text-[#1A1A1A]/40" />
                                  <span>{user.phone}</span>
                                </div>
                              ) : (
                                <span className="text-[11px] text-[#1A1A1A]/40">No phone</span>
                              )}
                              <div className="flex items-center gap-1 text-[11px] text-[#1A1A1A]/60">
                                <Mail className="w-3 h-3 text-[#1A1A1A]/40" />
                                <span className="truncate max-w-[140px]">{user.email}</span>
                              </div>
                            </div>
                          </td>

                          {/* Credentials / Password */}
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1.5 font-mono text-xs">
                              <span className="px-2 py-0.5 rounded bg-[#1A1A1A]/5 border border-[#1A1A1A]/10 text-purple-900 font-bold">
                                {isPassVis ? (user.password || 'demo1234') : '••••••••'}
                              </span>
                              <button
                                onClick={() => togglePasswordVisibility(user.id)}
                                className="text-[#1A1A1A]/40 hover:text-[#1A1A1A] p-1"
                                title="Toggle password"
                              >
                                {isPassVis ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              user.status === 'active' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : user.status === 'pending'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                user.status === 'active' ? 'bg-emerald-600' : 'bg-amber-600'
                              }`} />
                              <span>{user.status.toUpperCase()}</span>
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleImpersonateUser(user)}
                                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-[11px] font-bold transition-colors inline-flex items-center gap-1"
                                title="Test login as this tenant user"
                              >
                                <span>Test Login</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>

                              <button
                                onClick={() => handleCopyUserCredentials(user)}
                                className="p-1.5 hover:bg-[#F4F1ED] text-[#1A1A1A]/60 hover:text-[#1A1A1A] rounded-lg border border-transparent hover:border-[#1A1A1A]/10 transition-colors"
                                title="Copy user login credentials"
                              >
                                {copiedId === user.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedUserForEdit(user);
                                  setIsUserModalOpen(true);
                                }}
                                className="p-1.5 hover:bg-[#F4F1ED] text-[#1A1A1A]/60 hover:text-[#1A1A1A] rounded-lg border border-transparent hover:border-[#1A1A1A]/10 transition-colors"
                                title="Edit user"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => {
                                  if (confirm(`Remove user ${user.name}?`)) {
                                    deleteTenantUser(user.id);
                                  }
                                }}
                                className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                title="Delete user"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filteredUsers.length === 0 && (
                <div className="p-12 text-center space-y-3">
                  <Users className="w-10 h-10 text-[#1A1A1A]/30 mx-auto" />
                  <div className="text-base font-bold text-[#1A1A1A]">No tenant users found</div>
                  <p className="text-xs text-[#1A1A1A]/60 max-w-sm mx-auto">
                    Try clearing your filters or create a new user assigned to a school tenant.
                  </p>
                  <button
                    onClick={() => {
                      setTargetSchoolForNewUser(undefined);
                      setSelectedUserForEdit(null);
                      setIsUserModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-[#1A1A1A] text-xs font-bold rounded-xl shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create User Now</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PLATFORM TELEMETRY & GATEWAYS */}
        {activeMainTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white p-6 rounded-2xl border border-[#1A1A1A]/10 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
                  <Send className="w-4 h-4" />
                  <span>SMS Carrier Dispatch Engine</span>
                </div>
                <div className="text-2xl font-extrabold text-[#1A1A1A]">99.8% Gateway Uptime</div>
                <p className="text-xs text-[#1A1A1A]/60 leading-relaxed">
                  Automatic carrier routing across Verizon, AT&T, T-Mobile with 2-second guaranteed OTP delivery.
                </p>
                <div className="pt-2 border-t border-[#1A1A1A]/10 text-xs text-[#1A1A1A]/70 flex justify-between">
                  <span>Delivered Today:</span>
                  <strong>{allSMSAlerts.length} messages</strong>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#1A1A1A]/10 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-800">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Multi-Tenant Data Isolation</span>
                </div>
                <div className="text-2xl font-extrabold text-[#1A1A1A]">Encrypted Workspace RBAC</div>
                <p className="text-xs text-[#1A1A1A]/60 leading-relaxed">
                  Every tenant operates within a dedicated tenant sandbox. Parents can only access their specific child's records.
                </p>
                <div className="pt-2 border-t border-[#1A1A1A]/10 text-xs text-[#1A1A1A]/70 flex justify-between">
                  <span>Tenants Configured:</span>
                  <strong>{schools.length} institutions</strong>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#1A1A1A]/10 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-800">
                  <Bot className="w-4 h-4" />
                  <span>Gemini Sentinel AI</span>
                </div>
                <div className="text-2xl font-extrabold text-[#1A1A1A]">Active Attendance Copilot</div>
                <p className="text-xs text-[#1A1A1A]/60 leading-relaxed">
                  Natural language attendance auditing, policy assistance, and cross-tenant administrative assistance.
                </p>
                <div className="pt-2 border-t border-[#1A1A1A]/10 text-xs text-[#1A1A1A]/70 flex justify-between">
                  <span>Platform Agent Role:</span>
                  <strong className="text-emerald-700 font-bold">Enabled & Verified</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SAAS SUBSCRIPTION & REVENUE MANAGEMENT */}
        {activeMainTab === 'billing' && (
          <div className="space-y-6">
            {/* SaaS Revenue & MRR Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#1A1A1A]/10 shadow-xs">
                <div className="flex items-center justify-between text-[#1A1A1A]/60 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Estimated MRR</span>
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
                  ${schools.reduce((acc, s) => {
                    const p = PLAN_TIERS.find((tier) => tier.id === s.plan);
                    return acc + (p?.monthlyPrice || 199);
                  }, 0).toLocaleString()}
                </div>
                <div className="text-xs text-emerald-700 mt-1 flex items-center gap-1 font-semibold">
                  <span>Monthly Recurring Revenue</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#1A1A1A]/10 shadow-xs">
                <div className="flex items-center justify-between text-[#1A1A1A]/60 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Projected ARR</span>
                  <CreditCard className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
                  ${(schools.reduce((acc, s) => {
                    const p = PLAN_TIERS.find((tier) => tier.id === s.plan);
                    return acc + (p?.monthlyPrice || 199);
                  }, 0) * 12).toLocaleString()}
                </div>
                <div className="text-xs text-[#1A1A1A]/60 mt-1 font-medium">
                  Annualized Run Rate
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#1A1A1A]/10 shadow-xs">
                <div className="flex items-center justify-between text-[#1A1A1A]/60 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Total Invoices Paid</span>
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
                  ${allInvoices.reduce((acc, inv) => acc + inv.amount, 0).toLocaleString()}
                </div>
                <div className="text-xs text-[#1A1A1A]/60 mt-1 font-medium">
                  {allInvoices.length} historical statements
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#1A1A1A]/10 shadow-xs">
                <div className="flex items-center justify-between text-[#1A1A1A]/60 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">SMS Pool In Circulation</span>
                  <Send className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
                  {schools.reduce((acc, s) => acc + s.remainingSMSCredits, 0).toLocaleString()}
                </div>
                <div className="text-xs text-[#1A1A1A]/60 mt-1 font-medium">
                  Across all school tenants
                </div>
              </div>
            </div>

            {/* Plan Distribution Breakdown */}
            <div className="bg-white p-6 rounded-2xl border border-[#1A1A1A]/10 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 pb-3">
                <div>
                  <h3 className="text-base font-bold text-[#1A1A1A]">SaaS Subscription Tier Distribution</h3>
                  <p className="text-xs text-[#1A1A1A]/60">Breakdown of institutional clients enrolled in each pricing package</p>
                </div>
                <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
                  {schools.length} Total Subscribed Tenants
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {PLAN_TIERS.map((tier) => {
                  const subscribedSchools = schools.filter((s) => s.plan === tier.id);
                  return (
                    <div key={tier.id} className="p-4 rounded-xl border border-[#1A1A1A]/10 bg-[#FAF9F6] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-[#1A1A1A]">{tier.name}</span>
                        <span className="font-serif font-bold text-base text-[#1A1A1A]">${tier.monthlyPrice}/mo</span>
                      </div>
                      <p className="text-xs text-[#1A1A1A]/60">{tier.tagline}</p>
                      <div className="pt-2 border-t border-[#1A1A1A]/10 flex items-center justify-between text-xs">
                        <span className="text-[#1A1A1A]/70">Subscribers:</span>
                        <span className="font-bold text-amber-950 bg-amber-200/70 px-2 py-0.5 rounded font-mono">
                          {subscribedSchools.length} Schools
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Global Master Invoices Table */}
            <div className="bg-white p-6 rounded-2xl border border-[#1A1A1A]/10 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 pb-3">
                <div>
                  <h3 className="text-base font-bold text-[#1A1A1A]">Global Multi-Tenant Invoices</h3>
                  <p className="text-xs text-[#1A1A1A]/60">Real-time accounting ledger of all billing cycles and SMS add-on top-ups across schools</p>
                </div>
                <span className="text-xs font-mono text-[#1A1A1A]/60">{allInvoices.length} Transactions</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#1A1A1A]/10 bg-[#FAF9F6] text-[10px] uppercase tracking-wider text-[#1A1A1A]/60 font-bold">
                      <th className="py-3 px-4">Invoice #</th>
                      <th className="py-3 px-4">Institution / School</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Payment Method</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A1A1A]/5">
                    {allInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-[#FAF9F6] transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#1A1A1A]">
                          {inv.invoiceNumber}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-amber-950">
                          {inv.schoolName}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[#1A1A1A]/70">
                          {inv.date}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-[#1A1A1A]">
                          {inv.description}
                        </td>
                        <td className="py-3.5 px-4 font-serif font-bold text-sm text-[#1A1A1A]">
                          ${inv.amount.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[#1A1A1A]/70">
                          {inv.paymentMethod}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <Check className="w-2.5 h-2.5" /> {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PROVISION NEW SCHOOL TENANT MODAL */}
      {isProvisionModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-[#1A1A1A]/20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 bg-[#1A1A1A] text-[#F4F1ED] flex items-center justify-between border-b border-[#2A2A2A]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#F4F1ED]">Provision New School Tenant</h3>
                  <p className="text-xs text-[#F4F1ED]/60">Create tenant workspace and assign lead administrator credentials</p>
                </div>
              </div>
              <button
                onClick={() => setIsProvisionModalOpen(false)}
                className="text-[#F4F1ED]/60 hover:text-[#F4F1ED] p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-5">
              {/* Institution Details */}
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]/50 border-b border-[#1A1A1A]/10 pb-1">
                  1. School Tenant Profile & Subscription
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                      School / Academy Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. St. Peter's Preparatory Academy"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#F8F7F4] border border-[#1A1A1A]/15 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                      Tenant Code (e.g. SCH-101) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SCH-101"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#F8F7F4] border border-[#1A1A1A]/15 rounded-xl text-sm uppercase font-mono focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Academic Year</label>
                    <input
                      type="text"
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#F8F7F4] border border-[#1A1A1A]/15 rounded-xl text-sm focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Subscription Plan</label>
                    <select
                      value={plan}
                      onChange={(e) => setPlan(e.target.value as any)}
                      className="w-full px-3.5 py-2 bg-[#F8F7F4] border border-[#1A1A1A]/15 rounded-xl text-sm focus:outline-hidden"
                    >
                      <option value="Starter">Starter (Small School)</option>
                      <option value="Pro Academy">Pro Academy (Standard)</option>
                      <option value="Enterprise Multi-Campus">Enterprise Multi-Campus</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Initial SMS Credits</label>
                    <input
                      type="number"
                      value={smsCredits}
                      onChange={(e) => setSmsCredits(Number(e.target.value))}
                      className="w-full px-3.5 py-2 bg-[#F8F7F4] border border-[#1A1A1A]/15 rounded-xl text-sm focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">SMS Sender ID (11 chars max)</label>
                    <input
                      type="text"
                      maxLength={11}
                      placeholder="e.g. STPETERS"
                      value={smsSenderId}
                      onChange={(e) => setSmsSenderId(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#F8F7F4] border border-[#1A1A1A]/15 rounded-xl text-sm uppercase font-mono focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">School Logo URL</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#F8F7F4] border border-[#1A1A1A]/15 rounded-xl text-sm focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Lead Administrator Credentials */}
              <div className="space-y-4 pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]/50 border-b border-[#1A1A1A]/10 pb-1 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-600" />
                  <span>2. Tenant Lead Administrator Access Credentials</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                      Lead Administrator Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Arthur Pendelton"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#F8F7F4] border border-[#1A1A1A]/15 rounded-xl text-sm focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                      Role / Designation
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Principal / Headmaster"
                      value={adminRole}
                      onChange={(e) => setAdminRole(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#F8F7F4] border border-[#1A1A1A]/15 rounded-xl text-sm focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-amber-500/5 p-3.5 rounded-xl border border-amber-500/20">
                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                      Login Email (Username) *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. principal@stpeters.edu"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-[#1A1A1A]/15 rounded-xl text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                      Initial Password *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. peter1234"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-[#1A1A1A]/15 rounded-xl text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#1A1A1A]/10">
                <button
                  type="button"
                  onClick={() => setIsProvisionModalOpen(false)}
                  className="px-4 py-2.5 bg-[#F8F7F4] hover:bg-[#EBE7E0] text-[#1A1A1A] text-sm font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-[#1A1A1A] text-sm font-bold rounded-xl shadow-md transition-all active:scale-95"
                >
                  Provision School Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT SCHOOL / SMS CREDITS MODAL */}
      {editingSchool && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-[#1A1A1A]/20 overflow-hidden animate-in fade-in duration-200">
            <div className="px-6 py-4 bg-[#1A1A1A] text-[#F4F1ED] flex items-center justify-between">
              <h3 className="text-base font-bold">Edit Tenant: {editingSchool.name}</h3>
              <button onClick={() => setEditingSchool(null)} className="text-[#F4F1ED]/60 hover:text-white">✕</button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Add / Modify SMS Credits</label>
                <input
                  type="number"
                  value={editingSchool.remainingSMSCredits}
                  onChange={(e) => setEditingSchool({ ...editingSchool, remainingSMSCredits: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 bg-[#F8F7F4] border border-[#1A1A1A]/15 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Subscription Status</label>
                <select
                  value={editingSchool.status}
                  onChange={(e) => setEditingSchool({ ...editingSchool, status: e.target.value as any })}
                  className="w-full px-3.5 py-2 bg-[#F8F7F4] border border-[#1A1A1A]/15 rounded-xl text-sm"
                >
                  <option value="active">Active Subscription</option>
                  <option value="trial">Free Trial</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Admin Password Reset</label>
                <input
                  type="text"
                  value={editingSchool.adminPassword || ''}
                  onChange={(e) => setEditingSchool({ ...editingSchool, adminPassword: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#F8F7F4] border border-[#1A1A1A]/15 rounded-xl text-sm font-mono"
                />
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-[#1A1A1A]/10">
                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete ${editingSchool.name}? All associated classes and students will be removed.`)) {
                      deleteSchoolTenant(editingSchool.id);
                      setEditingSchool(null);
                    }
                  }}
                  className="text-xs text-red-600 hover:text-red-700 font-semibold inline-flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Tenant</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingSchool(null)}
                    className="px-4 py-2 bg-[#F8F7F4] text-[#1A1A1A] text-xs font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      updateSchoolTenant(editingSchool.id, editingSchool);
                      setEditingSchool(null);
                    }}
                    className="px-4 py-2 bg-[#1A1A1A] text-white text-xs font-bold rounded-xl"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TENANT USER CREATE / EDIT MODAL */}
      <TenantUserModal
        isOpen={isUserModalOpen}
        onClose={() => {
          setIsUserModalOpen(false);
          setSelectedUserForEdit(null);
          setTargetSchoolForNewUser(undefined);
        }}
        onSave={handleSaveTenantUser}
        initialUser={selectedUserForEdit}
        schools={schools}
        defaultSchoolId={targetSchoolForNewUser}
        classes={allClasses}
        students={allStudents}
      />
    </div>
  );
};
