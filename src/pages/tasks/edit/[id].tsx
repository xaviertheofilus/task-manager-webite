import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import { useTasks } from '@/context/TaskContext';
import { Layout } from '@/components/layout';
import { TaskForm } from '@/components/tasks/TaskForm';
import { Loading } from '@/components/common';
import { CreateTaskInput } from '@/types/task';

export default function EditTaskPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { getTaskById, updateTask } = useTasks();
  const router = useRouter();
  const { id } = router.query;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<CreateTaskInput | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (id && typeof id === 'string') {
      const task = getTaskById(id);
      if (task) {
        setInitialData({
          title: task.title,
          description: task.description,
          priority: task.priority,
          status: task.status,
          dueDate: task.dueDate || undefined,
          tags: task.tags,
          estimatedTime: task.estimatedTime || undefined,
          aiSuggestions: task.aiSuggestions || undefined,
        });
      } else {
        router.push('/tasks');
      }
    }
  }, [id, getTaskById, router]);

  if (authLoading || !isAuthenticated || !initialData) {
    return <Loading fullScreen text="Loading..." timeout={5000} onTimeout={() => router.push('/login')} />;
  }

  const handleSubmit = async (data: CreateTaskInput) => {
    if (typeof id !== 'string') return;
    
    setIsSubmitting(true);
    try {
      await updateTask({ id, ...data });
      router.push(`/tasks/${id}`);
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Edit Task - Task Manager</title>
        <meta name="description" content="Edit task details" />
      </Head>

      <Layout>
        <div>
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Edit Task
            </h1>
            <p className="text-gray-600">
              Update task details and let AI help you organize it
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <TaskForm
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
              initialValues={initialData}
            />
          </div>
        </div>
      </Layout>
    </>
  );
}
