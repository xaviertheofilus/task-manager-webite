import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, TaskStats, CreateTaskInput, UpdateTaskInput } from '../types/task';
import { taskStorage } from '@/lib/storage';
import toast from 'react-hot-toast';

interface TaskContextType {
  tasks: Task[];
  stats: TaskStats;
  isLoading: boolean;
  createTask: (input: CreateTaskInput) => Promise<Task | null>;
  updateTask: (input: UpdateTaskInput) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;
  getTaskById: (id: string) => Task | null;
  refreshTasks: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    todo: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    updateStats();
  }, [tasks]);

  const loadTasks = () => {
    try {
      const loadedTasks = taskStorage.getAllTasks();
      setTasks(loadedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStats = () => {
    const newStats = taskStorage.getTaskStats();
    setStats(newStats);
  };

  const createTask = async (input: CreateTaskInput): Promise<Task | null> => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      const data = await response.json();

      if (data.success && data.task) {
        taskStorage.addTask(data.task);
        setTasks(taskStorage.getAllTasks());
        toast.success('Task created successfully! 🎉');
        return data.task;
      }

      toast.error('Failed to create task');
      return null;
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('An error occurred while creating task');
      return null;
    }
  };

  const updateTask = async (input: UpdateTaskInput): Promise<boolean> => {
    try {
      const response = await fetch(`/api/tasks/${input.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      const data = await response.json();

      if (data.success) {
        taskStorage.updateTask(input.id, input);
        setTasks(taskStorage.getAllTasks());
        toast.success('Task updated successfully! ✅');
        return true;
      }

      toast.error('Failed to update task');
      return false;
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('An error occurred while updating task');
      return false;
    }
  };

  const deleteTask = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        taskStorage.deleteTask(id);
        setTasks(taskStorage.getAllTasks());
        toast.success('Task deleted successfully! 🗑️');
        return true;
      }

      toast.error('Failed to delete task');
      return false;
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('An error occurred while deleting task');
      return false;
    }
  };

  const getTaskById = (id: string): Task | null => {
    return taskStorage.getTaskById(id);
  };

  const refreshTasks = () => {
    loadTasks();
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        stats,
        isLoading,
        createTask,
        updateTask,
        deleteTask,
        getTaskById,
        refreshTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
