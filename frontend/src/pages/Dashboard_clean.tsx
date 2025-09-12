import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, CheckSquare, Clock } from 'lucide-react';
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
      // Type guard to ensure it's CreateTaskData for new tasks
      if ('title' in taskData && typeof taskData.title === 'string') {
        const response = await taskService.createTask(taskData as CreateTaskData);
        setTasks(prev => [response.task, ...prev]);
        setShowTaskForm(false);
        toast.success('Task created successfully');
      }
    } catch (error) {
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

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    completed: tasks.filter(t => t.status === 'completed').length,
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
    <Layout>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Here's an overview of your task progress today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl">
                <CheckSquare className="w-6 h-6 text-blue-600" aria-hidden="true" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900" aria-label={`${stats.total} total tasks`}>
                  {stats.total}
                </p>
                <p className="text-xs text-gray-500 mt-1">All your tasks</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Clock className="w-6 h-6 text-yellow-600" aria-hidden="true" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
                <p className="text-3xl font-bold text-gray-900" aria-label={`${stats.pending} pending tasks`}>
                  {stats.pending}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.pending === 0 ? 'All caught up!' : 'Needs attention'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckSquare className="w-6 h-6 text-green-600" aria-hidden="true" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Tasks</p>
                <p className="text-3xl font-bold text-gray-900" aria-label={`${stats.completed} completed tasks`}>
                  {stats.completed}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.total > 0 ? `${Math.round((stats.completed / stats.total) * 100)}% complete` : 'Start creating tasks!'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex flex-col space-y-4">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Task Management</h2>
              <p className="text-sm text-gray-600">Search, filter, and organize your tasks</p>
            </div>
            <button
              onClick={() => setShowTaskForm(true)}
              className="btn-primary flex items-center space-x-2 text-sm hover:shadow-md transition-all duration-200"
              aria-label="Create a new task"
              title="Add a new task to your list"
            >
              <Plus className="h-4 w-4" />
              <span>New Task</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <label htmlFor="task-search" className="sr-only">Search tasks</label>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" aria-hidden="true" />
                <input
                  id="task-search"
                  type="text"
                  placeholder="Search by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  aria-describedby="search-help"
                />
                <div id="search-help" className="sr-only">
                  Search through your tasks by typing keywords
                </div>
              </div>

              {/* Filter Controls */}
              <div className="flex gap-4">
                <div className="flex flex-col">
                  <label htmlFor="status-filter" className="text-xs font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white"
                    aria-label="Filter tasks by status"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="priority-filter" className="text-xs font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    id="priority-filter"
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white"
                    aria-label="Filter tasks by priority"
                  >
                    <option value="all">All Priority</option>
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results Summary */}
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium text-gray-900">{filteredTasks.length}</span> of{' '}
              <span className="font-medium text-gray-900">{tasks.length}</span> tasks
            </div>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Tasks</h2>
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {tasks.length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
              </h3>
              <p className="text-gray-600 mb-6">
                {tasks.length === 0
                  ? "Get started by creating your first task!"
                  : "Try adjusting your search or filters."
                }
              </p>
              {tasks.length === 0 && (
                <button
                  onClick={() => setShowTaskForm(true)}
                  className="btn-primary hover:shadow-md transition-all duration-200"
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
