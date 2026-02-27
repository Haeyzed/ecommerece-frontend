export type OvertimeStatus = 'pending' | 'approved' | 'rejected';

export interface Employee {
  id: number;
  name: string;
}

export interface Approver {
  id: number;
  name: string;
}

export interface Overtime {
  id: number;
  employee_id: number;
  employee?: Employee;
  date: string;
  hours: number;
  rate: number;
  amount: number;
  status: OvertimeStatus;
  approved_by: number | null;
  approver?: Approver;
  created_at: string | null;
  updated_at: string | null;
}

export interface OvertimeFormBody {
  employee_id: number;
  date: string;
  hours: number;
  rate: number;
  status?: OvertimeStatus;
}

export type OvertimeListParams = {
  page?: number;
  per_page?: number;
  search?: string;
  status?: OvertimeStatus;
  employee_id?: number;
  start_date?: string;
  end_date?: string;
};

export type OvertimeExportParams = {
  ids?: number[];
  format: "excel" | "pdf";
  method: "download" | "email";
  columns: string[];
  user_id?: number;
  start_date?: string;
  end_date?: string;
};