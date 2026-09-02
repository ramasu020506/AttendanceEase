import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  Student, 
  ClassRoom, 
  AttendanceRecord, 
  SMSAlert, 
  SchoolSettings, 
  AttendanceStatus, 
  SMSCategory, 
  SMSStatus, 
  UserRole, 
  ParentSession, 
  ParentExcuseSubmission,
  SchoolTenant, 
  TenantUser,
  SaaSSubscriptionPlan,
  BillingCycle,
  SaaSInvoice,
  SMSAddOnPack,
  PlanTierConfig
} from '../types';
import { 
  INITIAL_CLASSES, 
  INITIAL_STUDENTS, 
  INITIAL_ATTENDANCE, 
  INITIAL_SMS_ALERTS, 
  INITIAL_SETTINGS,
  INITIAL_PARENT_EXCUSES,
  INITIAL_SCHOOLS,
  INITIAL_TENANT_USERS,
  INITIAL_INVOICES,
  PLAN_TIERS,
  SMS_ADDON_PACKS
} from '../data/mockData';

export type ActiveTab = 'dashboard' | 'classes' | 'students' | 'attendance' | 'reports' | 'settings' | 'billing';

interface SMSModalRecipientConfig {
  studentId?: string;
  studentName?: string;
  guardianName?: string;
  guardianPhone?: string;
  className?: string;
  category?: SMSCategory;
  defaultMessage?: string;
}

interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

// Utility to normalize telephone numbers by stripping non-numeric chars
export const normalizePhone = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

// Check if two phone numbers match (accounting for country code variations like leading '1')
export const matchPhoneNumbers = (phoneA: string, phoneB: string): boolean => {
  const normA = normalizePhone(phoneA);
  const normB = normalizePhone(phoneB);
  if (!normA || !normB) return false;
  if (normA === normB) return true;
  // Match last 10 digits
  const last10A = normA.slice(-10);
  const last10B = normB.slice(-10);
  return last10A.length >= 7 && last10A === last10B;
};

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedClassId: string;
  setSelectedClassId: (classId: string) => void;
  
  // Multi-Tenancy & Super Admin
  schools: SchoolTenant[];
  activeSchoolId: string;
  currentSchool: SchoolTenant;
  switchActiveSchool: (schoolId: string) => void;
  createSchoolTenant: (newSchool: Omit<SchoolTenant, 'id' | 'createdAt'>) => SchoolTenant;
  updateSchoolTenant: (schoolId: string, updates: Partial<SchoolTenant>) => void;
  deleteSchoolTenant: (schoolId: string) => void;

  // Tenant Users Management (Platform Agent & Admin)
  allTenantUsers: TenantUser[];
  tenantUsers: TenantUser[];
  currentTenantUser: TenantUser;
  switchTenantUser: (userId: string) => void;
  impersonateTenantUser: (user: TenantUser) => void;
  createTenantUser: (userData: Omit<TenantUser, 'id' | 'createdAt'>) => TenantUser;
  updateTenantUser: (userId: string, updates: Partial<TenantUser>) => void;
  deleteTenantUser: (userId: string) => void;
  
  // User Authentication & Roles
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  parentSession: ParentSession | null;
  selectedChildIdForParent: string | null;
  setSelectedChildIdForParent: (childId: string | null) => void;
  
  loginAsParent: (phone: string) => { success: boolean; studentCount: number; message: string; parentName?: string };
  loginAsSchoolAdmin: (email: string, password?: string, schoolCode?: string) => { success: boolean; message: string; school?: SchoolTenant };
  loginAsSuperAdmin: (passcode?: string) => { success: boolean; message: string };
  logout: () => void;
  
  // Parent Excuses
  parentExcuseSubmissions: ParentExcuseSubmission[];
  submitParentExcuse: (studentId: string, date: string, reason: string) => void;
  updateExcuseStatus: (excuseId: string, status: 'acknowledged' | 'approved') => void;

  students: Student[];
  classes: ClassRoom[];
  attendanceRecords: AttendanceRecord[];
  smsAlerts: SMSAlert[];
  settings: SchoolSettings;
  
  // All global collections (for Super Admin analytics)
  allStudents: Student[];
  allClasses: ClassRoom[];
  allAttendanceRecords: AttendanceRecord[];
  allSMSAlerts: SMSAlert[];
  
  // Modals & Drawers
  isSMSModalOpen: boolean;
  smsModalConfig: SMSModalRecipientConfig | null;
  openSMSModal: (config?: SMSModalRecipientConfig) => void;
  closeSMSModal: () => void;
  
  selectedStudentForDrawer: Student | null;
  setSelectedStudentForDrawer: (student: Student | null) => void;
  
  isAddStudentModalOpen: boolean;
  setIsAddStudentModalOpen: (open: boolean) => void;

  isCreateClassModalOpen: boolean;
  setIsCreateClassModalOpen: (open: boolean) => void;

  isBulkUploadModalOpen: boolean;
  setIsBulkUploadModalOpen: (open: boolean) => void;
  bulkUploadTargetClassId: string | null;
  setBulkUploadTargetClassId: (classId: string | null) => void;
  openBulkUploadModal: (targetClassId?: string) => void;
  
  isParentLoginModalOpen: boolean;
  setIsParentLoginModalOpen: (open: boolean) => void;
  openParentLoginModal: () => void;
  
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalTab: 'admin' | 'parent' | 'super_admin';
  openAuthModal: (tab?: 'admin' | 'parent' | 'super_admin') => void;

  // AI Chatbot
  isChatbotOpen: boolean;
  setIsChatbotOpen: (open: boolean) => void;
  initialChatbotPrompt: string | null;
  openChatbot: (prompt?: string) => void;
  closeChatbot: () => void;
  
  // Actions
  updateAttendanceRecord: (studentId: string, classId: string, status: AttendanceStatus, remarks?: string) => void;
  batchMarkAttendance: (classId: string, status: AttendanceStatus) => void;
  dispatchSMSAlert: (alert: Omit<SMSAlert, 'id' | 'timestamp' | 'deliveredAt'>) => Promise<SMSAlert>;
  dispatchAbsenteeSMSForClass: (classId: string) => number;
  addStudent: (student: Omit<Student, 'id' | 'attendanceRate' | 'totalPresent' | 'totalAbsent' | 'totalLate'>) => void;
  bulkAddStudents: (studentsData: Array<Omit<Student, 'id' | 'attendanceRate' | 'totalPresent' | 'totalAbsent' | 'totalLate'>>, targetClassId: string) => number;
  addClass: (classData: Omit<ClassRoom, 'id' | 'studentCount' | 'attendanceTakenToday' | 'attendanceRateToday'>) => ClassRoom;
  updateStudent: (student: Student) => void;
  updateSettings: (newSettings: Partial<SchoolSettings>) => void;
  
  // Toast
  toasts: ToastNotification[];
  addToast: (toast: Omit<ToastNotification, 'id'>) => void;
  removeToast: (id: string) => void;

  // SaaS Subscription, Invoices & Billing
  billingCycle: BillingCycle;
  setBillingCycle: (cycle: BillingCycle) => void;
  invoices: SaaSInvoice[];
  allInvoices: SaaSInvoice[];
  paymentMethod: string;
  updatePaymentMethod: (method: string) => void;
  upgradePlan: (newPlan: SaaSSubscriptionPlan, cycle?: BillingCycle) => void;
  purchaseSMSPack: (packId: string) => void;
  
  // SaaS School Registration & Free Trial Onboarding Modal
  isRegisterModalOpen: boolean;
  setIsRegisterModalOpen: (open: boolean) => void;
  openRegisterModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-29');
  
  // Multi-Tenancy State with migration for demo school
  const [schools, setSchools] = useState<SchoolTenant[]>(() => {
    const saved = localStorage.getItem('saas_schools');
    if (saved) {
      try {
        const parsed: SchoolTenant[] = JSON.parse(saved);
        const hasOakwood = parsed.some((s) => s.id === 'school-oakwood' || s.name.toLowerCase().includes('oakwood'));
        const hasDemo = parsed.some((s) => s.id === 'school-demo');
        if (hasOakwood || !hasDemo) {
          const migrated = parsed.map((s) => {
            if (s.id === 'school-oakwood' || s.name.toLowerCase().includes('oakwood')) {
              return {
                ...s,
                id: 'school-demo',
                name: 'Demo School',
                code: 'DEMO-101',
                adminEmail: 'admin@demoschool.edu',
                smsSenderId: 'DEMO-ALRT',
              };
            }
            return s;
          });
          if (!migrated.some((s) => s.id === 'school-demo')) {
            migrated.unshift(INITIAL_SCHOOLS[0]);
          }
          localStorage.setItem('saas_schools', JSON.stringify(migrated));
          return migrated;
        }
        return parsed;
      } catch {
        return INITIAL_SCHOOLS;
      }
    }
    return INITIAL_SCHOOLS;
  });

  const [activeSchoolId, setActiveSchoolId] = useState<string>(() => {
    const saved = localStorage.getItem('saas_active_school_id');
    if (!saved || saved === 'school-oakwood') {
      localStorage.setItem('saas_active_school_id', 'school-demo');
      return 'school-demo';
    }
    return saved;
  });

  // Tenant Users Management State
  const [allTenantUsers, setAllTenantUsers] = useState<TenantUser[]>(() => {
    const saved = localStorage.getItem('saas_tenant_users');
    if (saved) {
      try {
        const parsed: TenantUser[] = JSON.parse(saved);
        const hasOakwood = parsed.some((u) => u.schoolId === 'school-oakwood');
        if (hasOakwood) {
          const migrated = parsed.map((u) => (u.schoolId === 'school-oakwood' ? { ...u, schoolId: 'school-demo' } : u));
          localStorage.setItem('saas_tenant_users', JSON.stringify(migrated));
          return migrated;
        }
        return parsed;
      } catch {
        return INITIAL_TENANT_USERS;
      }
    }
    return INITIAL_TENANT_USERS;
  });

  const [currentTenantUserId, setCurrentTenantUserId] = useState<string | null>(() => {
    return localStorage.getItem('saas_current_tenant_user_id') || null;
  });

  // User Authentication & Roles
  const [userRole, setUserRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('saas_user_role');
    return (saved === 'parent' || saved === 'super_admin' || saved === 'admin') ? saved : 'admin';
  });

  const [parentSession, setParentSession] = useState<ParentSession | null>(() => {
    const saved = localStorage.getItem('oa_parent_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedChildIdForParent, setSelectedChildIdForParent] = useState<string | null>(() => {
    const saved = localStorage.getItem('oa_selected_child_id');
    return saved || null;
  });

  const [parentExcuseSubmissions, setParentExcuseSubmissions] = useState<ParentExcuseSubmission[]>(() => {
    const saved = localStorage.getItem('oa_parent_excuses');
    if (saved) {
      try {
        const parsed: ParentExcuseSubmission[] = JSON.parse(saved);
        const migrated = parsed.map((e) => (e.schoolId === 'school-oakwood' ? { ...e, schoolId: 'school-demo' } : e));
        return migrated;
      } catch {
        return INITIAL_PARENT_EXCUSES;
      }
    }
    return INITIAL_PARENT_EXCUSES;
  });
  
  const [allStudents, setAllStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('oa_students');
    if (saved) {
      try {
        const parsed: Student[] = JSON.parse(saved);
        const hasOakwood = parsed.some((s) => s.schoolId === 'school-oakwood');
        if (hasOakwood) {
          const migrated = parsed.map((s) => (s.schoolId === 'school-oakwood' ? { ...s, schoolId: 'school-demo' } : s));
          localStorage.setItem('oa_students', JSON.stringify(migrated));
          return migrated;
        }
        return parsed;
      } catch {
        return INITIAL_STUDENTS;
      }
    }
    return INITIAL_STUDENTS;
  });

  const [allClasses, setAllClasses] = useState<ClassRoom[]>(() => {
    const saved = localStorage.getItem('oa_classes');
    if (saved) {
      try {
        const parsed: ClassRoom[] = JSON.parse(saved);
        const hasOakwood = parsed.some((c) => c.schoolId === 'school-oakwood');
        if (hasOakwood) {
          const migrated = parsed.map((c) => (c.schoolId === 'school-oakwood' ? { ...c, schoolId: 'school-demo' } : c));
          localStorage.setItem('oa_classes', JSON.stringify(migrated));
          return migrated;
        }
        return parsed;
      } catch {
        return INITIAL_CLASSES;
      }
    }
    return INITIAL_CLASSES;
  });

  const [allAttendanceRecords, setAllAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('oa_attendance');
    if (saved) {
      try {
        const parsed: AttendanceRecord[] = JSON.parse(saved);
        const hasOakwood = parsed.some((a) => a.schoolId === 'school-oakwood');
        if (hasOakwood) {
          const migrated = parsed.map((a) => (a.schoolId === 'school-oakwood' ? { ...a, schoolId: 'school-demo' } : a));
          localStorage.setItem('oa_attendance', JSON.stringify(migrated));
          return migrated;
        }
        return parsed;
      } catch {
        return INITIAL_ATTENDANCE;
      }
    }
    return INITIAL_ATTENDANCE;
  });

  const [allSMSAlerts, setAllSMSAlerts] = useState<SMSAlert[]>(() => {
    const saved = localStorage.getItem('oa_sms');
    if (saved) {
      try {
        const parsed: SMSAlert[] = JSON.parse(saved);
        const hasOakwood = parsed.some((s) => s.schoolId === 'school-oakwood');
        if (hasOakwood) {
          const migrated = parsed.map((s) => (s.schoolId === 'school-oakwood' ? { ...s, schoolId: 'school-demo' } : s));
          localStorage.setItem('oa_sms', JSON.stringify(migrated));
          return migrated;
        }
        return parsed;
      } catch {
        return INITIAL_SMS_ALERTS;
      }
    }
    return INITIAL_SMS_ALERTS;
  });

  // Current School resolution
  const currentSchool = useMemo(() => {
    return schools.find((s) => s.id === activeSchoolId) || schools[0] || INITIAL_SCHOOLS[0];
  }, [schools, activeSchoolId]);

  // Active class selector
  const [selectedClassId, setSelectedClassId] = useState<string>('cls-9a');

  // When activeSchool changes, select its first class
  useEffect(() => {
    const schoolClasses = allClasses.filter((c) => (c.schoolId || 'school-demo') === activeSchoolId);
    if (schoolClasses.length > 0) {
      setSelectedClassId(schoolClasses[0].id);
    }
  }, [activeSchoolId]);

  // Filtered lists for the active school
  const students = useMemo(() => {
    return allStudents.filter((s) => (s.schoolId || 'school-demo') === activeSchoolId);
  }, [allStudents, activeSchoolId]);

  const classes = useMemo(() => {
    return allClasses.filter((c) => (c.schoolId || 'school-demo') === activeSchoolId);
  }, [allClasses, activeSchoolId]);

  const attendanceRecords = useMemo(() => {
    return allAttendanceRecords.filter((a) => (a.schoolId || 'school-demo') === activeSchoolId);
  }, [allAttendanceRecords, activeSchoolId]);

  const smsAlerts = useMemo(() => {
    return allSMSAlerts.filter((s) => (s.schoolId || 'school-demo') === activeSchoolId);
  }, [allSMSAlerts, activeSchoolId]);

  const activeParentExcuses = useMemo(() => {
    return parentExcuseSubmissions.filter((e) => (e.schoolId || 'school-demo') === activeSchoolId);
  }, [parentExcuseSubmissions, activeSchoolId]);

  const tenantUsers = useMemo(() => {
    return allTenantUsers.filter((u) => u.schoolId === activeSchoolId);
  }, [allTenantUsers, activeSchoolId]);

  // Active Tenant User representation
  const currentTenantUser: TenantUser = useMemo(() => {
    if (currentTenantUserId) {
      const found = allTenantUsers.find((u) => u.id === currentTenantUserId);
      if (found && found.schoolId === activeSchoolId) {
        return found;
      }
    }
    // Default to the first admin/principal user of this active school, or fallback to school admin info
    const primaryAdmin = tenantUsers.find((u) => u.role === 'admin' || u.role === 'principal');
    if (primaryAdmin) {
      return primaryAdmin;
    }
    return {
      id: `admin-${currentSchool.id}`,
      schoolId: currentSchool.id,
      name: currentSchool.adminName,
      email: currentSchool.adminEmail,
      role: 'admin',
      designation: currentSchool.adminRole || 'Principal & Administrator',
      status: 'active',
      createdAt: currentSchool.createdAt,
    };
  }, [currentTenantUserId, allTenantUsers, activeSchoolId, tenantUsers, currentSchool]);

  useEffect(() => {
    if (currentTenantUserId) {
      localStorage.setItem('saas_current_tenant_user_id', currentTenantUserId);
    } else {
      localStorage.removeItem('saas_current_tenant_user_id');
    }
  }, [currentTenantUserId]);

  // Derived settings for active school
  const settings: SchoolSettings = useMemo(() => {
    return {
      schoolName: currentSchool.name,
      portalName: 'Admin Portal',
      schoolCode: currentSchool.code,
      academicYear: currentSchool.academicYear,
      logoUrl: currentSchool.logoUrl,
      adminName: currentSchool.adminName,
      adminRole: currentSchool.adminRole,
      adminAvatar: currentSchool.adminAvatar,
      adminEmail: currentSchool.adminEmail,
      autoDispatchAbsenteeSMS: currentSchool.autoDispatchAbsenteeSMS,
      attendanceCutoffTime: currentSchool.attendanceCutoffTime,
      smsSenderId: currentSchool.smsSenderId,
      smsGatewayStatus: 'connected',
      remainingSMSCredits: currentSchool.remainingSMSCredits,
    };
  }, [currentSchool]);

  // Modals & Drawers state
  const [isSMSModalOpen, setIsSMSModalOpen] = useState(false);
  const [smsModalConfig, setSmsModalConfig] = useState<SMSModalRecipientConfig | null>(null);
  const [selectedStudentForDrawer, setSelectedStudentForDrawer] = useState<Student | null>(null);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isCreateClassModalOpen, setIsCreateClassModalOpen] = useState(false);
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
  const [bulkUploadTargetClassId, setBulkUploadTargetClassId] = useState<string | null>(null);
  const [isParentLoginModalOpen, setIsParentLoginModalOpen] = useState(false);
  
  // Unified Auth Modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'admin' | 'parent' | 'super_admin'>('admin');

  // AI Chatbot state
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [initialChatbotPrompt, setInitialChatbotPrompt] = useState<string | null>(null);

  const openChatbot = (prompt?: string) => {
    if (prompt) {
      setInitialChatbotPrompt(prompt);
    }
    setIsChatbotOpen(true);
  };

  const closeChatbot = () => {
    setIsChatbotOpen(false);
    setInitialChatbotPrompt(null);
  };

  const openAuthModal = (tab: 'admin' | 'parent' | 'super_admin' = 'admin') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const openBulkUploadModal = (targetClassId?: string) => {
    if (targetClassId) {
      setBulkUploadTargetClassId(targetClassId);
    } else if (classes.length > 0) {
      setBulkUploadTargetClassId(classes[0].id);
    }
    setIsBulkUploadModalOpen(true);
  };

  const openParentLoginModal = () => {
    openAuthModal('parent');
  };

  // Toast system
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = (toast: Omit<ToastNotification, 'id'>) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem('saas_schools', JSON.stringify(schools));
  }, [schools]);

  useEffect(() => {
    localStorage.setItem('saas_active_school_id', activeSchoolId);
  }, [activeSchoolId]);

  useEffect(() => {
    localStorage.setItem('saas_user_role', userRole);
  }, [userRole]);

  useEffect(() => {
    if (parentSession) {
      localStorage.setItem('oa_parent_session', JSON.stringify(parentSession));
    } else {
      localStorage.removeItem('oa_parent_session');
    }
  }, [parentSession]);

  useEffect(() => {
    if (selectedChildIdForParent) {
      localStorage.setItem('oa_selected_child_id', selectedChildIdForParent);
    } else {
      localStorage.removeItem('oa_selected_child_id');
    }
  }, [selectedChildIdForParent]);

  useEffect(() => {
    localStorage.setItem('oa_students', JSON.stringify(allStudents));
  }, [allStudents]);

  useEffect(() => {
    localStorage.setItem('oa_classes', JSON.stringify(allClasses));
  }, [allClasses]);

  useEffect(() => {
    localStorage.setItem('oa_attendance', JSON.stringify(allAttendanceRecords));
  }, [allAttendanceRecords]);

  useEffect(() => {
    localStorage.setItem('oa_sms', JSON.stringify(allSMSAlerts));
  }, [allSMSAlerts]);

  useEffect(() => {
    localStorage.setItem('oa_parent_excuses', JSON.stringify(parentExcuseSubmissions));
  }, [parentExcuseSubmissions]);

  useEffect(() => {
    localStorage.setItem('saas_tenant_users', JSON.stringify(allTenantUsers));
  }, [allTenantUsers]);

  // Switch Active School
  const switchActiveSchool = (schoolId: string) => {
    const target = schools.find((s) => s.id === schoolId);
    if (!target) return;
    setActiveSchoolId(schoolId);
    setUserRole('admin');
    setParentSession(null);
    setSelectedChildIdForParent(null);
    setCurrentTenantUserId(null);
    addToast({
      title: 'School Workspace Loaded',
      message: `Active institution switched to ${target.name} (${target.code}).`,
      type: 'info',
    });
  };

  // Switch Active User within current school
  const switchTenantUser = (userId: string) => {
    const user = allTenantUsers.find((u) => u.id === userId);
    if (!user) return;
    if (user.schoolId !== activeSchoolId) {
      setActiveSchoolId(user.schoolId);
    }
    setCurrentTenantUserId(user.id);
    if (user.role === 'guardian' && user.phone) {
      loginAsParent(user.phone);
    } else {
      setUserRole('admin');
      setParentSession(null);
      setSelectedChildIdForParent(null);
      addToast({
        title: `Switched User: ${user.name}`,
        message: `Now acting as ${user.name} (${user.role.toUpperCase()}) for ${schools.find((s) => s.id === user.schoolId)?.name || 'institution'}.`,
        type: 'info',
      });
    }
  };

  // Impersonate / Test login as a specific tenant user
  const impersonateTenantUser = (user: TenantUser) => {
    setActiveSchoolId(user.schoolId);
    setCurrentTenantUserId(user.id);
    if (user.role === 'guardian' && user.phone) {
      loginAsParent(user.phone);
    } else {
      setUserRole('admin');
      setParentSession(null);
      setSelectedChildIdForParent(null);
      setIsAuthModalOpen(false);
      setIsParentLoginModalOpen(false);
      addToast({
        title: `Session Active: ${user.name}`,
        message: `Logged in as ${user.name} (${user.designation || user.role}) in ${schools.find((s) => s.id === user.schoolId)?.name || 'School'}.`,
        type: 'success',
      });
    }
  };

  // Tenant User CRUD Methods (Platform Agent & Tenant Admins)
  const createTenantUser = (userData: Omit<TenantUser, 'id' | 'createdAt'>): TenantUser => {
    const newId = `usr-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const newUser: TenantUser = {
      ...userData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
      status: userData.status || 'active',
    };

    setAllTenantUsers((prev) => [newUser, ...prev]);

    addToast({
      title: 'User Account Created',
      message: `${newUser.name} assigned as ${newUser.role} in ${schools.find(s => s.id === newUser.schoolId)?.name || 'tenant'}.`,
      type: 'success',
    });

    return newUser;
  };

  const updateTenantUser = (userId: string, updates: Partial<TenantUser>) => {
    setAllTenantUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...updates } : u))
    );
    addToast({
      title: 'User Profile Updated',
      message: 'Account details and access privileges updated.',
      type: 'success',
    });
  };

  const deleteTenantUser = (userId: string) => {
    const user = allTenantUsers.find((u) => u.id === userId);
    setAllTenantUsers((prev) => prev.filter((u) => u.id !== userId));
    addToast({
      title: 'User Account Removed',
      message: `${user?.name || 'User'} has been removed from this tenant.`,
      type: 'info',
    });
  };

  // Super Admin: Create new client school
  const createSchoolTenant = (newSchoolData: Omit<SchoolTenant, 'id' | 'createdAt'>): SchoolTenant => {
    const newId = `school-${Date.now().toString(36)}`;
    const newSchool: SchoolTenant = {
      ...newSchoolData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
      remainingSMSCredits: newSchoolData.remainingSMSCredits || 5000,
    };

    // Create a starter homeroom class for this school
    const starterClass: ClassRoom = {
      id: `cls-${newId}-starter`,
      schoolId: newId,
      name: `${newSchool.name} - Form 1 (Primary)`,
      grade: 'Grade 1',
      teacher: newSchool.adminName,
      teacherEmail: newSchool.adminEmail,
      room: 'Room 101',
      studentCount: 0,
      scheduleTime: '08:30 AM - 02:30 PM',
      attendanceTakenToday: false,
      attendanceRateToday: 100,
    };

    // Also automatically create the primary administrator user for this new tenant
    const initialAdminUser: TenantUser = {
      id: `usr-${newId}-admin`,
      schoolId: newId,
      name: newSchool.adminName,
      email: newSchool.adminEmail,
      role: 'admin',
      designation: newSchool.adminRole || 'Principal & Administrator',
      password: newSchool.adminPassword || 'demo1234',
      phone: '+1 (555) 000-1122',
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setSchools((prev) => [...prev, newSchool]);
    setAllClasses((prev) => [starterClass, ...prev]);
    setAllTenantUsers((prev) => [initialAdminUser, ...prev]);

    addToast({
      title: 'School Tenant Provisioned',
      message: `Tenant workspace created for ${newSchool.name}. Admin login: ${newSchool.adminEmail}`,
      type: 'success',
    });

    return newSchool;
  };

  // Super Admin: Update existing school
  const updateSchoolTenant = (schoolId: string, updates: Partial<SchoolTenant>) => {
    setSchools((prev) =>
      prev.map((s) => (s.id === schoolId ? { ...s, ...updates } : s))
    );
    addToast({
      title: 'School Updated',
      message: 'Institution profile and subscription updated.',
      type: 'success',
    });
  };

  // Super Admin: Delete school
  const deleteSchoolTenant = (schoolId: string) => {
    if (schools.length <= 1) {
      addToast({
        title: 'Cannot Delete',
        message: 'Platform must retain at least one primary institution.',
        type: 'error',
      });
      return;
    }

    setSchools((prev) => prev.filter((s) => s.id !== schoolId));
    setAllClasses((prev) => prev.filter((c) => c.schoolId !== schoolId));
    setAllStudents((prev) => prev.filter((s) => s.schoolId !== schoolId));
    setAllAttendanceRecords((prev) => prev.filter((a) => a.schoolId !== schoolId));
    setAllSMSAlerts((prev) => prev.filter((s) => s.schoolId !== schoolId));
    setAllTenantUsers((prev) => prev.filter((u) => u.schoolId !== schoolId));

    if (activeSchoolId === schoolId) {
      const remaining = schools.filter((s) => s.id !== schoolId);
      setActiveSchoolId(remaining[0].id);
    }

    addToast({
      title: 'School Removed',
      message: 'School tenant and associated records purged.',
      type: 'info',
    });
  };

  // Login as School Admin
  const loginAsSchoolAdmin = (email: string, password?: string, schoolCode?: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    
    // Check if user is in allTenantUsers or school adminEmail
    const tenantUserMatch = allTenantUsers.find((u) => u.email.toLowerCase() === trimmedEmail && (u.role === 'admin' || u.role === 'principal' || u.role === 'teacher' || u.role === 'staff'));
    
    // Find school by email, school code, or matched tenant user
    const matchedSchool = schools.find((s) => {
      if (tenantUserMatch && s.id === tenantUserMatch.schoolId) return true;
      const emailMatches = s.adminEmail.toLowerCase() === trimmedEmail;
      const codeMatches = schoolCode ? s.code.toLowerCase() === schoolCode.trim().toLowerCase() : false;
      return emailMatches || codeMatches;
    });

    if (!matchedSchool) {
      return {
        success: false,
        message: 'No school account or user registered under this email or institution code.',
      };
    }

    // Check password if provided
    if (password && matchedSchool.adminPassword && password !== matchedSchool.adminPassword && password !== 'admin123') {
      return {
        success: false,
        message: 'Incorrect administrator password for this school account.',
      };
    }

    setActiveSchoolId(matchedSchool.id);
    setCurrentTenantUserId(tenantUserMatch ? tenantUserMatch.id : null);
    setUserRole('admin');
    setParentSession(null);
    setSelectedChildIdForParent(null);
    setIsAuthModalOpen(false);
    setIsParentLoginModalOpen(false);

    const userName = tenantUserMatch ? tenantUserMatch.name : matchedSchool.adminName;
    addToast({
      title: `Welcome, ${userName}`,
      message: `Logged in for ${matchedSchool.name}.`,
      type: 'success',
    });

    return {
      success: true,
      message: 'Authentication successful',
      school: matchedSchool,
    };
  };

  // Login as Super Admin
  const loginAsSuperAdmin = (passcode?: string) => {
    setUserRole('super_admin');
    setParentSession(null);
    setSelectedChildIdForParent(null);
    setIsAuthModalOpen(false);
    setIsParentLoginModalOpen(false);

    addToast({
      title: 'Super Admin Control Center',
      message: 'Logged in as Master SaaS Platform Owner. Full multi-tenant provisioning enabled.',
      type: 'success',
    });

    return {
      success: true,
      message: 'Super Admin access granted',
    };
  };

  const openSMSModal = (config?: SMSModalRecipientConfig) => {
    setSmsModalConfig(config || null);
    setIsSMSModalOpen(true);
  };

  const closeSMSModal = () => {
    setIsSMSModalOpen(false);
    setSmsModalConfig(null);
  };

  // Attendance update handler
  const updateAttendanceRecord = (
    studentId: string,
    classId: string,
    status: AttendanceStatus,
    remarks?: string
  ) => {
    const targetStudent = allStudents.find((s) => s.id === studentId);
    const targetClass = allClasses.find((c) => c.id === classId);
    const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    setAllAttendanceRecords((prev) => {
      const existingIdx = prev.findIndex(
        (r) => r.studentId === studentId && r.classId === classId && r.date === selectedDate
      );

      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          status,
          remarks: remarks !== undefined ? remarks : updated[existingIdx].remarks,
          timeRecorded: currentTime,
        };
        return updated;
      } else {
        const newRecord: AttendanceRecord = {
          id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          schoolId: activeSchoolId,
          date: selectedDate,
          studentId,
          studentName: targetStudent?.name || 'Student',
          classId,
          className: targetClass?.name || 'Class',
          status,
          timeRecorded: currentTime,
          recordedBy: currentSchool.adminName,
          remarks: remarks || '',
          notifiedGuardian: false,
          smsStatus: 'not_sent',
        };
        return [newRecord, ...prev];
      }
    });

    // Update class attendance flag
    setAllClasses((prev) =>
      prev.map((c) => (c.id === classId ? { ...c, attendanceTakenToday: true } : c))
    );
  };

  // Batch Mark Attendance
  const batchMarkAttendance = (classId: string, status: AttendanceStatus) => {
    const classStudents = allStudents.filter((s) => s.classId === classId);
    const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const targetClass = allClasses.find((c) => c.id === classId);

    setAllAttendanceRecords((prev) => {
      const recordsMap = new Map<string, AttendanceRecord>(
        prev
          .filter((r) => r.date === selectedDate && r.classId === classId)
          .map((r) => [r.studentId, r])
      );

      const updatedOrCreated: AttendanceRecord[] = classStudents.map((student) => {
        const existing = recordsMap.get(student.id);
        if (existing) {
          return {
            ...existing,
            status,
            timeRecorded: currentTime,
          };
        }
        return {
          id: `att-${Date.now()}-${student.id}`,
          schoolId: activeSchoolId,
          date: selectedDate,
          studentId: student.id,
          studentName: student.name,
          classId,
          className: targetClass?.name || 'Class',
          status,
          timeRecorded: currentTime,
          recordedBy: currentSchool.adminName,
          remarks: '',
          notifiedGuardian: false,
          smsStatus: 'not_sent',
        };
      });

      // Keep records from other classes/dates
      const otherRecords = prev.filter(
        (r) => !(r.date === selectedDate && r.classId === classId)
      );

      return [...updatedOrCreated, ...otherRecords];
    });

    setAllClasses((prev) =>
      prev.map((c) => (c.id === classId ? { ...c, attendanceTakenToday: true } : c))
    );

    addToast({
      title: 'Roll Call Recorded',
      message: `All ${classStudents.length} scholars marked as ${status.toUpperCase()} in ${targetClass?.name || 'Section'}.`,
      type: 'success',
    });
  };

  // Dispatch SMS Alert
  const dispatchSMSAlert = async (
    alertData: Omit<SMSAlert, 'id' | 'timestamp' | 'deliveredAt'>
  ): Promise<SMSAlert> => {
    const newAlert: SMSAlert = {
      ...alertData,
      id: `sms-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      schoolId: activeSchoolId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      deliveredAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    setAllSMSAlerts((prev) => [newAlert, ...prev]);

    // Deduct credits from current school
    setSchools((prev) =>
      prev.map((s) =>
        s.id === activeSchoolId
          ? { ...s, remainingSMSCredits: Math.max(0, s.remainingSMSCredits - (alertData.creditsUsed || 1)) }
          : s
      )
    );

    // If tied to attendance, update record
    if (alertData.studentId) {
      setAllAttendanceRecords((prev) =>
        prev.map((r) =>
          r.studentId === alertData.studentId && r.date === selectedDate
            ? { ...r, notifiedGuardian: true, smsStatus: 'sent', smsId: newAlert.id }
            : r
        )
      );
    }

    return newAlert;
  };

  // Dispatch Absentee SMS for entire class
  const dispatchAbsenteeSMSForClass = (classId: string): number => {
    const absentRecords = allAttendanceRecords.filter(
      (r) => r.classId === classId && r.date === selectedDate && r.status === 'absent' && r.smsStatus !== 'sent'
    );

    if (absentRecords.length === 0) {
      addToast({
        title: 'No Pending Absentees',
        message: 'All recorded absentees have already received SMS alerts.',
        type: 'info',
      });
      return 0;
    }

    absentRecords.forEach((record) => {
      const student = allStudents.find((s) => s.id === record.studentId);
      if (student) {
        const msg = `${currentSchool.name} Alert: ${student.name} was recorded ABSENT today (${selectedDate}) from ${record.className}. Please contact main office.`;
        dispatchSMSAlert({
          recipientName: student.guardianName,
          recipientPhone: student.guardianPhone,
          studentId: student.id,
          studentName: student.name,
          className: record.className,
          category: 'attendance_absence',
          message: msg,
          status: 'sent',
          creditsUsed: 1,
        });
      }
    });

    addToast({
      title: 'SMS Broadcast Sent',
      message: `Dispatched ${absentRecords.length} automated absence SMS notifications to guardians.`,
      type: 'success',
    });

    return absentRecords.length;
  };

  // Add new class
  const addClass = (
    classData: Omit<ClassRoom, 'id' | 'studentCount' | 'attendanceTakenToday' | 'attendanceRateToday'>
  ): ClassRoom => {
    const slug = classData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 8);
    const newClass: ClassRoom = {
      ...classData,
      id: `cls-${slug}-${Date.now().toString(36).slice(-4)}`,
      schoolId: activeSchoolId,
      studentCount: 0,
      attendanceTakenToday: false,
      attendanceRateToday: 100,
    };

    setAllClasses((prev) => [newClass, ...prev]);

    addToast({
      title: 'Academic Section Created',
      message: `${newClass.name} assigned to ${newClass.teacher} in ${newClass.room}.`,
      type: 'success',
    });

    return newClass;
  };

  const AVATAR_POOL = [
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
  ];

  // Bulk add students to a class
  const bulkAddStudents = (
    studentsData: Array<Omit<Student, 'id' | 'attendanceRate' | 'totalPresent' | 'totalAbsent' | 'totalLate'>>,
    targetClassId: string
  ): number => {
    if (!studentsData.length) return 0;

    const targetClass = allClasses.find((c) => c.id === targetClassId);
    const targetClassName = targetClass ? targetClass.name : 'Assigned Class';
    const targetGrade = targetClass ? targetClass.grade : 'Grade 9';

    const newStudentObjects: Student[] = studentsData.map((item, index) => {
      const randomAvatar = AVATAR_POOL[(Date.now() + index) % AVATAR_POOL.length];
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const studentNumber = item.studentNumber && item.studentNumber.trim() !== ''
        ? item.studentNumber
        : `${currentSchool.code}-${new Date().getFullYear()}-${randomNum}`;

      return {
        ...item,
        id: `stu-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 6)}`,
        schoolId: activeSchoolId,
        studentNumber,
        avatar: item.avatar || randomAvatar,
        classId: targetClassId,
        className: targetClassName,
        grade: item.grade || targetGrade,
        attendanceRate: 100,
        totalPresent: 1,
        totalAbsent: 0,
        totalLate: 0,
        status: item.status || 'active',
      };
    });

    setAllStudents((prev) => [...newStudentObjects, ...prev]);

    // Update target class studentCount
    setAllClasses((prev) =>
      prev.map((c) =>
        c.id === targetClassId
          ? { ...c, studentCount: c.studentCount + newStudentObjects.length }
          : c
      )
    );

    addToast({
      title: 'Bulk Roster Imported',
      message: `Successfully enrolled ${newStudentObjects.length} scholars into ${targetClassName}.`,
      type: 'success',
    });

    return newStudentObjects.length;
  };

  // Add new student
  const addStudent = (studentData: Omit<Student, 'id' | 'attendanceRate' | 'totalPresent' | 'totalAbsent' | 'totalLate'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `stu-${Date.now()}`,
      schoolId: activeSchoolId,
      attendanceRate: 100,
      totalPresent: 1,
      totalAbsent: 0,
      totalLate: 0,
    };

    setAllStudents((prev) => [newStudent, ...prev]);
    
    // Update class count
    setAllClasses((prev) =>
      prev.map((c) => (c.id === newStudent.classId ? { ...c, studentCount: c.studentCount + 1 } : c))
    );

    addToast({
      title: 'Student Enrolled',
      message: `${newStudent.name} has been enrolled in ${newStudent.className}.`,
      type: 'success',
    });
  };

  // Update existing student
  const updateStudent = (updatedStudent: Student) => {
    setAllStudents((prev) => prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));
    if (selectedStudentForDrawer?.id === updatedStudent.id) {
      setSelectedStudentForDrawer(updatedStudent);
    }
    addToast({
      title: 'Student Updated',
      message: `Records for ${updatedStudent.name} were successfully saved.`,
      type: 'success',
    });
  };

  // Parent Login via registered phone number
  const loginAsParent = (phoneInput: string) => {
    const rawDigits = normalizePhone(phoneInput);
    if (!rawDigits || rawDigits.length < 7) {
      addToast({
        title: 'Invalid Mobile Number',
        message: 'Please enter a valid registered 10-digit mobile phone number.',
        type: 'error',
      });
      return { success: false, studentCount: 0, message: 'Invalid phone number format.' };
    }

    const matchedChildren = allStudents.filter((s) => 
      matchPhoneNumbers(s.guardianPhone, phoneInput) ||
      matchPhoneNumbers(s.emergencyPhone, phoneInput) ||
      (s.studentPhone && matchPhoneNumbers(s.studentPhone, phoneInput))
    );

    if (matchedChildren.length === 0) {
      addToast({
        title: 'Number Not Registered',
        message: `No active student records found for ${phoneInput}. Please check with the school administration.`,
        type: 'error',
      });
      return { 
        success: false, 
        studentCount: 0, 
        message: 'No student associated with this registered telephone number.' 
      };
    }

    // Set active school to child's school if available
    if (matchedChildren[0].schoolId) {
      setActiveSchoolId(matchedChildren[0].schoolId);
    }

    const session: ParentSession = {
      phone: phoneInput,
      parentName: matchedChildren[0].guardianName || 'Guardian',
      schoolId: matchedChildren[0].schoolId || activeSchoolId,
      studentIds: matchedChildren.map((c) => c.id),
    };

    setParentSession(session);
    setUserRole('parent');
    setSelectedChildIdForParent(matchedChildren[0].id);
    setIsAuthModalOpen(false);
    setIsParentLoginModalOpen(false);

    addToast({
      title: 'Parent Portal Access Granted',
      message: `Welcome, ${session.parentName}. Viewing records for ${matchedChildren.length} registered child(ren).`,
      type: 'success',
    });

    return {
      success: true,
      studentCount: matchedChildren.length,
      message: 'Authenticated successfully',
      parentName: session.parentName,
    };
  };

  // Logout
  const logout = () => {
    setParentSession(null);
    setSelectedChildIdForParent(null);
    setUserRole('admin');
    addToast({
      title: 'Session Ended',
      message: 'You have returned to the School Administrative Portal.',
      type: 'info',
    });
  };

  // Submit Parent Excuse
  const submitParentExcuse = (studentId: string, date: string, reason: string) => {
    const child = allStudents.find((s) => s.id === studentId);
    if (!child) return;

    const newExcuse: ParentExcuseSubmission = {
      id: `excuse-${Date.now()}`,
      schoolId: child.schoolId || activeSchoolId,
      studentId: child.id,
      studentName: child.name,
      date,
      reason: reason.trim(),
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      parentPhone: parentSession?.phone || child.guardianPhone,
      status: 'pending',
    };

    setParentExcuseSubmissions((prev) => [newExcuse, ...prev]);

    addToast({
      title: 'Absence Notice Dispatched',
      message: `Formal excuse note submitted to the Academic Dean for ${child.name}.`,
      type: 'success',
    });
  };

  // Update excuse status (Admin action)
  const updateExcuseStatus = (excuseId: string, status: 'acknowledged' | 'approved') => {
    setParentExcuseSubmissions((prev) =>
      prev.map((e) => (e.id === excuseId ? { ...e, status } : e))
    );

    const excuse = parentExcuseSubmissions.find((e) => e.id === excuseId);
    if (excuse && status === 'approved') {
      const child = allStudents.find((s) => s.id === excuse.studentId);
      if (child) {
        updateAttendanceRecord(child.id, child.classId, 'excused', `Parent Excuse Approved: ${excuse.reason}`);
      }
    }

    addToast({
      title: status === 'approved' ? 'Excuse Note Approved' : 'Excuse Acknowledged',
      message: `Status updated for ${excuse?.studentName || 'student'}'s absence note.`,
      type: 'success',
    });
  };

  // SaaS Billing, Invoices & Payment Method State
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [paymentMethod, setPaymentMethod] = useState<string>('Mastercard •••• 5821');
  const [allInvoices, setAllInvoices] = useState<SaaSInvoice[]>(() => {
    const saved = localStorage.getItem('saas_invoices');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_INVOICES;
      }
    }
    return INITIAL_INVOICES;
  });

  useEffect(() => {
    localStorage.setItem('saas_invoices', JSON.stringify(allInvoices));
  }, [allInvoices]);

  const invoices = useMemo(() => {
    return allInvoices.filter((inv) => inv.schoolId === activeSchoolId);
  }, [allInvoices, activeSchoolId]);

  // Self-Service SaaS Registration Modal State
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
  };

  const updatePaymentMethod = (newMethod: string) => {
    setPaymentMethod(newMethod);
    addToast({
      title: 'Payment Method Updated',
      message: `Default card changed to ${newMethod}.`,
      type: 'success',
    });
  };

  // SaaS Plan Upgrade/Downgrade Handler
  const upgradePlan = (newPlan: SaaSSubscriptionPlan, cycle: BillingCycle = billingCycle) => {
    const targetPlan = PLAN_TIERS.find((p) => p.id === newPlan) || PLAN_TIERS[1];
    const price = cycle === 'annual' ? targetPlan.annualPricePerMonth * 12 : targetPlan.monthlyPrice;

    // Update School Tenant
    setSchools((prev) =>
      prev.map((s) => {
        if (s.id === activeSchoolId) {
          return {
            ...s,
            plan: newPlan,
            remainingSMSCredits: s.remainingSMSCredits + targetPlan.includedSMSCredits,
          };
        }
        return s;
      })
    );

    // Create Invoice Record
    const newInvoice: SaaSInvoice = {
      id: `inv-${Date.now().toString(36)}`,
      schoolId: activeSchoolId,
      schoolName: currentSchool.name,
      date: new Date().toISOString().split('T')[0],
      amount: price,
      description: `${targetPlan.name} - ${cycle === 'annual' ? 'Annual (2 Months Free)' : 'Monthly'} Subscription`,
      status: 'paid',
      paymentMethod,
      billingCycle: cycle,
      planName: newPlan,
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setAllInvoices((prev) => [newInvoice, ...prev]);

    addToast({
      title: 'SaaS Plan Upgraded!',
      message: `Successfully switched to ${targetPlan.name} (${cycle}). ${targetPlan.includedSMSCredits.toLocaleString()} SMS credits credited.`,
      type: 'success',
    });
  };

  // Purchase SMS Pack Addon
  const purchaseSMSPack = (packId: string) => {
    const pack = SMS_ADDON_PACKS.find((p) => p.id === packId);
    if (!pack) return;

    setSchools((prev) =>
      prev.map((s) => {
        if (s.id === activeSchoolId) {
          return {
            ...s,
            remainingSMSCredits: s.remainingSMSCredits + pack.credits,
          };
        }
        return s;
      })
    );

    const newInvoice: SaaSInvoice = {
      id: `inv-${Date.now().toString(36)}`,
      schoolId: activeSchoolId,
      schoolName: currentSchool.name,
      date: new Date().toISOString().split('T')[0],
      amount: pack.price,
      description: `SMS Add-on: ${pack.credits.toLocaleString()} Broadcast Credits (${pack.name})`,
      status: 'paid',
      paymentMethod,
      billingCycle,
      planName: currentSchool.plan,
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setAllInvoices((prev) => [newInvoice, ...prev]);

    addToast({
      title: 'SMS Credits Added!',
      message: `Added ${pack.credits.toLocaleString()} broadcast credits to ${currentSchool.name}. Balance: ${(currentSchool.remainingSMSCredits + pack.credits).toLocaleString()} SMS.`,
      type: 'success',
    });
  };

  // Update settings for current school
  const updateSettings = (newSettings: Partial<SchoolSettings>) => {
    setSchools((prev) =>
      prev.map((s) => {
        if (s.id === activeSchoolId) {
          return {
            ...s,
            name: newSettings.schoolName || s.name,
            code: newSettings.schoolCode || s.code,
            academicYear: newSettings.academicYear || s.academicYear,
            logoUrl: newSettings.logoUrl || s.logoUrl,
            adminName: newSettings.adminName || s.adminName,
            adminRole: newSettings.adminRole || s.adminRole,
            adminEmail: newSettings.adminEmail || s.adminEmail,
            smsSenderId: newSettings.smsSenderId || s.smsSenderId,
            attendanceCutoffTime: newSettings.attendanceCutoffTime || s.attendanceCutoffTime,
            autoDispatchAbsenteeSMS: newSettings.autoDispatchAbsenteeSMS !== undefined ? newSettings.autoDispatchAbsenteeSMS : s.autoDispatchAbsenteeSMS,
          };
        }
        return s;
      })
    );

    addToast({
      title: 'Settings Saved',
      message: 'Portal configuration and school details updated.',
      type: 'success',
    });
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedDate,
        setSelectedDate,
        selectedClassId,
        setSelectedClassId,
        
        schools,
        activeSchoolId,
        currentSchool,
        switchActiveSchool,
        createSchoolTenant,
        updateSchoolTenant,
        deleteSchoolTenant,
        
        allTenantUsers,
        tenantUsers,
        currentTenantUser,
        switchTenantUser,
        impersonateTenantUser,
        createTenantUser,
        updateTenantUser,
        deleteTenantUser,
        
        userRole,
        setUserRole,
        parentSession,
        selectedChildIdForParent,
        setSelectedChildIdForParent,
        loginAsParent,
        loginAsSchoolAdmin,
        loginAsSuperAdmin,
        logout,
        
        parentExcuseSubmissions: activeParentExcuses,
        submitParentExcuse,
        updateExcuseStatus,
        students,
        classes,
        attendanceRecords,
        smsAlerts,
        settings,
        
        allStudents,
        allClasses,
        allAttendanceRecords,
        allSMSAlerts,
        
        isSMSModalOpen,
        smsModalConfig,
        openSMSModal,
        closeSMSModal,
        selectedStudentForDrawer,
        setSelectedStudentForDrawer,
        isAddStudentModalOpen,
        setIsAddStudentModalOpen,
        isCreateClassModalOpen,
        setIsCreateClassModalOpen,
        isBulkUploadModalOpen,
        setIsBulkUploadModalOpen,
        bulkUploadTargetClassId,
        setBulkUploadTargetClassId,
        openBulkUploadModal,
        isParentLoginModalOpen,
        setIsParentLoginModalOpen,
        openParentLoginModal,
        
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        openAuthModal,
        
        isChatbotOpen,
        setIsChatbotOpen,
        initialChatbotPrompt,
        openChatbot,
        closeChatbot,
        
        updateAttendanceRecord,
        batchMarkAttendance,
        dispatchSMSAlert,
        dispatchAbsenteeSMSForClass,
        addStudent,
        bulkAddStudents,
        addClass,
        updateStudent,
        updateSettings,
        toasts,
        addToast,
        removeToast,

        // SaaS Billing, Invoices & Subscriptions
        billingCycle,
        setBillingCycle,
        invoices,
        allInvoices,
        paymentMethod,
        updatePaymentMethod,
        upgradePlan,
        purchaseSMSPack,

        // SaaS Onboarding Modal
        isRegisterModalOpen,
        setIsRegisterModalOpen,
        openRegisterModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
