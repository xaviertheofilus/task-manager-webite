import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTasks } from '@/context/TaskContext';
import { Layout } from '@/components/layout';
import { Badge, Loading, Modal, Button } from '@/components/common';
import { Task } from '../../types/task';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  Edit,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import {
  formatDate,
  formatDateTime,
  getRelativeTime,
  isOverdue,
} from '@/lib/utils';
import {
  PRIORITY_COLORS,
  PRIORITY_ICONS,
  PRIORITY_LABELS,
  STATUS_COLORS,
  STATUS_LABELS,
} from '@/lib/constants';

export default function TaskDetailPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { getTaskById, updateTask, deleteTask } = useTasks();
  const router = useRouter();
  const { id } = router.query;
  const [task, setTask] = useState<Task | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (id && typeof id === 'string') {
      const foundTask = getTaskById(id);
      setTask(foundTask);
    }
  }, [id, getTaskById]);

  if (authLoading || !isAuthenticated) {
    return <Loading fullScreen text="Loading..." timeout={5000} onTimeout={() => router.push('/login')} />;
  }

  if (!task) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Task Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The task you're looking for doesn't exist or has been deleted.
          </p>
          <Link href="/">
            <Button variant="primary">Back to Dashboard</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleDelete = async () => {
    setIsDeleting(true);
    const success = await deleteTask(task.id);
    setIsDeleting(false);
    if (success) {
      router.push('/');
    }
  };

  const handleStatusChange = async (newStatus: 'todo' | 'in-progress' | 'completed') => {
    await updateTask({ id: task.id, status: newStatus });
    setTask({ ...task, status: newStatus });
  };

  const overdueTask = isOverdue(task.dueDate) && task.status !== 'completed';

  return (
    <>
      <Head>
        <title>{task.title} - WPH Task Manager</title>
        <meta name="description" content={task.description} />
      </Head>

      <Layout>
        {/* Task Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{PRIORITY_ICONS[task.priority]}</span>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {task.title}
                    </h1>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge
                      variant={
                        task.status === 'completed'
                          ? 'success'
                          : task.status === 'in-progress'
                          ? 'primary'
                          : 'gray'
                      }
                      className={STATUS_COLORS[task.status]}
                    >
                      {STATUS_LABELS[task.status]}
                    </Badge>
                    <Badge
                      variant={
                        task.priority === 'high'
                          ? 'danger'
                          : task.priority === 'medium'
                          ? 'warning'
                          : 'gray'
                      }
                      className={PRIORITY_COLORS[task.priority]}
                    >
                      {PRIORITY_LABELS[task.priority]} Priority
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Link href={`/tasks/edit/${task.id}`}>
                    <button
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Task"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                  </Link>
                  <button
                    onClick={() => setDeleteModalOpen(true)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Task"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Description */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Description
                </h2>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {task.description}
                </p>
              </div>

              {/* Meta Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {task.dueDate && (
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        overdueTask ? 'bg-red-100' : 'bg-blue-100'
                      }`}
                    >
                      <Calendar
                        className={`w-5 h-5 ${
                          overdueTask ? 'text-red-600' : 'text-blue-600'
                        }`}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Due Date
                      </p>
                      <p
                        className={`text-base font-semibold ${
                          overdueTask ? 'text-red-600' : 'text-gray-900'
                        }`}
                      >
                        {formatDate(task.dueDate)}
                        {overdueTask && ' (Overdue)'}
                      </p>
                    </div>
                  </div>
                )}

                {task.estimatedTime && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Estimated Time
                      </p>
                      <p className="text-base font-semibold text-gray-900">
                        {task.estimatedTime}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Created</p>
                    <p className="text-base font-semibold text-gray-900">
                      {formatDateTime(task.createdAt)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {getRelativeTime(task.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Last Updated
                    </p>
                    <p className="text-base font-semibold text-gray-900">
                      {formatDateTime(task.updatedAt)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {getRelativeTime(task.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {task.tags && task.tags.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    Tags
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full bg-blue-50 text-blue-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Suggestions */}
              {task.aiSuggestions && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h2 className="text-lg font-semibold text-purple-900 mb-3">
                    🤖 AI Suggestions
                  </h2>
                  {task.aiSuggestions.reasoning && (
                    <p className="text-sm text-purple-700 italic mb-3">
                      {task.aiSuggestions.reasoning}
                    </p>
                  )}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-purple-600 font-medium">
                        Suggested Priority:
                      </span>
                      <span className="ml-2 text-purple-900">
                        {task.aiSuggestions.suggestedPriority?.toUpperCase()}
                      </span>
                    </div>
                    {task.aiSuggestions.estimatedTime && (
                      <div>
                        <span className="text-purple-600 font-medium">
                          Estimated Time:
                        </span>
                        <span className="ml-2 text-purple-900">
                          {task.aiSuggestions.estimatedTime}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Quick Actions
                </h2>
                <div className="flex flex-wrap gap-2">
                  {task.status !== 'todo' && (
                    <button
                      onClick={() => handleStatusChange('todo')}
                      className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      Mark as To Do
                    </button>
                  )}
                  {task.status !== 'in-progress' && (
                    <button
                      onClick={() => handleStatusChange('in-progress')}
                      className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                    >
                      Mark as In Progress
                    </button>
                  )}
                  {task.status !== 'completed' && (
                    <button
                      onClick={() => handleStatusChange('completed')}
                      className="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Mark as Completed
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Delete Task"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to delete "<strong>{task.title}</strong>"?
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                onClick={() => setDeleteModalOpen(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                variant="danger"
                isLoading={isDeleting}
              >
                Delete Task
              </Button>
            </div>
          </div>
        </Modal>
      </Layout>
    </>
  );
}

// Server-side function to demonstrate Next.js SSR capability
export async function getServerSideProps(context: any) {
  const { id } = context.params;
  
  // This demonstrates server-side rendering
  // In a real app, you might fetch task data from a database here
  return {
    props: {
      taskId: id,
      timestamp: new Date().toISOString(),
    },
  };
}
