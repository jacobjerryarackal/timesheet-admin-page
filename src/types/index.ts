export interface UserType {
  id: string;
  key: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user' | 'supervisor' | 'auditor';
  department: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  lastLogin: string;
  hoursThisWeek: number;
  avatar?: string;
  jobTitle?: string;
  phone?: string;
  startDate?: string;
  manager?: string;
  description?: string;
  notes?: string;
}

export interface TimeEntry {
  id: string;
  userId: string;
  date: Date;
  hours: number;
  type: 'work' | 'leave' | 'birthday' | 'meeting' | 'other';
  project?: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
}

export interface Timesheet {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  weekStart: Date;
  weekEnd: Date;
  totalHours: number;
  targetHours?: number;
  project?: string;
  department?: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  submittedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  notes?: string;
  entries: TimeEntry[];
}

export interface DashboardStats {
  totalHours: number;
  totalUsers: number;
  pendingTimesheets: number;
  approvedTimesheets: number;
  averageCompliance: number;
  overtimeHours: number;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  leaveType: 'vacation' | 'sick' | 'personal' | 'birthday' | 'other';
  startDate: string;
  endDate: string;
  totalDays: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  submittedDate: string;
  reason: string;
  approvedBy?: string;
  approvedDate?: string;
  notes?: string;
}

export interface ReportData {
  userId: string;
  userName: string;
  totalHours: number;
  overtime: number;
  leaveHours: number;
  meetingHours: number;
  compliance: number;
  projects: number;
  department: string;
  role: string;
}