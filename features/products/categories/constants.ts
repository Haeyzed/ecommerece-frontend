import {
  type CategoryActiveStatus,
  type CategoryFeaturedStatus, 
  type CategorySyncStatus 
} from "./types";

export const statusTypes = new Map<CategoryActiveStatus, string>([
  ['active', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['inactive', 'bg-neutral-300/40 border-neutral-300'],
]);

export const featuredTypes = new Map<CategoryFeaturedStatus, string>([
  ['yes', 'bg-amber-100/30 text-amber-900 dark:text-amber-200 border-amber-200'],
  ['no', 'bg-slate-100/30 text-slate-600 dark:text-slate-400 border-slate-200'],
]);

export const syncTypes = new Map<CategorySyncStatus, string>([
  ['enabled', 'bg-indigo-100/30 text-indigo-900 dark:text-indigo-200 border-indigo-200'],
  ['disabled', 'bg-rose-100/30 text-rose-900 dark:text-rose-200 border-rose-200'],
]);