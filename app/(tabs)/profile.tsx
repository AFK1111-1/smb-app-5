import { useUserProfileData } from '@/context/UserAuthGuard';
import {
  useDeleteUserAvatar,
  useDeleteUserById,
  useGenerateAvatarUploadURL,
  useUpdateCurrentUser,
  useUpdateUserAvatar,
} from '@/hooks/api/use-users';
import { useQueryClient } from '@tanstack/react-query';
import { useKindeAuth } from '@kinde/expo';

import ProfileTemplate from '@/screens/ProfileScreen/ProfileScreen';
import { Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

export default function ProfileScreen() {
  const userProfile = useUserProfileData();
  const { logout } = useKindeAuth();
  const { t } = useTranslation();

  if (!userProfile) {
    return <Text>{t('profile.noProfile')}</Text>;
  }
  const queryClient = useQueryClient();
  const { mutateAsync: deleteUser, isPending: isUserDeleting } =
    useDeleteUserById();

  const { mutateAsync: generateAvatarUploadURL, isPending: isURLGenerating } =
    useGenerateAvatarUploadURL();
  const { mutateAsync: updateUserAvatar, isPending: isAvatarUpdating } =
    useUpdateUserAvatar();
  const { mutateAsync: deleteUserAvatar, isPending: isAvatarDeleting } =
    useDeleteUserAvatar();
  const { mutate: updateCurrentUser, isPending: isUserUpdating } =
    useUpdateCurrentUser();
  return (
    <ProfileTemplate
      t={t}
      userProfile={userProfile}
      logout={logout}
      deleteUser={deleteUser}
      deleteUserAvatar={deleteUserAvatar}
      isAvatarDeleting={isAvatarDeleting}
      isAvatarUploading={isAvatarUpdating}
      isUserDeleting={isUserDeleting}
      queryClient={queryClient}
      updateUserAvatar={updateUserAvatar}
      generateAvatarUploadURL={generateAvatarUploadURL}
      isUserUpdating={isUserUpdating}
      updateCurrentUser={updateCurrentUser}
    />
  );
}
