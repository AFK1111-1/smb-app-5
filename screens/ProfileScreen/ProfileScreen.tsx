import { User } from '@/types/user';
import { Alert, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useRef, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Dialog, Text } from 'react-native-paper';
import { useAppTheme } from '@/context/ThemeContext';
import { Fonts } from '@/constants/Fonts';
import {
  QueryClient,
  UseMutateAsyncFunction,
} from '@tanstack/react-query';
import { Button, MenuItem } from '@/components/ui';
import IconButton from '@/components/ui/IconButton';
import ActivityIndicator from '@/components/ui/ActivityIndicator';
import { TFunction } from 'i18next';
import { uploadToS3 } from '@/utils/uploadToS3';
import Avatar from '@/components/ui/Avatar/Avatar';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import DeleteIcon from '@/assets/icons/delete-icon.svg';
import CameraIcon from '@/assets/icons/camera-icon.svg';
import GalleryIcon from '@/assets/icons/upload-image-icon.svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import QUERY_KEYS from '@/hooks/api/apiQuertKeys';
import { router } from 'expo-router';
import { ROUTES } from '@/constants/routes';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useCallback } from 'react';

type LogoutRequest = { revokeToken: boolean };
type LogoutResult = { success: boolean };

interface ProfileScreenProps {
  userProfile: User;
  queryClient: QueryClient;
  isAvatarUploading: boolean;
  isAvatarDeleting: boolean;
  isUserDeleting: boolean;
  t: TFunction<'translation', undefined>;
  logout: (options?: Partial<LogoutRequest>) => Promise<LogoutResult>;
  deleteUser: UseMutateAsyncFunction<
    unknown,
    Error,
    {
      userId: string;
    },
    unknown
  >;
  updateUserAvatar: UseMutateAsyncFunction<
    unknown,
    Error,
    {
      userId: string;
      avatarKey: string;
    },
    unknown
  >;
  generateAvatarUploadURL: UseMutateAsyncFunction<
    {
      url: string;
      key: string;
    },
    Error,
    {
      userId: string;
      fileName: string;
      contentType: string;
    },
    unknown
  >;
  deleteUserAvatar: UseMutateAsyncFunction<
    {
      message: string;
    },
    Error,
    {
      userId: string;
    },
    unknown
  >;
}

export default function ProfileScreen({
  userProfile,
  queryClient,
  isAvatarDeleting,
  isAvatarUploading,
  isUserDeleting,
  t,
  deleteUser,
  updateUserAvatar,
  generateAvatarUploadURL,
  deleteUserAvatar,
  logout,
}: ProfileScreenProps) {
  const [isAvatarUpdating, setIsAvatarUpdating] = useState<boolean>(false);
  const { colors } = useAppTheme();

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const openBottomSheet = () => {
    bottomSheetRef.current?.present();
  };

  const closeBottomSheet = () => {
    bottomSheetRef.current?.dismiss();
  };

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={closeBottomSheet}
      />
    ),
    []
  );

  const handleProfileDelete = async () => {
    if (userProfile) {
      await deleteUser({
        userId: userProfile.id,
      });
      handleLogout();
    } else {
      Alert.alert(
        t('profile.delete.error.title'),
        t('profile.delete.error.message'),
      );
    }
  };

  const handleLogout = async () => {
    try {
      await logout({ revokeToken: true });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!userProfile) {
    return <Text>{t('profile.noProfile')}</Text>;
  }

  const onChangeAvatar = openBottomSheet;

  const requestPermissions = async () => {
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
    const mediaStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!cameraStatus.granted || !mediaStatus.granted) {
      Alert.alert(
        t('profile.avatar.camera.permission.title'),
        t('profile.avatar.camera.permission.message'),
      );
      return false;
    }
    return true;
  };

  const onPickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      cameraType: ImagePicker.CameraType.front,
      selectionLimit: 1,
    });

    handleImagePicked(result);
  };

  const onTakePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      aspect: [4, 3],
      cameraType: ImagePicker.CameraType.front,
    });
    handleImagePicked(result);
  };

  const handleImagePicked = async (
    pickerResult: ImagePicker.ImagePickerResult,
  ) => {
    try {
      setIsAvatarUpdating(true);
      if (pickerResult.canceled) {
        Alert.alert(t('profile.avatar.camera.cancel'));
        return;
      } else {
        const image = pickerResult.assets[0];

        if (!image.fileName) return;

        const fileName = image.fileName;
        const contentType = image.mimeType || 'image/image';

        const { url, key } = await generateAvatarUploadURL({
          userId: userProfile.id,
          fileName,
          contentType,
        });

        const response = await fetch(image.uri);
        const fileBlob = await response.blob();
        await uploadToS3(url, fileBlob, contentType);

        await updateUserAvatar({ userId: userProfile.id, avatarKey: key });

        await queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.USERS, userProfile.id],
          exact: true,
        });
      }
    } catch (error) {
      console.error('❌ Error uploading image', error);
      Alert.alert(t('profile.avatar.upload.failed'));
    } finally {
      setIsAvatarUpdating(false);
      closeBottomSheet();
    }
  };

  const onDeleteAvatar = async () => {
    try {
      deleteUserAvatar(
        { userId: userProfile.id },
        {
          onSuccess: async () => {
            await queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.USERS, userProfile.id],
              exact: true,
            });
          },
          onError: () => {
            Alert.alert(
              t('profile.avatar.delete.error.title'),
              t('profile.avatar.delete.error.message'),
            );
          },
        },
      );
    } catch (error) {
      console.error('❌ Error removing avatar', error);
      Alert.alert(t('profile.avatar.delete.failed'));
    } finally {
      closeBottomSheet();
    }
  };

  const handleManageAccount = () => {
    router.push('/(tabs)/manage-account');
  };

  const handleChangePassword = () => {
    console.log('Navigate to Change Password');
  };


  const fullName = `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() || 'John Alexander';
  const email = userProfile.email || 'john.alexander@gmail.com';
  const phoneNumber = userProfile.phoneNumber || '+61 497 841 703';

  return (
    <KeyboardAwareScrollView
      style={[styles.scrollView, { backgroundColor: colors.backgrounds.primary }]}
      contentContainerStyle={styles.scrollContent}
      enableOnAndroid
      enableAutomaticScroll
      extraScrollHeight={100}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        <View style={styles.upperSection}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <View
                style={[
                  styles.avatarWrapper,
                  { borderColor: colors.avatarBorder },
                ]}
              >
                {isAvatarUploading || isAvatarDeleting || isAvatarUpdating ? (
                  <ActivityIndicator />
                ) : (
                  <Avatar uri={userProfile.avatar} size={160} />
                )}
              </View>
              <View style={[styles.cameraButton, { backgroundColor: colors.cameraButton }]}>
                <IconButton
                  icon="camera-outline"
                  size={20}
                  iconColor={colors.white}
                  onPress={onChangeAvatar}
                  disabled={isAvatarUploading || isAvatarDeleting}
                  style={styles.cameraIconButton}
                />
              </View>
            </View>

            <View style={styles.userInfoContainer}>
              <Text style={[styles.userName, { color: colors.text }]}>{fullName}</Text>
              <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{email}</Text>
              <Text style={[styles.userPhone, { color: colors.textSecondary }]}>{phoneNumber}</Text>
            </View>
          </View>

          <View style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <MenuItem
              icon="pencil-outline"
              iconType="material"
              title="Manage Account"
              onPress={handleManageAccount}
            />
            <MenuItem
              icon="information-outline"
              iconType="material"
              title="Change Password"
              onPress={handleChangePassword}
              isLast
            />
          </View>
        </View>

        <View style={styles.lowerSection}>
          <View style={[styles.logoutCard, { backgroundColor: colors.logoutCardBg, borderColor: colors.border }]}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <View style={styles.logoutContent}>
                <MaterialCommunityIcons name="logout" size={18} color={colors.menuItemIcon} />
                <Text style={[styles.logoutText, { color: colors.menuItemIcon }]}>Logout</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.deleteSection}>
        <Button
          mode="outlined"
          onPress={() => {
            Alert.alert(
              'Delete Account',
              'Are you sure you want to delete your account?',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Delete',
                  onPress: () => {
                    handleProfileDelete();
                  },
                  style: 'destructive',
                },
              ],
              { cancelable: true },
            );
          }}
          disabled={isUserDeleting}
          style={[styles.deleteButton, { borderColor: colors.deleteButtonBorder, backgroundColor: colors.deleteButtonBg }]}
          labelStyle={[styles.deleteButtonLabel, { color: colors.deleteButtonBorder }]}
        >
          Delete my account
        </Button>
      </View>

      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={['40%']}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        backgroundStyle={[styles.bottomSheetBackground, { backgroundColor: colors.backgrounds.tertiary }]}
      >
        <BottomSheetView
          style={[styles.bottomSheetView, { backgroundColor: colors.backgrounds.tertiary }]}
        >
              {isAvatarUpdating ? (
                <View>
                  <Dialog.Title
                    style={[styles.dialogTitleSmall, { color: colors.text }]}
                  >
                    {t('profile.avatar.upload.inProgress')}
                  </Dialog.Title>
                  <Dialog.Content
                    style={[styles.dialogContent, { backgroundColor: colors.backgrounds.tertiary }]}
                  >
                    <ActivityIndicator color={colors.primary} />
                    <Text style={[styles.dialogText, { color: colors.text }]}>
                      {t('profile.avatar.upload.pleaseWait')}
                    </Text>
                  </Dialog.Content>
                </View>
              ) : (
                <View>
                  <Dialog.Title
                    style={[styles.dialogTitle, { color: colors.text }]}
                  >
                    {t('profile.avatar.title')}
                  </Dialog.Title>

                  <Dialog.Content style={styles.dialogContentMain}>
                    <View
                      style={[styles.optionsContainer, { backgroundColor: colors.backgrounds.secondary }]}
                    >
                      <Button
                        mode="text"
                        onPress={onTakePhoto}
                        icon={() => <CameraIcon color={colors.text} />}
                        labelStyle={[styles.buttonLabel, { color: colors.text }]}
                        contentStyle={styles.buttonContent}
                      >
                        {t('profile.avatar.takePhoto')}
                      </Button>

                      <View
                        style={[styles.separator, { borderColor: colors.secondary }]}
                      />

                      <Button
                        mode="text"
                        onPress={onPickImage}
                        icon={() => <GalleryIcon color={colors.text} />}
                        labelStyle={[styles.buttonLabel, { color: colors.text }]}
                        contentStyle={styles.buttonContent}
                      >
                        {t('profile.avatar.selectLibrary')}
                      </Button>
                    </View>

                    <View style={styles.deleteAvatarContainer}>
                      <Button
                        mode="contained"
                        onPress={onDeleteAvatar}
                        icon={() => <DeleteIcon color={colors.error} />}
                        labelStyle={[styles.buttonLabel, { color: colors.error }]}
                        style={[styles.deleteAvatarButton, { backgroundColor: colors.backgrounds.secondary }]}
                        contentStyle={styles.buttonContent}
                      >
                        {t('profile.avatar.delete.actions.delete')}
                      </Button>
                    </View>
                  </Dialog.Content>
                </View>
              )}
        </BottomSheetView>
      </BottomSheetModal>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 19,
    paddingTop: 24,
    justifyContent: 'space-between',
  },
  upperSection: {
    gap: 24,
  },
  lowerSection: {
    // Empty for now, just holds the logout card
  },
  profileSection: {
    alignItems: 'center',
    gap: 24,
  },
  avatarContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarWrapper: {
    width: 160,
    height: 160,
    borderRadius: 140,
    borderWidth: 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconButton: {
    margin: 0,
    width: 40,
    height: 40,
  },
  userInfoContainer: {
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
    gap: 4,
  },
  userName: {
    fontSize: 25,
    fontFamily: Fonts.medium,
    lineHeight: 30,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    lineHeight: 20,
    textAlign: 'center',
  },
  userPhone: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    lineHeight: 20,
    textAlign: 'center',
  },
  menuCard: {
    borderRadius: 8,
    borderWidth: 1,
  },
  logoutCard: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  logoutButton: {
    minHeight: 56,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    lineHeight: 28,
  },
  deleteSection: {
    paddingHorizontal: 19,
    paddingTop: 24,
  },
  deleteButton: {
    borderRadius: 8,
    borderWidth: 1.2,
  },
  deleteButtonLabel: {
    fontSize: 16,
    fontFamily: Fonts.medium,
  },
  bottomSheetBackground: {},
  bottomSheetView: {
    flex: 1,
  },
  dialogTitleSmall: {
    fontSize: 16,
    textAlign: 'center',
    padding: 8,
  },
  dialogContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  dialogText: {
    marginTop: 12,
  },
  dialogTitle: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    lineHeight: 28,
    textAlign: 'center',
    padding: 2,
  },
  dialogContentMain: {
    gap: 4,
    paddingBottom: 0,
  },
  optionsContainer: {
    borderRadius: 8,
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
  },
  buttonContent: {
    justifyContent: 'space-between',
    flexDirection: 'row-reverse',
    paddingHorizontal: 16,
  },
  separator: {
    borderBottomWidth: 1,
  },
  deleteAvatarContainer: {
    paddingVertical: 16,
  },
  deleteAvatarButton: {
    borderRadius: 8,
  },
});
