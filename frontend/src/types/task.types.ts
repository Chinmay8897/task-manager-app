// Task interface
interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Create task data interface
interface CreateTaskData {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

// Update task data interface
interface UpdateTaskData extends Partial<CreateTaskData> {
  status?: 'pending' | 'completed';
}

// Export all interfaces
export type { Task, CreateTaskData, UpdateTaskData };
