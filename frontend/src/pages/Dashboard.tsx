import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import type { Task, CreateTaskData, UpdateTaskData } from '../types/task.types';
import { taskService } from '../services/tasks';
import TaskItem from '../components/Task/TaskItem';
import TaskForm from '../components/Task/TaskForm';
import Layout from '../components/Layout/Layout';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchTerm, statusFilter, priorityFilter]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getTasks();
      setTasks(response.tasks);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    let filtered = tasks;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    // Filter by priority
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    setFilteredTasks(filtered);
  };

  const handleCreateTask = async (taskData: CreateTaskData | UpdateTaskData) => {
    try {
      const response = await taskService.createTask(taskData as CreateTaskData);
      setTasks(prev => [response.task, ...prev]);
      setShowTaskForm(false);
      toast.success('Task created successfully');
    } catch (error) {
      console.error('Create task error:', error);
      toast.error('Failed to create task');
    }
  };

  const handleUpdateTask = async (taskId: string, taskData: UpdateTaskData) => {
    try {
      const response = await taskService.updateTask(taskId, taskData);
      setTasks(prev => prev.map(task =>
        task._id === taskId ? response.task : task
      ));
      setEditingTask(null);
      toast.success('Task updated successfully');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleToggleTask = async (taskId: string) => {
    try {
      const response = await taskService.toggleTaskStatus(taskId);
      setTasks(prev => prev.map(task =>
        task._id === taskId ? response.task : task
      ));
      toast.success('Task status updated');
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task._id !== taskId));
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading your tasks...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout onCreateTask={() => setShowTaskForm(true)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Section */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Let's get productive and manage your tasks effectively.
          </p>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8 mb-6 lg:mb-8">
          <div className="flex flex-col space-y-4 lg:space-y-6">
            {/* Section Header */}
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Task Management</h2>
                <p className="text-sm text-gray-600 mt-1">Search, filter, and organize your tasks efficiently</p>
              </div>
              <div className="flex-shrink-0">
                <button
                  onClick={() => setShowTaskForm(true)}
                  className="btn-primary flex items-center justify-center space-x-2 text-sm hover:shadow-lg transition-all duration-200 w-full sm:w-auto px-4 py-2.5"
                  aria-label="Create a new task"
                  title="Add a new task to your list"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Task</span>
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="space-y-4">
              {/* Search Input */}
              <div className="relative">
                <label htmlFor="task-search" className="sr-only">Search tasks</label>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" aria-hidden="true" />
                <input
                  id="task-search"
                  type="text"
                  placeholder="Search by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-sm"
                  aria-describedby="search-help"
                />
                <div id="search-help" className="sr-only">
                  Search through your tasks by typing keywords
                </div>
              </div>

              {/* Filter Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="sm:col-span-1">
                  <label htmlFor="status-filter" className="block text-xs font-medium text-gray-700 mb-1.5">
                    Status
                  </label>
                  <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white text-sm"
                    aria-label="Filter tasks by status"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="sm:col-span-1">
                  <label htmlFor="priority-filter" className="block text-xs font-medium text-gray-700 mb-1.5">
                    Priority
                  </label>
                  <select
                    id="priority-filter"
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value as any)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white text-sm"
                    aria-label="Filter tasks by priority"
                  >
                    <option value="all">All Priority</option>
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>

                <div className="sm:col-span-2 lg:col-span-2 flex items-end">
                  <div className="w-full">
                    <div className="text-xs font-medium text-gray-700 mb-1.5">Results</div>
                    <div className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
                      Showing <span className="font-medium text-gray-900">{filteredTasks.length}</span> of{' '}
                      <span className="font-medium text-gray-900">{tasks.length}</span> tasks
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Your Tasks</h2>
              {tasks.length > 0 && (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>{tasks.filter(t => t.status === 'completed').length} completed</span>
                  <span>•</span>
                  <span>{tasks.filter(t => t.status === 'pending').length} pending</span>
                </div>
              )}
            </div>

            <div className="space-y-3 lg:space-y-4">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-12 lg:py-16">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Filter className="w-10 h-10 lg:w-12 lg:h-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {tasks.length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    {tasks.length === 0
                      ? "Get started by creating your first task! Click the 'New Task' button above to begin organizing your work."
                      : "Try adjusting your search terms or filters to find the tasks you're looking for."
                    }
                  </p>
                  {tasks.length === 0 && (
                    <button
                      onClick={() => setShowTaskForm(true)}
                      className="btn-primary hover:shadow-lg transition-all duration-200 px-6 py-3"
                      aria-label="Create your first task"
                    >
                      Create Your First Task
                    </button>
                  )}
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <TaskItem
                    key={task._id}
                    task={task}
                    onToggle={handleToggleTask}
                    onDelete={handleDeleteTask}
                    onEdit={setEditingTask}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Task Form Modals */}
      {showTaskForm && (
        <TaskForm
          onSubmit={handleCreateTask}
          onClose={() => setShowTaskForm(false)}
        />
      )}

      {editingTask && (
        <TaskForm
          task={editingTask}
          onSubmit={(data) => handleUpdateTask(editingTask._id, data)}
          onClose={() => setEditingTask(null)}
        />
      )}
    </Layout>
  );
};

export default Dashboard;
