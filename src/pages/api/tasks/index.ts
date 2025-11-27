import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { Task, CreateTaskInput } from '../../../types/task';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: 'Use client-side taskStorage for GET operations',
    });
  }

  if (req.method === 'POST') {
    const input: CreateTaskInput = req.body;
    
    // Validate required fields
    if (!input.title || input.title.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Title must be at least 3 characters',
      });
    }

    if (!input.description || input.description.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Description must be at least 10 characters',
      });
    }

    const newTask: Task = {
      id: uuidv4(),
      title: input.title.trim(),
      description: input.description.trim(),
      priority: input.priority || 'medium',
      status: input.status || 'todo',
      dueDate: input.dueDate || null,
      tags: input.tags || [],
      estimatedTime: input.estimatedTime || null,
      aiSuggestions: input.aiSuggestions || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return res.status(201).json({
      success: true,
      task: newTask,
      message: 'Task created successfully',
    });
  }

  return res.status(405).json({
    success: false,
    message: 'Method not allowed',
  });
}
