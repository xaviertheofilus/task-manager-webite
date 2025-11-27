import type { AppProps } from 'next/app';
import { AuthProvider } from '@/context/AuthContext';
import { TaskProvider } from '@/context/TaskContext';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <TaskProvider>
        <Component {...pageProps} />
      </TaskProvider>
    </AuthProvider>
  );
}
