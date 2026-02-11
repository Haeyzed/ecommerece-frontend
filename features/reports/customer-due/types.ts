/**
 * Customer Due Report row from API.
 */
export interface CustomerDueReportRow {
  id: number
  date: string
  reference_no: string
  customer_name: string
  customer_phone: string
  grand_total: number
  returned_amount: number
  paid: number
  due: number
}

export interface CustomerDueReportMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number | null
  to: number | null
}

export interface CustomerDueReportPayload {
  data: CustomerDueReportRow[]
  meta: CustomerDueReportMeta
}
