import express from 'express';
import { User, Role, ApiResponse, Permission } from '@react-flow/shared-types';
import { rbacMiddleware } from '../middleware/rbac';

const router = express.Router();

const mockUsers: User[] = [
  { id: '1', email: 'admin@example.com', name: 'Admin User', role: Role.ADMIN },
  { id: '2', email: 'user@example.com', name: 'Regular User', role: Role.USER },
  { id: '3', email: 'guest@example.com', name: 'Guest User', role: Role.GUEST }
];

router.get('/', rbacMiddleware(Permission.READ_USERS), (req, res) => {
  const response: ApiResponse<User[]> = {
    success: true,
    data: mockUsers
  };
  
  res.json(response);
});

router.get('/:id', rbacMiddleware(Permission.READ_USERS), (req, res) => {
  const user = mockUsers.find(u => u.id === req.params.id);
  
  if (!user) {
    const response: ApiResponse = {
      success: false,
      message: 'User not found',
      data: null
    };
    return res.status(404).json(response);
  }
  
  const response: ApiResponse<User> = {
    success: true,
    data: user
  };
  
  res.json(response);
});

export default router;
