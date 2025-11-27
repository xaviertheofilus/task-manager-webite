// Unified localStorage database structure
export interface StoredUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  joinedAt: string;
}

export const STORAGE_KEYS = {
  USERS: 'task_manager_users',
  TASKS: 'task_manager_tasks',
  AUTH: 'task_manager_auth',
} as const;

// User operations
export const userStorage = {
  getAll(): StoredUser[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  getById(id: string): StoredUser | null {
    const users = this.getAll();
    return users.find(u => u.id === id) || null;
  },

  create(user: Omit<StoredUser, 'id' | 'joinedAt'>): StoredUser {
    const users = this.getAll();
    const newUser: StoredUser = {
      ...user,
      id: Date.now().toString(),
      joinedAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return newUser;
  },

  update(id: string, updates: Partial<StoredUser>): StoredUser | null {
    const users = this.getAll();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;
    
    users[index] = { ...users[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return users[index];
  },

  delete(id: string): boolean {
    const users = this.getAll();
    const filtered = users.filter(u => u.id !== id);
    if (filtered.length === users.length) return false;
    
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filtered));
    return true;
  },
};

// Initialize with demo user (manager)
export const initializeStorage = () => {
  if (typeof window === 'undefined') return;
  
  const existingUsers = userStorage.getAll();
  if (existingUsers.length === 0) {
    // Create demo manager user
    userStorage.create({
      name: 'Demo Manager',
      email: 'demo@example.com',
      role: 'Project Manager',
      avatar: undefined,
    });
  }
};
