export const API_ENDPOINTS = {
  USERS: '/users',
  AVATAR: (userId: string) =>`/users/${userId}/avatar`,
};
