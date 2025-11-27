export const APP_NAME = 'Task Manager';
export const APP_VERSION = '1.0.0';

export const STORAGE_KEYS = {
  TASKS: 'wph_tasks_data',
  USER: 'wph_user_data',
  AUTH_SESSION: 'wph_auth_session',
  PREFERENCES: 'wph_user_preferences',
} as const;

export const PRIORITY_LABELS = {
  high: 'High Priority',
  medium: 'Medium Priority',
  low: 'Low Priority',
} as const;

export const PRIORITY_COLORS = {
  high: 'bg-red-100 text-red-800 border-red-300',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  low: 'bg-gray-100 text-gray-800 border-gray-300',
} as const;

export const STATUS_LABELS = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  completed: 'Completed',
} as const;

export const STATUS_COLORS = {
  todo: 'bg-slate-100 text-slate-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
} as const;

export const STATUS_ICONS = {
  todo: '📝',
  'in-progress': '🔄',
  completed: '✅',
} as const;

export const PRIORITY_ICONS = {
  high: '🔴',
  medium: '🟡',
  low: '⚪',
} as const;

export const DATE_FORMAT = 'MMM dd, yyyy';
export const DATETIME_FORMAT = 'MMM dd, yyyy HH:mm';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  TASKS: '/tasks',
  CREATE_TASK: '/tasks/create',
  TASK_DETAIL: (id: string) => `/tasks/${id}`,
  EDIT_TASK: (id: string) => `/tasks/edit/${id}`,
  INSIGHTS: '/insights',
} as const;

export const API_ROUTES = {
  AUTH_LOGIN: '/api/auth/login',
  AUTH_LOGOUT: '/api/auth/logout',
  TASKS: '/api/tasks',
  TASK_BY_ID: (id: string) => `/api/tasks/${id}`,
  AI_ANALYZE: '/api/ai/analyze',
  AI_INSIGHTS: '/api/ai/insights',
} as const;
