import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import Head from 'next/head';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Button, Input } from '@/components/common';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    // Timeout protection - force reset loading after 5 seconds
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    try {
      const success = await login(email, password);
      clearTimeout(timeoutId);
      
      if (success) {
        toast.success('Login successful!');
        // Small delay to ensure state is updated before navigation
        setTimeout(() => {
          setIsLoading(false);
          router.push('/');
        }, 100);
      } else {
        setIsLoading(false);
        toast.error('Login failed. Please try again.');
      }
    } catch (error) {
      clearTimeout(timeoutId);
      setIsLoading(false);
      toast.error('An error occurred during login');
    }
  };

  const handleDemoCredentials = () => {
    setEmail('demo@example.com');
    setPassword('demo123');
    setErrors({});
  };

  return (
    <>
      <Head>
        <title>Login - Task Manager</title>
        <meta name="description" content="Login to manage your tasks" />
      </Head>

      <div className="min-h-screen flex">
        {/* Left Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="flex items-center mb-8">
              <Image
                src="/logo.png"
                alt="Task Manager Logo"
                width={48}
                height={48}
                className="rounded-lg"
                priority
              />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">Task Manager</h1>
            </div>

            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600">
                Sign in to manage your tasks efficiently
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({ ...errors, email: undefined });
                  }}
                  placeholder="you@example.com"
                  error={errors.email}
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors({ ...errors, password: undefined });
                    }}
                    placeholder="Enter your password"
                    error={errors.password}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Demo Credentials Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleDemoCredentials}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Use Demo Credentials
                </button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                className="w-full"
              >
                Sign In
              </Button>
            </form>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <Image
            src="/login-bg.png"
            alt="Task Management"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
        </div>
      </div>
    </>
  );
}
