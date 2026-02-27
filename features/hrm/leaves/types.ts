export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveType {
  id: number;
  name: string;
}

export interface Employee {
  id: number;
  name: string;
}

export interface Leave {
  id: number;
  employee_id: number;
  employee?: Employee;
  leave_type_id: number;
  leave_type?: LeaveType;
  start_date: string;
  end_date: string;
  days: number;
  status: LeaveStatus;
  approver_id: number | null;
  approver_name: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export type LeaveFormBody = {
  employee_id: number;
  leave_type_id: number;
  start_date: string;
  end_date: string;
  status?: LeaveStatus;
}

export type LeaveListParams = {
  page?: number;
  per_page?: number;
  search?: string;
  status?: LeaveStatus;
  employee_id?: number;
  leave_type_id?: number;
  start_date?: string;
  end_date?: string;
};

export type LeaveExportParams = {
  ids?: number[];
  format: "excel" | "pdf";
  method: "download" | "email";
  columns: string[];
  user_id?: number;
  start_date?: string;
  end_date?: string;
};
