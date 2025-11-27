import React from 'react';
import Link from 'next/link';
import { Task } from '../../types/task';
import { Badge } from '../common/Badge';
import { Calendar, Clock, Tag, Edit, Trash2, Eye } from 'lucide-react';
import { formatDate, getRelativeTime, isOverdue } from '@/lib/utils';
import {
  PRIORITY_COLORS,
  PRIORITY_ICONS,
  STATUS_COLORS,
  STATUS_LABELS,
} from '@/lib/constants';

interface TaskCardProps {
  task: Task;
  onDelete?: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete }) => {
  const overdueTask = isOverdue(task.dueDate) && task.status !== 'completed';

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-5 border border-gray-200 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <Link href={`/tasks/${task.id}`} className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer line-clamp-2 transition-colors">
            {task.title}
          </h3>
        </Link>
        <div className="ml-3 flex items-center gap-1">
          <span className="text-lg">{PRIORITY_ICONS[task.priority]}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {task.description}
      </p>

      {/* Meta Information */}
      <div className="space-y-2 mb-4">
        {task.dueDate && (
          <div
            className={`flex items-center text-sm ${
              overdueTask ? 'text-red-600 font-medium' : 'text-gray-500'
            }`}
          >
            <Calendar className="w-4 h-4 mr-2" />
            <span>
              {overdueTask ? '⚠️ Overdue: ' : 'Due: '}
              {formatDate(task.dueDate)}
            </span>
          </div>
        )}

        {task.estimatedTime && (
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-2" />
            <span>{task.estimatedTime}</span>
          </div>
        )}

        <div className="flex items-center text-xs text-gray-400">
          <span>Created {getRelativeTime(task.createdAt)}</span>
        </div>
      </div>

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {task.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700"
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
              +{task.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        {/* Status & Priority */}
        <div className="flex items-center gap-2">
          <Badge
            variant={task.status === 'completed' ? 'success' : task.status === 'in-progress' ? 'primary' : 'gray'}
            className={STATUS_COLORS[task.status]}
          >
            {STATUS_LABELS[task.status]}
          </Badge>
          <Badge
            variant={task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'gray'}
            className={PRIORITY_COLORS[task.priority]}
          >
            {task.priority.toUpperCase()}
          </Badge>
        </div>

        {/* Actions */}
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link href={`/tasks/${task.id}`}>
            <button
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>
          </Link>
          <Link href={`/tasks/edit/${task.id}`}>
            <button
              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
              title="Edit Task"
            >
              <Edit className="w-4 h-4" />
            </button>
          </Link>
          {onDelete && (
            <button
              onClick={() => onDelete(task.id)}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
