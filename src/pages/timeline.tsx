import React, { useMemo, useEffect } from 'react';
import Head from 'next/head';
import { Layout } from '@/components/layout';
import { useTasks } from '@/context/TaskContext';
import { Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import { initializeStorage, STORAGE_KEYS } from '@/lib/database';
import type { Task } from '@/types';
import type { GetServerSideProps } from 'next';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

interface TimelinePageProps {
  initialTaskCount?: number;
}

const TimelinePage: React.FC<TimelinePageProps> = ({ initialTaskCount }) => {
  const { tasks } = useTasks();

  useEffect(() => {
    initializeStorage();
  }, []);

  // Calculate timeline statistics from tasks
  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
    const upcomingTasks = tasks.filter(t => t.status === 'todo').length;

    return {
      total: totalTasks,
      completed: completedTasks,
      inProgress: inProgressTasks,
      upcoming: upcomingTasks,
    };
  }, [tasks]);

  // Prepare data for task priority distribution
  const priorityData = useMemo(() => {
    const high = tasks.filter(t => t.priority === 'high').length;
    const medium = tasks.filter(t => t.priority === 'medium').length;
    const low = tasks.filter(t => t.priority === 'low').length;

    return [
      { name: 'High Priority', count: high },
      { name: 'Medium Priority', count: medium },
      { name: 'Low Priority', count: low },
    ];
  }, [tasks]);

  // Task completion trend by month
  const completionTrendData = useMemo(() => {
    const monthlyData: { [key: string]: number } = {};
    
    tasks.filter(t => t.status === 'completed').forEach(task => {
      const month = new Date(task.updatedAt).toLocaleDateString('en-US', { 
        month: 'short',
        year: 'numeric'
      });
      monthlyData[month] = (monthlyData[month] || 0) + 1;
    });

    return Object.entries(monthlyData).map(([month, count]) => ({
      month,
      completed: count,
    }));
  }, [tasks]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'todo':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'todo':
        return 'To Do';
      default:
        return status;
    }
  };

  return (
    <>
      <Head>
        <title>Timeline - {APP_NAME}</title>
      </Head>

      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Task Timeline</h1>
            <p className="text-gray-600 mt-1">
              Overview of task progress and distribution
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-700 mt-1">{stats.completed}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-700 mt-1">{stats.inProgress}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold text-slate-700 mt-1">{stats.upcoming}</p>
                </div>
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-slate-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Priority Distribution Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Task Priority Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#3b82f6" name="Tasks" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Completion Trend Chart */}
            {completionTrendData.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Completion Trend</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={completionTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="completed" stroke="#10b981" name="Completed Tasks" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Task List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">All Tasks</h2>
            </div>
            <div className="p-6">
              {tasks.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  No tasks available
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{task.title}</h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">{task.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                            {getStatusLabel(task.status)}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            task.priority === 'high' ? 'bg-red-100 text-red-700' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {task.priority.toUpperCase()}
                          </span>
                          {task.dueDate && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

// Server-side function for Next.js SSR requirement
export async function getServerSideProps() {
  // Demonstrates server-side rendering capability
  return {
    props: {
      serverTime: new Date().toISOString(),
    },
  };
}

export default TimelinePage;
