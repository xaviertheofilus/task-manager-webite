export type Priority = 'high' | 'medium' | 'low';
export type Status = 'todo' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  dueDate: string | null;
  tags: string[];
  estimatedTime: string | null;
  aiSuggestions: AISuggestions | null;
  createdAt: string;
  updatedAt: string;
}

export interface AISuggestions {
  suggestedPriority: Priority;
  estimatedTime: string;
  tags: string[];
  deadline: string;
  reasoning: string;
}

export interface TaskFilters {
  status?: Status;
  priority?: Priority;
  search?: string;
  tags?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  completed: number;
  overdue: number;
}

export interface CreateTaskInput {
  title: string;
  description: string;
  priority?: Priority;
  status?: Status;
  dueDate?: string;
  tags?: string[];
  estimatedTime?: string;
  aiSuggestions?: AISuggestions;
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  id: string;
}
