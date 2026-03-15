import express from 'express';
import { LoginRequest, LoginResponse, ApiResponse, User, Role } from '@react-flow/shared-types';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const mockUsers: User[] = [
  { id: '1', email: 'admin@example.com', name: 'Admin User', role: Role.ADMIN },
  { id: '2', email: 'user@example.com', name: 'Regular User', role: Role.USER }
];

router.post('/login', (req, res) => {
  const { email, password }: LoginRequest = req.body;
  
  const user = mockUsers.find(u => u.email === email);
  
  if (!user || password !== 'password') {
    const response: ApiResponse = {
      success: false,
      message: 'Invalid credentials',
      data: null
    };
    return res.status(401).json(response);
  }
  
  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
  
  const loginResponse: LoginResponse = {
    user,
    token,
    refreshToken
  };
  
  const response: ApiResponse<LoginResponse> = {
    success: true,
    data: loginResponse
  };
  
  res.json(response);
});

router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;
  
  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as any;
    const user = mockUsers.find(u => u.id === decoded.userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    
    const response: ApiResponse<{ token: string }> = {
      success: true,
      data: { token }
    };
    
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: 'Invalid refresh token',
      data: null
    };
    res.status(401).json(response);
  }
});

export default router;
