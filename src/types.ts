export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export type SMSStatus = 'sent' | 'pending' | 'failed' | 'not_sent';

export type SMSCategory = 'attendance_absence' | 'attendance_late' | 'general_announcement' | 'emergency' | 'academic';

export type UserRole = 'super_admin' | 'admin' | 'parent';

export type TenantUserRole = 'admin' | 'principal' | 'teacher' | 'staff' | 'guardian';

export interface TenantUser {
  id: string;
  schoolId: string;
  name: string;
  email: string;
  phone?: string;
  role: TenantUserRole;
  designation?: string;
  avatar?: string;
  password?: string;
  status: 'active' | 'inactive' | 'pending';
  assignedClassIds?: string[];
  assignedClassName?: string;
  linkedStudentIds?: string[];
  createdAt: string;
  lastLogin?: string;
}

export interface SchoolTenant {
  id: string;
  name: string;
  code: string; // e.g. OAK-101
  academicYear: string;
  logoUrl: string;
  adminName: string;
  adminRole: string;
  adminEmail: string;
  adminPassword?: string; // Initial/managed password for school admin login
  adminAvatar: string;
  plan: 'Starter' | 'Pro Academy' | 'Enterprise Multi-Campus';
  status: 'active' | 'trial' | 'suspended';
  remainingSMSCredits: number;
  smsSenderId: string;
  autoDispatchAbsenteeSMS: boolean;
  attendanceCutoffTime: string;
  createdAt: string;
  phone?: string;
  address?: string;
}

export interface Student {
  id: string;
  schoolId?: string; // Tenant identifier
  studentNumber: string;
  name: string;
  avatar: string;
  grade: string;
  classId: string;
  className: string;
  studentPhone?: string; // Registered student mobile number
  guardianName: string;
  guardianRelationship: string;
  guardianPhone: string;
  guardianEmail: string;
  emergencyContact: string;
  emergencyPhone: string;
  attendanceRate: number;
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  status: 'active' | 'probation' | 'inactive';
  medicalNotes?: string;
  notes?: string;
}

export interface ParentSession {
  phone: string; // The mobile number logged in with
  parentName?: string;
  schoolId?: string;
  studentIds: string[]; // Children associated with this mobile number
}

export interface ParentExcuseSubmission {
  id: string;
  schoolId?: string;
  studentId: string;
  studentName: string;
  date: string;
  reason: string;
  submittedAt: string;
  parentPhone: string;
  status: 'pending' | 'acknowledged' | 'approved';
}

export interface ClassRoom {
  id: string;
  schoolId?: string;
  name: string;
  grade: string;
  teacher: string;
  teacherEmail: string;
  room: string;
  studentCount: number;
  scheduleTime: string;
  attendanceTakenToday: boolean;
  attendanceRateToday: number;
}

export interface AttendanceRecord {
  id: string;
  schoolId?: string;
  date: string; // YYYY-MM-DD
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  status: AttendanceStatus;
  timeRecorded: string;
  recordedBy: string;
  remarks: string;
  notifiedGuardian: boolean;
  smsStatus: SMSStatus;
  smsId?: string;
}

export interface SMSAlert {
  id: string;
  schoolId?: string;
  timestamp: string;
  recipientName: string;
  recipientPhone: string;
  studentId?: string;
  studentName?: string;
  className?: string;
  category: SMSCategory;
  message: string;
  status: SMSStatus;
  deliveredAt?: string;
  failureReason?: string;
  creditsUsed: number;
}

export interface SchoolSettings {
  schoolName: string;
  portalName: string;
  schoolCode: string;
  academicYear: string;
  logoUrl: string;
  adminName: string;
  adminRole: string;
  adminAvatar: string;
  adminEmail: string;
  autoDispatchAbsenteeSMS: boolean;
  attendanceCutoffTime: string;
  smsSenderId: string;
  smsGatewayStatus: 'connected' | 'degraded' | 'offline';
  remainingSMSCredits: number;
}

export type SaaSSubscriptionPlan = 'Starter' | 'Pro Academy' | 'Enterprise Multi-Campus';
export type BillingCycle = 'monthly' | 'annual';

export interface PlanTierConfig {
  id: SaaSSubscriptionPlan;
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualPricePerMonth: number;
  maxStudents: number;
  includedSMSCredits: number;
  features: string[];
  popular?: boolean;
  badge?: string;
}

export interface SaaSInvoice {
  id: string;
  schoolId: string;
  schoolName?: string;
  date: string;
  amount: number;
  description: string;
  status: 'paid' | 'pending' | 'refunded';
  paymentMethod: string;
  billingCycle: BillingCycle;
  planName: SaaSSubscriptionPlan;
  invoiceNumber: string;
  pdfDownloadUrl?: string;
}

export interface SMSAddOnPack {
  id: string;
  name: string;
  credits: number;
  price: number;
  pricePerSMS: string;
  popular?: boolean;
  savings?: string;
}

