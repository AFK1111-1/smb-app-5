import { useMutation, useQuery } from '@tanstack/react-query';
import QUERY_KEYS from './apiQuertKeys';

import {
  deleteUserAvatarQueryFn,
  deleteUserByIdQueryFn,
  generateAvatarUploadURLQueryFn,
  getCurrentUserQueryFn,
  updateCurrentUserQueryFn,
  updateUserAvatarQueryFn,
} from '@/api/services';
import { UserUpdateRequest } from '@/types/user';

// Get current user
export const useGetCurrentUser = (userId: string) => {
  const query = useQuery({
    queryKey: [QUERY_KEYS.USERS, userId],
    queryFn: () => getCurrentUserQueryFn(userId),
    enabled: !!userId,
  });
  return query;
};

// Update current user
export const useUpdateCurrentUser = () => {
  return useMutation({
    mutationFn: async (variables: {
      userId: string;
      payload: UserUpdateRequest;
    }) => {
      return updateCurrentUserQueryFn(variables.userId, variables.payload);
    },
  });
};

// Update delete user
export const useDeleteUserById = () => {
  return useMutation({
    mutationFn: async (variables: { userId: string }) => {
      return deleteUserByIdQueryFn(variables.userId);
    },
  });
};

// Generate presigned URL for user avatar upload
export const useGenerateAvatarUploadURL = () => {
  return useMutation({
    mutationFn: async (variables: {
      userId: string;
      fileName: string;
      contentType: string;
    }) => {
      return generateAvatarUploadURLQueryFn(
        variables.userId,
        variables.fileName,
        variables.contentType,
      );
    },
  });
};
// Update user avatar
export const useUpdateUserAvatar = () => {
  return useMutation({
    mutationFn: async (variables: { userId: string; avatarKey: string }) => {
      return updateUserAvatarQueryFn(variables.userId, variables.avatarKey);
    },
  });
};

export const useDeleteUserAvatar = () => {
  return useMutation({
    mutationFn: async (variables: { userId: string }) => {
      return deleteUserAvatarQueryFn(variables.userId);
    },
  });
};
