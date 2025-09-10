import { Response } from 'express';
import Task from '../models/Task';
import { AuthRequest } from '../middleware/auth';

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { status, priority, sortBy = 'createdAt', order = 'desc' } = req.query;

    // Build filter object
    const filter: any = { userId: req.user?._id };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    // Build sort object
    const sortOrder = order === 'asc' ? 1 : -1;
    const sort: any = { [sortBy as string]: sortOrder };

    const tasks = await Task.find(filter).sort(sort);

    res.json({ tasks });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    const task = new Task({
      title,
      description,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      userId: req.user?._id
    });

    await task.save();
    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.user?._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task updated successfully', task });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({ _id: id, userId: req.user?._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const toggleTaskStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({ _id: id, userId: req.user?._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.status = task.status === 'pending' ? 'completed' : 'pending';
    await task.save();

    res.json({ message: 'Task status updated successfully', task });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
