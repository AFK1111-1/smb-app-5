export const ROUTES = {
  ROOT: '/(root)',
  MAIN_TABS: '/(tabs)',
  SETTINGS: '/(settings)',
  PROFILE: '/(tabs)/profile',

  LOGIN: '/login',
  SIGN_UP: '/sign-up',

  //   // Dynamic Routes (as functions)
  //   USER_PROFILE: (userId: string) => `/profile/${userId}`,
  //   POST_DETAILS: (postId: number) => `/posts/${postId}`,
} as const;
