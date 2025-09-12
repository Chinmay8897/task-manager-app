import React, { useState, useEffect } from 'react';
import { Calendar, Flag, FileText, Save } from 'lucide-react';
import type { Task, CreateTaskData, UpdateTaskData } from '../../types/task.types';
import Modal from '../UI/Modal';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: CreateTaskData | UpdateTaskData) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({
  task,
  onSubmit,
  onClose,
  loading = false
}) => {
  const [formData, setFormData] = useState<CreateTaskData>({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  });
  const [errors, setErrors] = useState<Partial<CreateTaskData>>({});
  const isEditing = !!task;

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
      });
    }
  }, [task]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateTaskData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const submitData = {
        ...formData,
        dueDate: formData.dueDate || undefined
      };

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Error submitting task:', error);
    }
  };

  const handleInputChange = (field: keyof CreateTaskData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={isEditing ? 'Edit Task' : 'Create New Task'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[75vh]">
        {/* Form Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
          {/* Form Header */}
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              {isEditing ? 'Edit Task' : 'Create New Task'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {isEditing
                ? 'Update your task details below.'
                : 'Fill in the details to create a new task.'}
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Title Field */}
            <div className="space-y-2">
              <label
                htmlFor="task-title"
                className="block text-sm font-medium text-gray-700"
              >
                Task Title *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="task-title"
                  type="text"
                  placeholder="Enter a clear, descriptive title..."
                  value={formData.title}
                  onChange={handleInputChange('title')}
                  disabled={loading}
                  maxLength={100}
                  className={`block w-full pl-10 pr-3 py-2 sm:py-2.5 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-sm sm:text-base ${
                    errors.title
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300'
                  }`}
                  aria-describedby="title-error title-help"
                  aria-invalid={errors.title ? 'true' : 'false'}
                />
              </div>
              {errors.title && (
                <p id="title-error" className="text-sm text-red-600" role="alert">
                  {errors.title}
                </p>
              )}
              <div id="title-help" className="flex justify-between text-xs text-gray-500">
                <span className="truncate pr-2">Choose a clear, specific title for your task</span>
                <span className="flex-shrink-0">{formData.title.length}/100</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                placeholder="Enter task description (optional)"
                value={formData.description}
                onChange={handleInputChange('description')}
                disabled={loading}
                maxLength={500}
                className={`
                  w-full px-3 py-2 sm:py-2.5 border rounded-lg shadow-sm placeholder-gray-400 text-sm sm:text-base
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200
                  disabled:bg-gray-50 disabled:text-gray-500
                  ${errors.description
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300'
                  }
                `}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.description?.length || 0}/500 characters
              </p>
            </div>

            {/* Priority and Due Date Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Priority */}
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Flag className="w-4 h-4 text-gray-400" />
                  </div>
                  <select
                    id="priority"
                    value={formData.priority}
                    onChange={handleInputChange('priority')}
                    disabled={loading}
                    className="block w-full pl-10 pr-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-sm sm:text-base"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={handleInputChange('dueDate')}
                    disabled={loading}
                    min={new Date().toISOString().split('T')[0]}
                    className="block w-full pl-10 pr-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-sm sm:text-base"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions - Fixed at bottom */}
        <div className="flex-shrink-0 px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
          {!formData.title.trim() && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-700 text-center font-medium">
                💡 Please enter a task title above to enable the "Create Task" button below
              </p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-full sm:w-auto px-4 py-2 sm:py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
              aria-label="Cancel and close form"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title.trim()}
              className={`w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 sm:py-2.5 text-sm font-medium border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 ${
                loading || !formData.title.trim()
                  ? 'bg-gray-400 text-gray-100 cursor-not-allowed border-gray-400'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              aria-label={isEditing ? 'Update task' : 'Create new task'}
              title={loading || !formData.title.trim() ? 'Please enter a task title to enable this button' : ''}
            >
              <Save className="w-4 h-4 mr-2" aria-hidden="true" />
              {loading
                ? (isEditing ? 'Updating...' : 'Creating...')
                : (isEditing ? 'Update Task' : 'Create Task')
              }
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default TaskForm;