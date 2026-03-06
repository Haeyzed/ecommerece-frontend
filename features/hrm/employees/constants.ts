import {
  type ActiveStatus,
  type SalesAgentStatus,
} from './types'

export const statusTypes = new Map<ActiveStatus, string>([
  ['active', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['inactive', 'bg-neutral-300/40 border-neutral-300'],
])

export const salesAgentTypes = new Map<SalesAgentStatus, string>([
  [
    'yes',
    'bg-indigo-100/30 text-indigo-900 dark:text-indigo-200 border-indigo-200',
  ],
  [
    'no',
    'bg-neutral-100/30 text-neutral-900 dark:text-neutral-200 border-neutral-200',
  ],
])

export const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
]

export const maritalStatusOptions = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' },
]
