import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'react-use';
import { useAuthStore } from '../store/authStore';
import { Role } from '@react-flow/shared-types';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, logout, isAuthenticated, user } = useAuthStore();
  const [, setUserRole] = useLocalStorage<Role>('userRole', Role.GUEST);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login({ email, password });
      if (user) {
        setUserRole(user.role);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || '登录失败，请重试');
    }
  };

  const handleLogout = () => {
    logout();
    setUserRole(Role.GUEST);
    navigate('/');
  };

  if (isAuthenticated && user) {
    return (
      <div className="login-container">
        <h2>欢迎, {user.name}!</h2>
        <p>您已以 {user.role} 身份登录</p>
        <p>邮箱: {user.email}</p>
        <button className="login-button" onClick={handleLogout} style={{ marginTop: '1rem' }}>
          登出
        </button>
      </div>
    );
  }

  return (
    <div className="login-container">
      <h2>登录</h2>
      {error && <div className="error-text">{error}</div>}
      
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">邮箱</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com 或 user@example.com"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">密码</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            required
          />
        </div>
        
        <button type="submit" className="login-button">
          登录
        </button>
      </form>
      
      <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
        <p>测试账号:</p>
        <p>管理员: admin@example.com / password</p>
        <p>普通用户: user@example.com / password</p>
      </div>
    </div>
  );
};

export default LoginPage;
