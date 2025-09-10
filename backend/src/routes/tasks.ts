import { Router } from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus
} from '../controllers/taskController';
import { authenticate } from '../middleware/auth';
import { validateTask, validateObjectId } from '../utils/simpleValidators';

const router = Router();

// All task routes require authentication
router.use(authenticate);

router.get('/', getTasks);
router.post('/', validateTask, createTask);
router.put('/:id', validateObjectId, validateTask, updateTask);
router.delete('/:id', validateObjectId, deleteTask);
router.patch('/:id/toggle', validateObjectId, toggleTaskStatus);

export default router;
