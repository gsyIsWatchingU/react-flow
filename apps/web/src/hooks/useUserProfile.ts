import { useAsync } from 'react-use';
import { User } from '@react-flow/shared-types';
import { api } from '../services/apiClient';
import { useAuthStore } from '../store/authStore';

export const useUserProfile = (userId?: string) => {
  const { user: currentUser } = useAuthStore();
  const targetUserId = userId || currentUser?.id;

  const profileAsync = useAsync(async (): Promise<User | null> => {
    if (!targetUserId) {
      return null;
    }

    const response = await api.get<User>(`/users/${targetUserId}`);
    return response as unknown as User;
  }, [targetUserId]);

  return {
    profile: profileAsync.value,
    loading: profileAsync.loading,
    error: profileAsync.error
  };
};
