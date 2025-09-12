import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, Search, CheckSquare } from 'lucide-react';
import type { Task, CreateTaskData, UpdateTaskData } from '../types/task.types';
import { taskService } from '../services/tasks';
import TaskItem from '../components/Task/TaskItem';
import TaskForm from '../components/Task/TaskForm';
import Layout from '../components/Layout/Layout';

const Tasks: React.FC = () => {
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
      setTasks(response.tasks || []);
    } catch (error) {
      console.error('Fetch tasks error:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    let filtered = [...tasks];

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        task =>
          task.title.toLowerCase().includes(term) ||
          task.description?.toLowerCase().includes(term)
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

  const handleUpdateTask = async (taskId: string, taskData: CreateTaskData | UpdateTaskData) => {
    try {
      const response = await taskService.updateTask(taskId, taskData as UpdateTaskData);
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
      <div className="space-y-4 sm:space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">All Tasks</h1>
            <p className="text-gray-600 mt-1">Manage and organize all your tasks</p>
          </div>
          <button
            onClick={() => setShowTaskForm(true)}
            className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            <span>New Task</span>
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Priority</option>
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              <div className="flex items-end">
                <div className="w-full">
                  <div className="text-sm font-medium text-gray-700 mb-1">Results</div>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
                    {filteredTasks.length} of {tasks.length} tasks
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 sm:p-6">
            {filteredTasks.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {tasks.length === 0 ? 'No tasks yet' : 'No matching tasks'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {tasks.length === 0
                      ? 'Get started by creating your first task'
                      : 'Try adjusting your search or filters'
                    }
                  </p>
                  {tasks.length === 0 && (
                    <button
                      onClick={() => setShowTaskForm(true)}
                      className="btn-primary"
                    >
                      Create Task
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTasks.map((task) => (
                  <TaskItem
                    key={task._id}
                    task={task}
                    onToggle={handleToggleTask}
                    onEdit={setEditingTask}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Form Modal */}
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

export default Tasks;
