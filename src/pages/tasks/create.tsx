import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import { useTasks } from '@/context/TaskContext';
import { Layout } from '@/components/layout';
import { TaskForm } from '@/components/tasks/TaskForm';
import { Loading } from '@/components/common';
import { CreateTaskInput } from '../../types/task';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateTaskPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { createTask } = useTasks();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || !isAuthenticated) {
    return <Loading fullScreen text="Loading..." timeout={5000} onTimeout={() => router.push('/login')} />;
  }

  const handleSubmit = async (data: CreateTaskInput) => {
    setIsSubmitting(true);
    try {
      const task = await createTask(data);
      if (task) {
        router.push('/');
      }
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create New Task - WPH Task Manager</title>
        <meta name="description" content="Create a new task" />
      </Head>

      <Layout>
        <div>
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Create New Task
            </h1>
            <p className="text-gray-600">
              Add a new task to your list and let AI help you organize it
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <TaskForm onSubmit={handleSubmit} isLoading={isSubmitting} />
          </div>
        </div>
      </Layout>
    </>
  );
}
