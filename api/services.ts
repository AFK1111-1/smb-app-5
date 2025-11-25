import { User, UserUpdateRequest } from '@/types/user';
import API from './axios-client';
import { API_ENDPOINTS } from './endpoints';
import { ensureLocalAvatar, removeLocalAvatar } from '@/utils/profileImage';

export const getCurrentUserQueryFn = async (userId: string): Promise<User> => {
  const response = await API.get(`${API_ENDPOINTS.USERS}/${userId}`);
  let profileData = response.data;
  if (profileData.avatar) {
    try {
      const localImageURI = await ensureLocalAvatar(profileData.avatar, userId);
      return {
        ...profileData,
        avatar: localImageURI,
      };
    } catch (error) {
      console.warn('getCurrentUserQueryFn avatar error:', error);
      return profileData;
    }
  }
  return profileData;
};

export const updateCurrentUserQueryFn = async (
  userId: string,
  data: UserUpdateRequest,
): Promise<any> => {
  const response = await API.put(`${API_ENDPOINTS.USERS}/${userId}`, data);
  return response.data;
};

export const deleteUserByIdQueryFn = async (userId: string): Promise<any> => {
  const response = await API.delete(`${API_ENDPOINTS.USERS}/${userId}`);
  return response.data;
};
export const generateAvatarUploadURLQueryFn = async (
  userId: string,
  fileName: string,
  contentType: string,
): Promise<{ url: string; key: string }> => {
  const response = await API.post(`${API_ENDPOINTS.AVATAR(userId)}`, {
    fileName: fileName,
    contentType: contentType,
  });
  return response.data;
};
export const updateUserAvatarQueryFn = async (
  userId: string,
  avatarKey: string,
): Promise<User> => {
  const response = await API.put(`${API_ENDPOINTS.AVATAR(userId)}`, {
    avatarKey,
  });
  const updated: User = response.data;
  try {
    await removeLocalAvatar(userId);
    if (updated.avatar) {
      const local = await ensureLocalAvatar(
        updated.avatar as unknown as string,
        userId,
      );
      return { ...updated, avatar: local } as User;
    }
  } catch {
    console.warn('Error updating avatar');
  }
  return updated;
};
export const deleteUserAvatarQueryFn = async (
  userId: string,
): Promise<{ message: string }> => {
  const response = await API.delete(`${API_ENDPOINTS.AVATAR(userId)}`);
  try {
    await removeLocalAvatar(userId);
  } catch {
    console.warn('Error deleting avatar');
  }
  return response.data;
};
