import React from 'react';
import { Permission } from '@react-flow/shared-types';
import PermissionGuard from '../components/PermissionGuard/PermissionGuard';
import { usePermission } from '../hooks/usePermission';
import { useAsync } from 'react-use';
import { api } from '../services/apiClient';
import { User } from '@react-flow/shared-types';

const AdminPage: React.FC = () => {
  const { isAdmin } = usePermission();

  const usersAsync = useAsync(async (): Promise<User[]> => {
    if (!isAdmin()) {
      return [];
    }
    const response = await api.get<User[]>('/users');
    return response.data;
  }, [isAdmin]);

  return (
    <div>
      <h1 className="page-title">管理后台</h1>
      
      <PermissionGuard
        permission={Permission.ADMIN_ACCESS}
        fallback={
          <div className="permission-denied">
            <h2>权限不足</h2>
            <p>您没有访问此页面的权限，请使用管理员账号登录。</p>
          </div>
        }
      >
        <div className="admin-container">
          <h2>用户管理</h2>
          
          {usersAsync.loading && (
            <div className="loading-text">加载中...</div>
          )}
          
          {usersAsync.error && (
            <div className="error-text">
              加载失败: {usersAsync.error.message}
            </div>
          )}
          
          {usersAsync.value && (
            <div className="users-list">
              {usersAsync.value.map((user) => (
                <div key={user.id} className="user-card">
                  <h3>{user.name}</h3>
                  <p>邮箱: {user.email}</p>
                  <span className={`user-role ${user.role}`}>{user.role}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </PermissionGuard>
    </div>
  );
};

export default AdminPage;
