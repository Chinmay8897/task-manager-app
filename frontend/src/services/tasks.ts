import { api } from './api';
import type { Task, CreateTaskData, UpdateTaskData } from '../types/task.types';

export interface TasksResponse {
  tasks: Task[];
  total: number;
  page: number;
  limit: number;
}

export interface TaskResponse {
  task: Task;
  message: string;
}

export interface TaskStatsResponse {
  stats: {
    total: number;
    pending: number;
    completed: number;
    overdue: number;
    completionRate: number;
    priorityBreakdown: {
      high: number;
      medium: number;
      low: number;
    };
    recentActivity: {
      tasksCreatedThisWeek: number;
      tasksCompletedThisWeek: number;
    };
  };
}

export const taskService = {
  // Get all tasks with optional filters
  getTasks: async (params?: {
    status?: 'pending' | 'completed';
    priority?: 'low' | 'medium' | 'high';
    search?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }): Promise<TasksResponse> => {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const response = await api.get(`/tasks?${searchParams.toString()}`);
    return response.data;
  },

  // Get a specific task by ID
  getTask: async (id: string): Promise<TaskResponse> => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  // Create a new task
  createTask: async (data: CreateTaskData): Promise<TaskResponse> => {
    const response = await api.post('/tasks', data);
    return response.data;
  },

  // Update an existing task
  updateTask: async (id: string, data: UpdateTaskData): Promise<TaskResponse> => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },

  // Delete a task
  deleteTask: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  // Toggle task status (pending <-> completed)
  toggleTaskStatus: async (id: string): Promise<TaskResponse> => {
    const response = await api.patch(`/tasks/${id}/toggle`);
    return response.data;
  },

  // Get task statistics
  getTaskStats: async (): Promise<TaskStatsResponse> => {
    const response = await api.get('/tasks/stats/summary');
    return response.data;
  },

  // Bulk operations
  bulkUpdateTasks: async (taskIds: string[], updates: UpdateTaskData): Promise<{ message: string; updatedCount: number }> => {
    const response = await api.patch('/tasks/bulk', {
      taskIds,
      updates
    });
    return response.data;
  },

  bulkDeleteTasks: async (taskIds: string[]): Promise<{ message: string; deletedCount: number }> => {
    const response = await api.delete('/tasks/bulk', {
      data: { taskIds }
    });
    return response.data;
  },

  // Export tasks
  exportTasks: async (format: 'json' | 'csv' = 'json'): Promise<Blob> => {
    const response = await api.get(`/tasks/export?format=${format}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Import tasks
  importTasks: async (file: File): Promise<{ message: string; importedCount: number }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/tasks/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};

export default taskService;
