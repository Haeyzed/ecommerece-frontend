/**
 * Utility to download sample import data as .xlsx files.
 * Uses the xlsx library for proper Excel format - works better on mobile
 * than CSV blob approach (correct MIME type, no encoding issues).
 *
 * @module lib/download-sample-xlsx
 */

import * as XLSX from 'xlsx'

/**
 * Parses a simple CSV string (no quoted commas) into array of arrays.
 */
function parseCsvToArray(csv: string): string[][] {
  return csv
    .trim()
    .split('\n')
    .map((line) => line.split(',').map((cell) => cell.trim()))
}

/**
 * Downloads sample data as .xlsx file using the xlsx library.
 * Works better on mobile than CSV blob approach.
 *
 * @param csvString - CSV content (headers + rows)
 * @param filename - Download filename (e.g. 'brands_sample.xlsx')
 */
export function downloadSampleAsXlsx(
  csvString: string,
  filename: string
): void {
  const rows = parseCsvToArray(csvString)
  const ws = XLSX.utils.aoa_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
  const finalFilename = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`
  XLSX.writeFile(wb, finalFilename)
}
