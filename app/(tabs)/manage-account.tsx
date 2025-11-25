import { useUserProfileData } from '@/context/UserAuthGuard';
import { useUpdateCurrentUser } from '@/hooks/api/use-users';
import { useQueryClient } from '@tanstack/react-query';
import ManageAccountTemplate from '@/screens/ManageAccountScreen/ManageAccountScreen';
import { Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

export default function ManageAccountScreen() {
  const userProfile = useUserProfileData();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { mutate: updateCurrentUser, isPending: isUserUpdating } =
    useUpdateCurrentUser();

  if (!userProfile) {
    return <Text>{t('profile.noProfile')}</Text>;
  }

  return (
    <ManageAccountTemplate
      userProfile={userProfile}
      queryClient={queryClient}
      updateCurrentUser={updateCurrentUser}
      isUserUpdating={isUserUpdating}
      t={t}
    />
  );
}
