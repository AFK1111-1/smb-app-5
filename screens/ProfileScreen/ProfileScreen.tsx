import { User, UserUpdateRequest } from '@/types/user';
import { Image } from 'expo-image';
import { Alert, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useForm, Controller } from 'react-hook-form';
import QUERY_KEYS from '@/hooks/api/apiQuertKeys';
import { useRef, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Dialog, Portal, Text } from 'react-native-paper';
import { useAppTheme } from '@/context/ThemeContext';
import {
  QueryClient,
  UseMutateAsyncFunction,
  UseMutateFunction,
} from '@tanstack/react-query';
import { Button, TextInput } from '@/components/ui';
import IconButton from '@/components/ui/IconButton';
import ActivityIndicator from '@/components/ui/ActivityIndicator';
import { TFunction } from 'i18next';
import { uploadToS3 } from '@/utils/uploadToS3';
import Avatar from '@/components/ui/Avatar/Avatar';
import BottomSheet, { BottomSheetModal } from '@/components/ui/BottomSheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DeleteIcon from '@/assets/icons/delete-icon.svg';
import CameraIcon from '@/assets/icons/camera-icon.svg';
import GalleryIcon from '@/assets/icons/upload-image-icon.svg';

type LogoutRequest = { revokeToken: boolean };
type LogoutResult = { success: boolean };

interface ProfileScreenProps {
  userProfile: User;
  queryClient: QueryClient;
  isAvatarUploading: boolean;
  isAvatarDeleting: boolean;
  isUserDeleting: boolean;
  isUserUpdating: boolean;
  t: TFunction<'translation', undefined>;
  logout: (options?: Partial<LogoutRequest>) => Promise<LogoutResult>;
  deleteUser: UseMutateAsyncFunction<
    any,
    Error,
    {
      userId: string;
    },
    unknown
  >;
  updateUserAvatar: any;
  generateAvatarUploadURL: any;
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
  updateCurrentUser: UseMutateFunction<
    any,
    Error,
    {
      userId: string;
      payload: UserUpdateRequest;
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
  isUserUpdating,
  t,
  deleteUser,
  updateUserAvatar,
  generateAvatarUploadURL,
  deleteUserAvatar,
  logout,
  updateCurrentUser,
}: ProfileScreenProps) {
  const [showAvatarPicker, setShowAvatarPicker] = useState<boolean>(false);
  const [isAvatarUpdating, setIsAvatarUpdating] = useState<boolean>(false);
  const { colors } = useAppTheme();

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const openBottomSheet = () => {
    bottomSheetRef.current?.snapToIndex(0);
  };

  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
  };

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
  // Select Image from Library
  const onPickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true, // Enable cropping of image
      aspect: [4, 3],
      quality: 0.7,
      cameraType: ImagePicker.CameraType.front,
      selectionLimit: 1,
    });

    handleImagePicked(result);
  };
  // Take picture using camera
  const onTakePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      aspect: [4, 3],
      cameraType: ImagePicker.CameraType.front, // By Default open front camera
    });
    handleImagePicked(result);
  };

  // Save image as avatar
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

        // 1. Get PresignedURL
        const { url, key } = await generateAvatarUploadURL({
          userId: userProfile.id,
          fileName,
          contentType,
        });

        // 2. Upload to S3
        const response = await fetch(image.uri);
        const fileBlob = await response.blob();
        await uploadToS3(url, fileBlob, contentType);

        // 3. Update user profile with new avatar key
        await updateUserAvatar({ userId: userProfile.id, avatarKey: key });
        // Alert.alert(
        //   t('profile.avatar.upload.success.title'),
        //   t('profile.avatar.upload.success.message'),
        // );

        // 4. Invalidate user query to refetch updated data
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
      setShowAvatarPicker(false);
    }
  };

  // Delete user avatar
  const onDeleteAvatar = async () => {
    try {
      deleteUserAvatar(
        { userId: userProfile.id },
        {
          onSuccess: async () => {
            // Alert.alert(
            //   t('profile.avatar.delete.success.title'),
            //   t('profile.avatar.delete.success.message'),
            // );
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
      setShowAvatarPicker(false);
    }
  };
  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingBottom: 20,
        flexGrow: 1,
      }}
      enableOnAndroid
      enableAutomaticScroll
      extraScrollHeight={100}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <View>
          <Text
            style={{
              color: colors.text,
              textAlign: 'center',
              paddingBottom: 20,
              paddingTop: 20,
            }}
            variant="displaySmall"
          >
            {t('profile.title')}
          </Text>
        </View>
        <View
          style={{
            gap: 16,
            paddingBottom: 20,
          }}
        >
          <View>
            <View>
              <View
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                <View
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                  }}
                >
                  <View
                    style={{
                      position: 'relative',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 150,
                      borderWidth: 2,
                      overflow: 'hidden',
                      borderColor: colors.secondaryLight,
                      width: 150,
                      height: 150,
                    }}
                  >
                    {isAvatarUploading ||
                    isAvatarDeleting ||
                    isAvatarUpdating ? (
                      <ActivityIndicator />
                    ) : (
                      <Avatar uri={userProfile.avatar} size={150} />
                    )}
                  </View>
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      backgroundColor: colors.iconBg,
                      borderRadius: 60,
                      borderWidth: 1,
                      borderColor: colors.secondaryLight,
                      right: 20,
                    }}
                  >
                    <IconButton
                      icon="camera-outline"
                      size={14}
                      iconColor={colors.text}
                      onPress={onChangeAvatar}
                      disabled={isAvatarUploading || isAvatarDeleting}
                      style={{
                        justifyContent: 'center',
                        margin: 0,
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
            {userProfile ? (
              <View style={{ marginTop: 16 }}>
                <EditProfileFrom
                  userProfile={userProfile}
                  queryClient={queryClient}
                  isUserUpdating={isUserUpdating}
                  updateCurrentUser={updateCurrentUser}
                  t={t}
                />
              </View>
            ) : (
              <View>
                <Text>{t('profile.noData')}</Text>
              </View>
            )}
          </View>
        </View>
        <View
          style={{
            marginTop: 'auto',
            paddingBottom: 16,
            paddingTop: 16,
          }}
        >
          <Button
            mode="outlined"
            color="error"
            icon="trash-can-outline"
            disabled={isUserDeleting}
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
          >
            {t('profile.delete.actions.delete')}
          </Button>
        </View>
      </View>

      {/* Change avatar bottom sheet  */}
      <Portal>
        <GestureHandlerRootView>
          <BottomSheet
            snapPoints={['40%']}
            enablePanDownToClose={true}
            showBackdrop={true}
            index={-1}
            ref={bottomSheetRef}
            onOutsidePress={closeBottomSheet}
          >
            <BottomSheet.View
              style={{ backgroundColor: colors.backgrounds.tertiary }}
            >
              {isAvatarUpdating ? (
                <View>
                  <Dialog.Title
                    style={{
                      fontSize: 16,
                      color: colors.text,
                      textAlign: 'center',
                      padding: 8,
                    }}
                  >
                    {t('profile.avatar.upload.inProgress')}
                  </Dialog.Title>
                  <Dialog.Content
                    style={{
                      alignItems: 'center',
                      paddingVertical: 20,
                      backgroundColor: colors.backgrounds.tertiary,
                    }}
                  >
                    <ActivityIndicator color={colors.primary} />
                    <Text style={{ color: colors.text, marginTop: 12 }}>
                      {t('profile.avatar.upload.pleaseWait')}
                    </Text>
                  </Dialog.Content>
                </View>
              ) : (
                <View>
                  <Dialog.Title
                    style={{
                      fontWeight: 700,
                      fontSize: 20,
                      lineHeight: 28,
                      color: colors.text,
                      textAlign: 'center',
                      padding: 2,
                    }}
                  >
                    {t('profile.avatar.title')}
                  </Dialog.Title>

                  <Dialog.Content style={{ gap: 4, paddingBottom: 0 }}>
                    <View
                      style={{
                        backgroundColor: colors.backgrounds.secondary,
                        borderRadius: 8,
                        paddingVertical: 8,
                        // padding: 16,
                      }}
                    >
                      <Button
                        mode="text"
                        onPress={onTakePhoto}
                        icon={() => <CameraIcon color={colors.text} />}
                        labelStyle={{ color: colors.text, fontSize: 16 }}
                        contentStyle={{
                          justifyContent: 'space-between',
                          flexDirection: 'row-reverse',
                          paddingHorizontal: 16,
                        }}
                      >
                        {t('profile.avatar.takePhoto')}
                      </Button>

                      <View
                        style={{
                          borderColor: colors.secondary,
                          borderBottomWidth: 1,
                        }}
                      />

                      <Button
                        mode="text"
                        onPress={onPickImage}
                        icon={() => <GalleryIcon color={colors.text} />}
                        labelStyle={{ color: colors.text, fontSize: 16 }}
                        contentStyle={{
                          justifyContent: 'space-between',
                          flexDirection: 'row-reverse',
                          paddingHorizontal: 16,
                        }}
                      >
                        {t('profile.avatar.selectLibrary')}
                      </Button>
                    </View>

                    <View style={{ paddingVertical: 16 }}>
                      <Button
                        mode="contained"
                        onPress={onDeleteAvatar}
                        icon={() => <DeleteIcon color={colors.error} />}
                        labelStyle={{ color: colors.error, fontSize: 16 }}
                        style={{
                          backgroundColor: colors.backgrounds.secondary,
                          borderRadius: 8,
                        }}
                        contentStyle={{
                          justifyContent: 'space-between',
                          flexDirection: 'row-reverse',
                          paddingHorizontal: 16,
                        }}
                      >
                        {t('profile.avatar.delete.actions.delete')}
                      </Button>
                    </View>
                  </Dialog.Content>
                </View>
              )}
            </BottomSheet.View>
          </BottomSheet>
        </GestureHandlerRootView>
      </Portal>
    </KeyboardAwareScrollView>
  );
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  zipCode: string;
}

interface EditProfileFromProps {
  userProfile: User;
  queryClient: any;
  updateCurrentUser: any;
  isUserUpdating: boolean;
  t: TFunction<'translation', undefined>;
}
function EditProfileFrom({
  userProfile,
  queryClient,
  updateCurrentUser,
  isUserUpdating,
  t,
}: EditProfileFromProps) {
  const userId = userProfile.id;
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      firstName: userProfile.firstName || '',
      lastName: userProfile.lastName || '',
      email: userProfile.email || '',
      phoneNumber: userProfile.phoneNumber || '',
      address: userProfile.address || '',
      city: userProfile.city || '',
      zipCode: userProfile.zipCode || '',
    },
  });

  const onSubmit = async (data: FormData) => {
    const { address, city, email, firstName, lastName, phoneNumber, zipCode } =
      data;

    updateCurrentUser(
      {
        userId: userProfile.id!,
        payload: {
          id: userId,
          address,
          city,
          email,
          firstName,
          lastName,
          phoneNumber,
          zipCode,
        },
      },
      {
        onSuccess: async () => {
          Alert.alert(
            t('profile.update.success.title'),
            t('profile.update.success.message'),
          );
          await queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.USERS, userId],
            exact: true,
          });
        },
        onError: () => {
          Alert.alert(
            t('profile.update.error.title'),
            t('profile.update.error.message'),
          );
        },
      },
    );
  };

  return (
    <View>
      <View style={styles.form}>
        <Controller
          control={control}
          name="firstName"
          rules={{
            required: t('profile.form.firstName.required'),
            minLength: {
              value: 2,
              message: t('profile.form.firstName.minLength'),
            },
          }}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <TextInput
              label={t('profile.form.firstName.label')}
              placeholder={t('profile.form.firstName.placeholder')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              helperText={error?.message}
              error={!!error}
            />
          )}
        />

        <Controller
          control={control}
          name="lastName"
          rules={{
            required: t('profile.form.lastName.required'),
            minLength: {
              value: 2,
              message: t('profile.form.lastName.minLength'),
            },
          }}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <TextInput
              label={t('profile.form.lastName.label')}
              placeholder={t('profile.form.lastName.placeholder')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              helperText={error?.message}
              error={!!error}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          rules={{
            required: t('profile.form.email.required'),
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: t('profile.form.email.invalid'),
            },
          }}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <TextInput
              label={t('profile.form.email.label')}
              placeholder={t('profile.form.email.placeholder')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              helperText={error?.message}
              error={!!error}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />

        <Controller
          control={control}
          name="phoneNumber"
          rules={{
            required: t('profile.form.phoneNumber.required'),
            pattern: {
              value: /^[\+]?[1-9][\d]{0,15}$/,
              message: t('profile.form.phoneNumber.invalid'),
            },
          }}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <TextInput
              label={t('profile.form.phoneNumber.label')}
              placeholder={t('profile.form.phoneNumber.placeholder')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              helperText={error?.message}
              error={!!error}
              keyboardType="phone-pad"
            />
          )}
        />

        <Controller
          control={control}
          name="address"
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <TextInput
              label={t('profile.form.address.label')}
              placeholder={t('profile.form.address.placeholder')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              helperText={error?.message}
              error={!!error}
            />
          )}
        />

        <Controller
          control={control}
          name="city"
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <TextInput
              label={t('profile.form.city.label')}
              placeholder={t('profile.form.city.placeholder')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              helperText={error?.message}
              error={!!error}
            />
          )}
        />

        <Controller
          control={control}
          name="zipCode"
          rules={{
            pattern: {
              value: /^\d{5}(-\d{4})?$/,
              message: t('profile.form.zipCode.invalid'),
            },
          }}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <TextInput
              label={t('profile.form.zipCode.label')}
              placeholder={t('profile.form.zipCode.placeholder')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              helperText={error?.message}
              error={!!error}
              keyboardType="numeric"
            />
          )}
        />
        <View style={{ marginTop: 24 }}>
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={isUserUpdating}
          >
            {t('profile.form.actions.save')}
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'scroll',
    paddingHorizontal: 16,
  },
  form: {
    gap: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: '#007bff',
  },
  resetButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#dc3545',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});
