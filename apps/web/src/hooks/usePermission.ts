import { useLocalStorage } from 'react-use';
import { Permission, Role } from '@react-flow/shared-types';
import { useAuthStore } from '../store/authStore';

const rolePermissions: Record<Role, Permission[]> = {
  [Role.ADMIN]: [
    Permission.READ_USERS,
    Permission.WRITE_USERS,
    Permission.DELETE_USERS,
    Permission.READ_DASHBOARD,
    Permission.ADMIN_ACCESS
  ],
  [Role.USER]: [
    Permission.READ_DASHBOARD
  ],
  [Role.GUEST]: []
};

const hasPermission = (role: Role, requiredPermission: Permission): boolean => {
  return rolePermissions[role].includes(requiredPermission);
};

export const usePermission = () => {
  const { user } = useAuthStore();
  const [role] = useLocalStorage<Role>('userRole', Role.GUEST);

  const checkPermission = (permission: Permission): boolean => {
    const userRole = user?.role || role || Role.GUEST;
    return hasPermission(userRole, permission);
  };

  const isAdmin = (): boolean => {
    const userRole = user?.role || role;
    return userRole === Role.ADMIN;
  };

  const isUser = (): boolean => {
    const userRole = user?.role || role;
    return userRole === Role.USER;
  };

  return {
    hasPermission: checkPermission,
    isAdmin,
    isUser,
    role: user?.role || role
  };
};
