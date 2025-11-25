import { User, UserUpdateRequest } from '@/types/user';
import { Alert, StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import QUERY_KEYS from '@/hooks/api/apiQuertKeys';
import { Text } from 'react-native-paper';
import { useAppTheme } from '@/context/ThemeContext';
import { Fonts } from '@/constants/Fonts';
import { AppColors } from '@/constants/Colors';
import { QueryClient, UseMutateFunction } from '@tanstack/react-query';
import { TFunction } from 'i18next';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import CountryPicker from '@/components/CountryPicker';
import { Country, getCountryByCode } from '@/constants/countries';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CustomInput, Button } from '@/components/ui';


interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
}

interface ManageAccountScreenProps {
  userProfile: User;
  queryClient: QueryClient;
  updateCurrentUser: UseMutateFunction<
    User,
    Error,
    {
      userId: string;
      payload: UserUpdateRequest;
    },
    unknown
  >;
  isUserUpdating: boolean;
  t: TFunction<'translation', undefined>;
}

export default function ManageAccountScreen({
  userProfile,
  queryClient,
  updateCurrentUser,
  isUserUpdating,
  t,
}: ManageAccountScreenProps) {
  const { colors } = useAppTheme();
  const userId = userProfile.id;
  const [isCountryPickerVisible, setIsCountryPickerVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    getCountryByCode('AU') || { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' }
  );

  const { control, handleSubmit } = useForm<FormData>({
    mode: 'onBlur',
    defaultValues: {
      fullName: `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim(),
      email: userProfile.email || '',
      phoneNumber: userProfile.phoneNumber || '',
    },
  });

  const onSubmit = async (data: FormData) => {
    const { email, fullName, phoneNumber } = data;

    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    updateCurrentUser(
      {
        userId: userProfile.id!,
        payload: {
          id: userId,
          email,
          firstName,
          lastName,
          phoneNumber,
          address: userProfile.address!,
          city: userProfile.city!,
          zipCode: userProfile.zipCode!,
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
          router.push('/(tabs)/profile');
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

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            console.log('Account deletion requested');
          },
        },
      ],
    );
  };

  const styles = createStyles(colors);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <View style={styles.mainContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={24}
            color={colors.secondaryDark}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Account</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.formCard}>
            <View style={styles.form}>
              <Controller
                key="fullName"
                control={control}
                name="fullName"
                rules={{
                  required: 'Full name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters',
                  },
                }}
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Full Name</Text>
                    <CustomInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Please enter your full name"
                      placeholderTextColor={colors.textSecondary}
                      style={[
                        styles.customInput,
                        error && styles.customInputError
                      ]}
                    />
                  </View>
                )}
              />

              <Controller
                key="email"
                control={control}
                name="email"
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                }}
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Email</Text>
                    <CustomInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Please enter your email"
                      placeholderTextColor={colors.textSecondary}
                      style={[
                        styles.customInput,
                        error && styles.customInputError
                      ]}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                )}
              />

              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Phone</Text>
                <View style={styles.phoneRow}>
                  <TouchableOpacity
                    style={styles.countryCodeContainer}
                    onPress={() => setIsCountryPickerVisible(true)}
                  >
                    <Text style={styles.flagEmoji}>{selectedCountry.flag}</Text>
                    <Text style={styles.countryCodeText}>{selectedCountry.dialCode}</Text>
                    <MaterialCommunityIcons
                      name="chevron-down"
                      size={16}
                      color={colors.text}
                    />
                  </TouchableOpacity>

                  <Controller
                    key="phoneNumber"
                    control={control}
                    name="phoneNumber"
                    rules={{
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[\+]?[1-9][\d]{0,15}$/,
                        message: 'Invalid phone number',
                      },
                    }}
                    render={({
                      field: { onChange, onBlur, value },
                      fieldState: { error },
                    }) => (
                      <CustomInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Please enter your phone number"
                        placeholderTextColor={colors.textSecondary}
                        containerStyle={{ flex: 1 }}
                        style={[
                          styles.phoneInput,
                          error && styles.customInputError
                        ]}
                        keyboardType="phone-pad"
                      />
                    )}
                  />
                </View>
              </View>
            </View>

            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              disabled={isUserUpdating}
              style={styles.saveButton}
              labelStyle={styles.saveButtonText}
            >
              {isUserUpdating ? 'Saving...' : 'Save'}
            </Button>
          </View>

          <Button
            mode="outlined"
            onPress={handleDeleteAccount}
            style={styles.deleteButton}
            labelStyle={styles.deleteButtonText}
          >
            Delete my account
          </Button>
        </View>
      </ScrollView>

      <CountryPicker
        visible={isCountryPickerVisible}
        onClose={() => setIsCountryPickerVisible(false)}
        onSelect={(country) => setSelectedCountry(country)}
        selectedCountry={selectedCountry}
      />
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.backgrounds.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 17,
    height: 64,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.backgrounds.secondary,
  },
  headerTitle: {
    fontSize: 15,
    fontFamily: Fonts.medium,
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 19,
    paddingTop: 14,
    justifyContent: 'space-between',
  },
  formCard: {
    gap: 40,
  },
  form: {
    gap: 4,
  },
  fieldContainer: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: colors.text,
    paddingVertical: 8,
  },
  customInput: {
    backgroundColor: colors.inputBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    minHeight: 48,
    color: colors.text,
  },
  customInputError: {
    borderColor: colors.error,
  },
  phoneRow: {
    flexDirection: 'row',
    gap: 8,
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.inputBackground,
    gap: 8,
    minWidth: 110,
  },
  flagEmoji: {
    fontSize: 16,
  },
  countryCodeText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: Fonts.regular,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: colors.inputBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    minHeight: 48,
    color: colors.text,
  },
  saveButton: {
    borderRadius: 8,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.17,
    shadowRadius: 0,
    elevation: 4,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: colors.white,
  },
  deleteButton: {
    borderRadius: 8,
    borderWidth: 1.2,
    borderColor: colors.deleteButtonBorder,
    backgroundColor: colors.deleteButtonBg,
    marginBottom: 32,
    marginTop: 16,
  },
  deleteButtonText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: colors.deleteButtonBorder,
  },
});
