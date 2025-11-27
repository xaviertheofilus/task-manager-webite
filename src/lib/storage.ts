import { Task } from '../types/task';

const STORAGE_KEYS = {
  TASKS: 'wph_tasks_data',
  USER: 'wph_user_data',
  AUTH_SESSION: 'wph_auth_session',
  PREFERENCES: 'wph_user_preferences',
} as const;

// Generic storage functions
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    if (typeof window === 'undefined') return defaultValue || null;
    
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return defaultValue || null;
    }
  },

  set: <T>(key: string, value: T): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error);
      return false;
    }
  },

  remove: (key: string): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error);
      return false;
    }
  },

  clear: (): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },
};

// Task-specific storage functions
export const taskStorage = {
  getAllTasks: (): Task[] => {
    return storage.get<Task[]>(STORAGE_KEYS.TASKS, []) || [];
  },

  saveTasks: (tasks: Task[]): boolean => {
    return storage.set(STORAGE_KEYS.TASKS, tasks);
  },

  getTaskById: (id: string): Task | null => {
    const tasks = taskStorage.getAllTasks();
    return tasks.find(task => task.id === id) || null;
  },

  addTask: (task: Task): boolean => {
    const tasks = taskStorage.getAllTasks();
    tasks.push(task);
    return taskStorage.saveTasks(tasks);
  },

  updateTask: (id: string, updates: Partial<Task>): boolean => {
    const tasks = taskStorage.getAllTasks();
    const index = tasks.findIndex(task => task.id === id);
    
    if (index === -1) return false;
    
    tasks[index] = {
      ...tasks[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    return taskStorage.saveTasks(tasks);
  },

  deleteTask: (id: string): boolean => {
    const tasks = taskStorage.getAllTasks();
    const filteredTasks = tasks.filter(task => task.id !== id);
    return taskStorage.saveTasks(filteredTasks);
  },

  getTasksByStatus: (status: Task['status']): Task[] => {
    const tasks = taskStorage.getAllTasks();
    return tasks.filter(task => task.status === status);
  },

  getTasksByPriority: (priority: Task['priority']): Task[] => {
    const tasks = taskStorage.getAllTasks();
    return tasks.filter(task => task.priority === priority);
  },

  searchTasks: (query: string): Task[] => {
    const tasks = taskStorage.getAllTasks();
    const lowerQuery = query.toLowerCase();
    
    return tasks.filter(task =>
      task.title.toLowerCase().includes(lowerQuery) ||
      task.description.toLowerCase().includes(lowerQuery) ||
      task.tags.some((tag: string) => tag.toLowerCase().includes(lowerQuery))
    );
  },

  getTaskStats: () => {
    const tasks = taskStorage.getAllTasks();
    const now = new Date();
    
    return {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < now && t.status !== 'completed').length,
    };
  },
};

export { STORAGE_KEYS };
