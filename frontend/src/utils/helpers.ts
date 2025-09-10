import { format, formatDistanceToNow, isToday, isYesterday, isTomorrow, parseISO } from 'date-fns';
import type { Task } from '../types/task.types';
import { PRIORITY_COLORS, STATUS_COLORS } from './constants';

/**
 * Format date for display
 */
export const formatDate = (date: string | Date, formatStr: string = 'MMM dd, yyyy'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch (error) {
    return 'Invalid date';
  }
};

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 */
export const formatRelativeTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    return 'Unknown time';
  }
};

/**
 * Get friendly date description
 */
export const getFriendlyDate = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;

    if (isToday(dateObj)) return 'Today';
    if (isYesterday(dateObj)) return 'Yesterday';
    if (isTomorrow(dateObj)) return 'Tomorrow';

    return format(dateObj, 'MMM dd, yyyy');
  } catch (error) {
    return 'Invalid date';
  }
};

/**
 * Check if a task is overdue
 */
export const isTaskOverdue = (task: Task): boolean => {
  if (task.status === 'completed' || !task.dueDate) return false;
  return new Date(task.dueDate) < new Date();
};

/**
 * Get priority color classes
 */
export const getPriorityColors = (priority: 'low' | 'medium' | 'high') => {
  return PRIORITY_COLORS[priority];
};

/**
 * Get status color classes
 */
export const getStatusColors = (status: 'pending' | 'completed') => {
  return STATUS_COLORS[status];
};

/**
 * Calculate task completion percentage
 */
export const calculateCompletionRate = (tasks: Task[]): number => {
  if (tasks.length === 0) return 0;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  return Math.round((completedTasks / tasks.length) * 100);
};

/**
 * Group tasks by status
 */
export const groupTasksByStatus = (tasks: Task[]) => {
  return tasks.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = [];
    }
    acc[task.status].push(task);
    return acc;
  }, {} as Record<string, Task[]>);
};

/**
 * Group tasks by priority
 */
export const groupTasksByPriority = (tasks: Task[]) => {
  return tasks.reduce((acc, task) => {
    if (!acc[task.priority]) {
      acc[task.priority] = [];
    }
    acc[task.priority].push(task);
    return acc;
  }, {} as Record<string, Task[]>);
};

/**
 * Sort tasks by various criteria
 */
export const sortTasks = (
  tasks: Task[],
  sortBy: 'title' | 'createdAt' | 'dueDate' | 'priority' | 'status' = 'createdAt',
  order: 'asc' | 'desc' = 'desc'
): Task[] => {
  return [...tasks].sort((a, b) => {
    let aValue: any = a[sortBy];
    let bValue: any = b[sortBy];

    // Handle date fields
    if (sortBy === 'createdAt' || sortBy === 'dueDate') {
      aValue = new Date(aValue || 0).getTime();
      bValue = new Date(bValue || 0).getTime();
    }

    // Handle priority sorting
    if (sortBy === 'priority') {
      const priorityOrder = { low: 1, medium: 2, high: 3 };
      aValue = priorityOrder[a.priority];
      bValue = priorityOrder[b.priority];
    }

    // Handle status sorting
    if (sortBy === 'status') {
      aValue = a.status === 'completed' ? 1 : 0;
      bValue = b.status === 'completed' ? 1 : 0;
    }

    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Filter tasks based on criteria
 */
export const filterTasks = (
  tasks: Task[],
  filters: {
    search?: string;
    status?: 'pending' | 'completed';
    priority?: 'low' | 'medium' | 'high';
    overdue?: boolean;
  }
): Task[] => {
  let filteredTasks = [...tasks];

  // Search filter
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredTasks = filteredTasks.filter(task =>
      task.title.toLowerCase().includes(searchTerm) ||
      task.description?.toLowerCase().includes(searchTerm)
    );
  }

  // Status filter
  if (filters.status) {
    filteredTasks = filteredTasks.filter(task => task.status === filters.status);
  }

  // Priority filter
  if (filters.priority) {
    filteredTasks = filteredTasks.filter(task => task.priority === filters.priority);
  }

  // Overdue filter
  if (filters.overdue) {
    filteredTasks = filteredTasks.filter(isTaskOverdue);
  }

  return filteredTasks;
};

/**
 * Generate task statistics
 */
export const generateTaskStats = (tasks: Task[]) => {
  const total = tasks.length;
  const pending = tasks.filter(t => t.status === 'pending').length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const overdue = tasks.filter(isTaskOverdue).length;

  const priorityBreakdown = {
    high: tasks.filter(t => t.priority === 'high').length,
    medium: tasks.filter(t => t.priority === 'medium').length,
    low: tasks.filter(t => t.priority === 'low').length,
  };

  return {
    total,
    pending,
    completed,
    overdue,
    completionRate: calculateCompletionRate(tasks),
    priorityBreakdown,
  };
};

/**
 * Debounce function for search inputs
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Capitalize first letter of string
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Generate initials from name
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

/**
 * Check if user is on mobile device
 */
export const isMobile = (): boolean => {
  return window.innerWidth < 768; // md breakpoint
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    }
  } catch (error) {
    console.error('Failed to copy text:', error);
    return false;
  }
};

/**
 * Download data as file
 */
export const downloadAsFile = (data: string, filename: string, type: string = 'text/plain'): void => {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Generate random ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Wait for specified time (useful for testing)
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
