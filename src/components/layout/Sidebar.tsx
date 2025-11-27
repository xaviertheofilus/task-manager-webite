import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  Clock,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  User,
  FolderKanban,
  CalendarDays,
} from 'lucide-react';

interface SidebarProps {
  children: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      active: router.pathname === '/',
    },
    {
      name: 'Tasks',
      href: '/tasks',
      icon: CheckSquare,
      active: router.pathname.startsWith('/tasks'),
    },
    {
      name: 'Timeline',
      href: '/timeline',
      icon: CalendarDays,
      active: router.pathname === '/timeline',
    },
    {
      name: 'Users',
      href: '/users',
      icon: Users,
      active: router.pathname === '/users',
    },
    {
      name: 'Insights',
      href: '/insights',
      icon: BarChart3,
      active: router.pathname === '/insights',
    },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header with User Menu */}
      <header className="fixed top-0 left-0 lg:left-64 right-0 z-40 bg-white border-b border-gray-200 h-16">
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          {/* Mobile Menu Button & Logo */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 mr-2"
            >
              {isSidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <Image
              src="/logo.png"
              alt="Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="ml-2 text-lg font-bold text-gray-900">
              Task Manager
            </span>
          </div>

          {/* Desktop: Empty space */}
          <div className="hidden lg:block"></div>

          {/* User Menu - Always on Right */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsUserMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-40">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <Link href="/settings">
                    <div
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-50 border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo - Desktop Only */}
          <div className="hidden lg:flex items-center px-6 h-16 border-b border-gray-200 bg-white">
            <Link href="/">
              <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
                <span className="ml-3 text-xl font-bold text-gray-900">
                  Task Manager
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.name} href={item.href}>
                  <div
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      item.active
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:pl-64 pt-16">
        <div className="min-h-screen">{children}</div>
      </main>
    </div>
  );
};
