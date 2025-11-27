import React, { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Sidebar>
        <div className="min-h-[calc(100vh-64px-80px)] px-6 py-8 lg:px-12 lg:py-10 max-w-[1600px] mx-auto">
          {children}
        </div>
        
        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white py-6 px-6 lg:px-12 mt-12">
          <div className="text-center text-sm text-gray-600">
            © 2025 Task Manager. All rights reserved.
          </div>
        </footer>
      </Sidebar>

      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
};
