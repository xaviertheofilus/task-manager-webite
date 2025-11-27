import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Input, TextArea, Select, Button } from '../common';
import { CreateTaskInput, Priority, Status } from '../../types/task';
import { validateTaskTitle, validateTaskDescription } from '@/lib/validation';
import { Sparkles, X } from 'lucide-react';
import toast from 'react-hot-toast';

// Mock users data
const MOCK_USERS = [
  { id: '1', name: 'Demo User', email: 'demo@example.com' },
  { id: '2', name: 'John Doe', email: 'john@example.com' },
  { id: '3', name: 'Jane Smith', email: 'jane@example.com' },
  { id: '4', name: 'Bob Johnson', email: 'bob@example.com' },
  { id: '5', name: 'Alice Williams', email: 'alice@example.com' },
];

interface TaskFormProps {
  initialValues?: Partial<CreateTaskInput>;
  onSubmit: (data: CreateTaskInput) => Promise<void>;
  isLoading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  initialValues,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CreateTaskInput>({
    title: initialValues?.title || '',
    description: initialValues?.description || '',
    priority: initialValues?.priority || 'medium',
    status: initialValues?.status || 'todo',
    dueDate: initialValues?.dueDate || undefined,
    tags: initialValues?.tags || [],
    estimatedTime: initialValues?.estimatedTime || undefined,
    aiSuggestions: initialValues?.aiSuggestions || undefined,
  });

  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});

  const [tagInput, setTagInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [assignedUsers, setAssignedUsers] = useState<string[]>([]);

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
  ];

  const statusOptions = [
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  const handleChange = (
    field: keyof CreateTaskInput,
    value: string | Priority | Status | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (field === 'title' || field === 'description') {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
    }));
  };

  const handleAddUser = (userId: string) => {
    if (!assignedUsers.includes(userId)) {
      setAssignedUsers([...assignedUsers, userId]);
    }
  };

  const handleRemoveUser = (userId: string) => {
    setAssignedUsers(assignedUsers.filter(id => id !== userId));
  };

  const handleAiAnalysis = async () => {
    if (!formData.description.trim()) {
      toast.error('Please enter a description to format');
      return;
    }

    setAiLoading(true);
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title || 'Task',
          description: formData.description,
          action: 'format_description'
        }),
      });

      const data = await response.json();

      if (data.success && data.formattedDescription) {
        setFormData((prev) => ({
          ...prev,
          description: data.formattedDescription,
        }));
        toast.success('Description formatted! ✨');
      } else {
        toast.error('Failed to format description');
      }
    } catch (error) {
      console.error('AI format error:', error);
      toast.error('An error occurred while formatting');
    } finally {
      setAiLoading(false);
    }
  };

  const validate = (): boolean => {
    const newErrors: { title?: string; description?: string } = {};

    const titleError = validateTaskTitle(formData.title);
    if (typeof titleError === 'string') newErrors.title = titleError;

    const descError = validateTaskDescription(formData.description);
    if (typeof descError === 'string') newErrors.description = descError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <Input
        label="Task Title"
        placeholder="Enter task title..."
        value={formData.title}
        onChange={(e) => handleChange('title', e.target.value)}
        error={errors.title}
        required
      />

      {/* Description */}
      <TextArea
        label="Description"
        placeholder="Describe your task in detail..."
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
        error={errors.description}
        rows={5}
        required
      />

      {/* AI Format Button */}
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={handleAiAnalysis}
          isLoading={aiLoading}
          className="flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          {aiLoading ? 'Formatting...' : 'Format Description'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Priority */}
        <Select
          label="Priority"
          value={formData.priority}
          onChange={(e) => handleChange('priority', e.target.value as Priority)}
          options={priorityOptions}
          required
        />

        {/* Status */}
        <Select
          label="Status"
          value={formData.status}
          onChange={(e) => handleChange('status', e.target.value as Status)}
          options={statusOptions}
          required
        />

        {/* Due Date */}
        <Input
          label="Due Date"
          type="date"
          value={formData.dueDate || ''}
          onChange={(e) => handleChange('dueDate', e.target.value || null)}
        />

        {/* Estimated Time */}
        <Input
          label="Estimated Time"
          placeholder="e.g., 2 hours, 3 days"
          value={formData.estimatedTime || ''}
          onChange={(e) => handleChange('estimatedTime', e.target.value || null)}
        />
      </div>

      {/* Assign Users */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Assign Users
        </label>
        <Select
          value=""
          onChange={(e) => {
            if (e.target.value) {
              handleAddUser(e.target.value);
            }
          }}
          options={[
            { value: '', label: 'Select user to assign...' },
            ...MOCK_USERS
              .filter(user => !assignedUsers.includes(user.id))
              .map(user => ({
                value: user.id,
                label: `${user.name} (${user.email})`
              }))
          ]}
        />

        {assignedUsers.length > 0 && (
          <div className="mt-3 space-y-2">
            {assignedUsers.map(userId => {
              const user = MOCK_USERS.find(u => u.id === userId);
              if (!user) return null;
              
              return (
                <div
                  key={userId}
                  className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                      <p className="text-xs text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveUser(userId)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="Add a tag..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
          />
          <Button type="button" onClick={handleAddTag} variant="secondary">
            Add
          </Button>
        </div>
        {formData.tags && formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className="flex-1"
        >
          {initialValues ? 'Update Task' : 'Create Task'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};
