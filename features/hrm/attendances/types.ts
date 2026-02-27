export type AttendanceStatus = 'present' | 'late';

export interface User {
  id: number;
  name: string;
}

export interface Employee {
  id: number;
  name: string;
}

export interface Attendance {
  id: number;
  employee_id: number;
  user?: User;
  employee?: Employee;
  date: string;
  checkin: string;
  checkout: string | null;
  status: AttendanceStatus;
  note: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface AttendanceFormBody {
  employee_ids: number[];
  date: string;
  checkin: string;
  checkout?: string | null;
  note?: string | null;
}

export type AttendanceListParams = {
  page?: number;
  per_page?: number;
  search?: string;
  status?: AttendanceStatus;
  employee_id?: number;
  start_date?: string;
  end_date?: string;
};

export type AttendanceExportParams = {
  ids?: number[];
  format: "excel" | "pdf";
  method: "download" | "email";
  columns: string[];
  user_id?: number;
  start_date?: string;
  end_date?: string;
};