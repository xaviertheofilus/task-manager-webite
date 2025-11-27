import React from 'react';
import { Task } from '../../types/task';
import { TaskCard } from './TaskCard';
import { FileX } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onDelete?: (id: string) => void;
  emptyMessage?: string;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onDelete,
  emptyMessage = 'No tasks found',
}) => {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileX className="w-16 h-16 text-gray-300 mb-4" />
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onDelete={onDelete} />
      ))}
    </div>
  );
};
