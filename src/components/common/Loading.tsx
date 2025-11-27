import React, { useEffect, useState } from 'react';
import { Loader2, X } from 'lucide-react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
  timeout?: number; // Auto-hide after timeout (ms)
  onTimeout?: () => void;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  text,
  fullScreen = false,
  timeout,
  onTimeout,
}) => {
  const [show, setShow] = useState(true);
  const [canDismiss, setCanDismiss] = useState(false);

  useEffect(() => {
    if (fullScreen && timeout) {
      const timer = setTimeout(() => {
        setShow(false);
        onTimeout?.();
      }, timeout);
      return () => clearTimeout(timer);
    }
  }, [fullScreen, timeout, onTimeout]);

  // Allow dismissing after 3 seconds for stuck loading
  useEffect(() => {
    if (fullScreen) {
      const timer = setTimeout(() => {
        setCanDismiss(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [fullScreen]);

  if (!show) return null;
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className={`${sizes[size]} text-blue-600 animate-spin`} />
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div 
        className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50"
        onClick={() => canDismiss && setShow(false)}
      >
        <div className="relative">
          {content}
          {canDismiss && (
            <button
              onClick={() => setShow(false)}
              className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <X className="w-3 h-3" />
              Click to close
            </button>
          )}
        </div>
      </div>
    );
  }

  return content;
};
