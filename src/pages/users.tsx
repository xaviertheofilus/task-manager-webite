import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Layout } from '@/components/layout';
import { User, Mail, Calendar, CheckCircle2, ListTodo, Plus, Trash2, X } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import { useTasks } from '@/context/TaskContext';
import { userStorage, StoredUser, initializeStorage } from '@/lib/database';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import toast from 'react-hot-toast';

const UsersPage: React.FC = () => {
  const { tasks } = useTasks();
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    role: '',
  });

  // Load users from localStorage
  useEffect(() => {
    initializeStorage();
    loadUsers();
  }, []);

  const loadUsers = () => {
    const allUsers = userStorage.getAll();
    setUsers(allUsers);
  };

  const handleAddUser = () => {
    if (!newUserData.name.trim() || !newUserData.email.trim() || !newUserData.role.trim()) {
      toast.error('Please fill all fields');
      return;
    }

    // Check if email already exists
    const existingUser = users.find(u => u.email.toLowerCase() === newUserData.email.toLowerCase());
    if (existingUser) {
      toast.error('User with this email already exists');
      return;
    }

    const newUser = userStorage.create(newUserData);
    setUsers([...users, newUser]);
    setNewUserData({ name: '', email: '', role: '' });
    setShowAddModal(false);
    toast.success(`${newUser.name} added successfully!`);
  };

  const handleDeleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      userStorage.delete(userId);
      setUsers(users.filter(u => u.id !== userId));
      toast.success('User deleted successfully');
    }
  };

  // Calculate statistics
  const stats = {
    totalUsers: users.length,
    totalTasks: tasks.length,
    totalTasksCompleted: tasks.filter(t => t.status === 'completed').length,
    avgTasksPerUser: users.length > 0 ? Math.round(tasks.length / users.length) : 0,
  };

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get avatar color based on user ID
  const getAvatarColor = (userId: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-yellow-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-teal-500',
    ];
    const index = parseInt(userId) % colors.length;
    return colors[index];
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Layout>
      <Head>
        <title>Users - {APP_NAME}</title>
      </Head>

      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
            <p className="text-gray-600 mt-2">Manage and view all team members</p>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add User
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                <User className="w-7 h-7 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Tasks</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalTasks}</p>
              </div>
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                <ListTodo className="w-7 h-7 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Tasks Completed</p>
                <p className="text-3xl font-bold text-green-600">{stats.totalTasksCompleted}</p>
              </div>
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Avg. Tasks/User</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.avgTasksPerUser}</p>
              </div>
              <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-7 h-7 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Users List */}
        {users.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
            <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <User className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No users yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Get started by adding team members to your workspace. You can assign them to projects and track their progress.
            </p>
            <Button onClick={() => setShowAddModal(true)} className="inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add First User
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map(user => (
              <div
                key={user.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all"
              >
                {/* User Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-16 h-16 ${getAvatarColor(user.id)} rounded-xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0`}>
                    {getInitials(user.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{user.name}</h3>
                    <p className="text-sm text-gray-600 truncate">{user.role}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* User Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span>Joined {formatDate(user.joinedAt)}</span>
                  </div>
                </div>

                {/* Statistics */}
                <div className="border-t border-gray-200 pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <ListTodo className="w-4 h-4" />
                      <span>Total Tasks</span>
                    </div>
                    <span className="text-lg font-semibold text-purple-600">
                      {Math.floor(Math.random() * 10)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Completed Tasks</span>
                    </div>
                    <span className="text-lg font-semibold text-green-600">
                      {Math.floor(Math.random() * 5)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add User Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setNewUserData({ name: '', email: '', role: '' });
          }}
          title="Add New User"
        >
          <div className="space-y-6">
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={newUserData.name}
              onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              value={newUserData.email}
              onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
              required
            />

            <Input
              label="Role / Position"
              placeholder="Frontend Developer"
              value={newUserData.role}
              onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
              required
            />

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleAddUser}
                className="flex-1"
              >
                Add User
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddModal(false);
                  setNewUserData({ name: '', email: '', role: '' });
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default UsersPage;
