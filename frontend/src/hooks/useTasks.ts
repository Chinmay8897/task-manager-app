import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import type { Task, CreateTaskData, UpdateTaskData } from '../types/task.types';
import { taskService } from '../services/tasks';

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  stats: {
    total: number;
    pending: number;
    completed: number;
    overdue: number;
    completionRate: number;
  };
  fetchTasks: () => Promise<void>;
  createTask: (data: CreateTaskData) => Promise<Task>;
  updateTask: (id: string, data: UpdateTaskData) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskStatus: (id: string) => Promise<Task>;
  refreshTasks: () => Promise<void>;
}

export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate task statistics
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => {
      if (t.status === 'completed' || !t.dueDate) return false;
      return new Date(t.dueDate) < new Date();
    }).length,
    completionRate: tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0
  };

  // Fetch all tasks
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskService.getTasks();
      setTasks(response.tasks);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch tasks';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new task
  const createTask = useCallback(async (data: CreateTaskData): Promise<Task> => {
    try {
      const response = await taskService.createTask(data);
      const newTask = response.task;

      setTasks(prevTasks => [newTask, ...prevTasks]);
      toast.success('Task created successfully');

      return newTask;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create task';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Update an existing task
  const updateTask = useCallback(async (id: string, data: UpdateTaskData): Promise<Task> => {
    try {
      const response = await taskService.updateTask(id, data);
      const updatedTask = response.task;

      setTasks(prevTasks =>
        prevTasks.map(task => task._id === id ? updatedTask : task)
      );
      toast.success('Task updated successfully');

      return updatedTask;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update task';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Delete a task
  const deleteTask = useCallback(async (id: string): Promise<void> => {
    try {
      await taskService.deleteTask(id);

      setTasks(prevTasks => prevTasks.filter(task => task._id !== id));
      toast.success('Task deleted successfully');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete task';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Toggle task status (pending/completed)
  const toggleTaskStatus = useCallback(async (id: string): Promise<Task> => {
    try {
      const response = await taskService.toggleTaskStatus(id);
      const updatedTask = response.task;

      setTasks(prevTasks =>
        prevTasks.map(task => task._id === id ? updatedTask : task)
      );

      const statusMessage = updatedTask.status === 'completed'
        ? 'Task marked as completed'
        : 'Task marked as pending';
      toast.success(statusMessage);

      return updatedTask;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update task status';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Refresh tasks (alias for fetchTasks)
  const refreshTasks = useCallback(async () => {
    await fetchTasks();
  }, [fetchTasks]);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Auto-refresh tasks every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTasks();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    stats,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    refreshTasks
  };
};

export default useTasks;
