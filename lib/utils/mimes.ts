export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const CSV_MIME_TYPES = [
  "text/csv",
  "application/vnd.ms-excel",
  "application/csv",
  "text/x-csv",
  "application/x-csv",
  "text/comma-separated-values",
  "text/x-comma-separated-values",
];

export const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

export const DOCUMENT_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

export const SPREADSHEET_MIME_TYPES = [
  ...CSV_MIME_TYPES,
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
];

export const ARCHIVE_MIME_TYPES = [
  "application/zip",
  "application/x-zip-compressed",
  "application/x-rar-compressed",
  "application/x-7z-compressed",
];

// A catch-all if you ever need to allow "anything common"
export const ALL_ACCEPTED_MIME_TYPES = [
  ...IMAGE_MIME_TYPES,
  ...DOCUMENT_MIME_TYPES,
  ...SPREADSHEET_MIME_TYPES,
  ...ARCHIVE_MIME_TYPES,
];