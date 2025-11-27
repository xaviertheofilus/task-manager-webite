import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout';
import { useTasks } from '@/context/TaskContext';
import { TaskCard } from '@/components/tasks/TaskCard';
import { Button } from '@/components/common/Button';
import { Plus } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

const TasksPage: React.FC = () => {
  const router = useRouter();
  const { tasks, deleteTask } = useTasks();

  // Group tasks by status for display
  const groupedTasks = useMemo(() => {
    return {
      'todo': tasks.filter(t => t.status === 'todo'),
      'in-progress': tasks.filter(t => t.status === 'in-progress'),
      'done': tasks.filter(t => t.status === 'completed'),
    };
  }, [tasks]);

  const filteredTasks = tasks;

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(taskId);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Tasks - {APP_NAME}</title>
      </Head>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Tasks</h1>
            <p className="text-gray-600 mt-1">
              {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'} found
            </p>
          </div>
          <Button onClick={() => router.push('/tasks/create')}>
            <Plus className="w-4 h-4 mr-2" />
            Create Task
          </Button>
        </div>



        {/* Tasks Display */}
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-600 mb-6">
              Get started by creating your first task
            </p>
            <Button onClick={() => router.push('/tasks/create')}>
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* To Do Column */}
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <h3 className="font-semibold text-gray-900">
                    To Do ({groupedTasks['todo'].length})
                  </h3>
                </div>
                {groupedTasks['todo'].length === 0 ? (
                  <div className="bg-white rounded-lg p-4 text-center text-sm text-gray-600">
                    No tasks
                  </div>
                ) : (
                  <div className="space-y-3">
                    {groupedTasks['todo'].map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onDelete={() => handleDeleteTask(task.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* In Progress Column */}
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <h3 className="font-semibold text-gray-900">
                    In Progress ({groupedTasks['in-progress'].length})
                  </h3>
                </div>
                {groupedTasks['in-progress'].length === 0 ? (
                  <div className="bg-white rounded-lg p-4 text-center text-sm text-gray-600">
                    No tasks
                  </div>
                ) : (
                  <div className="space-y-3">
                    {groupedTasks['in-progress'].map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onDelete={() => handleDeleteTask(task.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Done Column */}
            <div className="space-y-4">
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <h3 className="font-semibold text-gray-900">
                    Done ({groupedTasks['done'].length})
                  </h3>
                </div>
                {groupedTasks['done'].length === 0 ? (
                  <div className="bg-white rounded-lg p-4 text-center text-sm text-gray-600">
                    No tasks
                  </div>
                ) : (
                  <div className="space-y-3">
                    {groupedTasks['done'].map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onDelete={() => handleDeleteTask(task.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TasksPage;
