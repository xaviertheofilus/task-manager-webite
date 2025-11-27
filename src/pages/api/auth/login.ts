import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { AuthResponse } from '../../../types/user';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required',
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format',
    });
  }

  // Password validation (min 6 characters)
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters',
    });
  }

  // Demo authentication (accept any valid email/password)
  // In production, use proper password hashing and database verification
  const user = {
    id: uuidv4(),
    email,
    name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=3b82f6&color=fff&size=128`,
    createdAt: new Date().toISOString(),
  };

  const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

  return res.status(200).json({
    success: true,
    user,
    token,
    message: 'Login successful',
  });
}
