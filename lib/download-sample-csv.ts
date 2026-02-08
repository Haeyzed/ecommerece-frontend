/**
 * Utility to download sample import data as CSV files.
 *
 * @module lib/download-sample-csv
 */

/**
 * Downloads sample data as .csv file.
 *
 * @param csvString - CSV content (headers + rows)
 * @param filename - Download filename (e.g. 'brands_sample.csv')
 */
export function downloadSampleAsCsv(
  csvString: string,
  filename: string
): void {
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`
  a.click()
  window.URL.revokeObjectURL(url)
}
