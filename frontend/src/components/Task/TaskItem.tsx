import React, { useState } from 'react';
import type { Task } from '../../types/task.types';
import { CheckCircle, Circle, Edit2, Trash2, Calendar, Flag } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onEdit }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(task._id);
    } finally {
      setIsDeleting(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow ${
      task.status === 'completed' ? 'opacity-75' : ''
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={() => onToggle(task._id)}
            className="mt-1 text-blue-500 hover:text-blue-700 transition-colors"
          >
            {task.status === 'completed' ?
              <CheckCircle className="w-5 h-5" /> :
              <Circle className="w-5 h-5" />
            }
          </button>

          <div className="flex-1">
            <h3 className={`font-medium text-gray-900 ${
              task.status === 'completed' ? 'line-through' : ''
            }`}>
              {task.title}
            </h3>

            {task.description && (
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
            )}

            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Flag className={`w-3 h-3 ${getPriorityColor(task.priority)}`} />
                <span className="capitalize">{task.priority}</span>
              </div>

              {task.dueDate && (
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>Due {formatDate(task.dueDate)}</span>
                </div>
              )}

              <span>Created {formatDate(task.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onEdit(task)}
            className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
