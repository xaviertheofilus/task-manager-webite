import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { useTasks } from '@/context/TaskContext';
import { Layout } from '@/components/layout';
import { TaskList } from '@/components/tasks';
import { Loading } from '@/components/common';
import { Modal } from '@/components/common/Modal';
import Head from 'next/head';
import Link from 'next/link';
import {
  PlusCircle,
  BarChart3,
  CheckCircle2,
  Clock,
  ListTodo,
  AlertCircle,
} from 'lucide-react';

export default function HomePage() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const { tasks, stats, isLoading: tasksLoading, deleteTask } = useTasks();
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || !isAuthenticated) {
    return <Loading fullScreen text="Loading..." timeout={5000} onTimeout={() => router.push('/login')} />;
  }

  const handleDeleteClick = (id: string) => {
    setTaskToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (taskToDelete) {
      await deleteTask(taskToDelete);
      setDeleteModalOpen(false);
      setTaskToDelete(null);
    }
  };

  const todoTasks = tasks.filter((t) => t.status === 'todo');
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  return (
    <>
      <Head>
        <title>Dashboard - Task Manager</title>
        <meta name="description" content="Manage your tasks efficiently" />
      </Head>

      <Layout>
        {/* Welcome Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600">
              Here's an overview of your tasks and productivity
            </p>
          </div>
          <Link href="/tasks/create">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md">
              <PlusCircle className="w-5 h-5" />
              Create Task
            </button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {/* Total Tasks */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.total}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ListTodo className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* To Do */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">To Do</p>
                <p className="text-2xl font-bold text-slate-700 mt-1">
                  {stats.todo}
                </p>
              </div>
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                <ListTodo className="w-6 h-6 text-slate-600" />
              </div>
            </div>
          </div>

          {/* In Progress */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-700 mt-1">
                  {stats.inProgress}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-700 mt-1">
                  {stats.completed}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Overdue */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-700 mt-1">
                  {stats.overdue}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        {tasksLoading ? (
          <Loading text="Loading tasks..." />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* To Do Column */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <ListTodo className="w-5 h-5 text-slate-600" />
                  To Do
                  <span className="text-sm font-normal text-gray-500 bg-white px-2 py-0.5 rounded-full">
                    {todoTasks.length}
                  </span>
                </h2>
              </div>
              <TaskList
                tasks={todoTasks}
                onDelete={handleDeleteClick}
                emptyMessage="No pending tasks"
              />
            </div>

            {/* In Progress Column */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  In Progress
                  <span className="text-sm font-normal text-gray-500 bg-white px-2 py-0.5 rounded-full">
                    {inProgressTasks.length}
                  </span>
                </h2>
              </div>
              <TaskList
                tasks={inProgressTasks}
                onDelete={handleDeleteClick}
                emptyMessage="No tasks in progress"
              />
            </div>

            {/* Completed Column */}
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  Completed
                  <span className="text-sm font-normal text-gray-500 bg-white px-2 py-0.5 rounded-full">
                    {completedTasks.length}
                  </span>
                </h2>
              </div>
              <TaskList
                tasks={completedTasks}
                onDelete={handleDeleteClick}
                emptyMessage="No completed tasks yet"
              />
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Delete Task"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      </Layout>
    </>
  );
}
