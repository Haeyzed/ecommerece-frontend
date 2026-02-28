export interface PayrollRun {
  id: number;
  month: string;
  year: number;
  status: string;
  generated_by: number | null;
  generated_by_user?: { id: number; name: string } | null;
  entries_count?: number;
  entries?: PayrollEntry[];
  created_at: string | null;
  updated_at: string | null;
}

export interface PayrollEntry {
  id: number;
  payroll_run_id: number;
  employee_id: number;
  gross_salary: number;
  total_deductions: number;
  net_salary: number;
  status: string;
  employee?: { id: number; name: string; employee_code: string | null };
  created_at: string | null;
  updated_at: string | null;
}

export interface PayrollRunOption {
  value: number;
  label: string;
}

export type PayrollRunListParams = {
  page?: number;
  per_page?: number;
  status?: string;
  year?: number;
  month?: string;
};
