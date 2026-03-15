import { Request, Response, NextFunction } from 'express';
import { Permission, Role, ApiResponse } from '@react-flow/shared-types';

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

export const hasPermission = (role: Role, requiredPermission: Permission): boolean => {
  return rolePermissions[role].includes(requiredPermission);
};

export const rbacMiddleware = (requiredPermission: Permission) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).user?.role as Role || Role.GUEST;
    
    if (!hasPermission(userRole, requiredPermission)) {
      const response: ApiResponse = {
        success: false,
        message: 'Permission denied',
        data: null
      };
      return res.status(403).json(response);
    }
    
    next();
  };
};
