import type { NextApiRequest, NextApiResponse } from 'next';
import { UpdateTaskInput } from '../../../types/task';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Invalid task ID',
    });
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: 'Use client-side taskStorage.getTaskById()',
    });
  }

  if (req.method === 'PUT') {
    const updates: UpdateTaskInput = req.body;
    
    // Validate if updating title
    if (updates.title !== undefined && updates.title.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Title must be at least 3 characters',
      });
    }

    // Validate if updating description
    if (updates.description !== undefined && updates.description.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Description must be at least 10 characters',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      updates,
    });
  }

  if (req.method === 'DELETE') {
    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  }

  return res.status(405).json({
    success: false,
    message: 'Method not allowed',
  });
}
