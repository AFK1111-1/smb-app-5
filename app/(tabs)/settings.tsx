import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Text, Switch as PaperSwitch } from 'react-native-paper';
import { router } from 'expo-router';
import { useKindeAuth } from '@kinde/expo';
import { useTranslation } from 'react-i18next';
import { useAppTheme, useThemeContext } from '@/context/ThemeContext';
import { useUserProfileData } from '@/context/UserAuthGuard';
import { AppColors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { ROUTES } from '@/constants/routes';
import Avatar from '@/components/ui/Avatar/Avatar';
import { Card, MenuItem, Searchbar } from '@/components/ui';
import { icons } from '@/assets/icons';

export default function SettingsScreen() {
  const { colors } = useAppTheme();
  const { isDark, toggleTheme } = useThemeContext();
  const userProfile = useUserProfileData();
  const { logout } = useKindeAuth();
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const styles = useMemo(() => createStyles(colors), [colors]);

  const handleLogout = async () => {
    try {
      await logout({ revokeToken: true });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleNavigation = (route: string) => {
    router.push(`${ROUTES.SETTINGS}/${route}` as any);
  };

  const handleEditProfile = () => {
    router.push(ROUTES.PROFILE as any);
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <Searchbar
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
        />

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            {/* Avatar */}
            <View style={styles.avatarBorder}>
              <Avatar uri={userProfile?.avatar || null} size={48} />
            </View>

            {/* Name and Email */}
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {userProfile
                  ? `${userProfile.firstName} ${userProfile.lastName}`
                  : 'John Alexander'}
              </Text>
              <Text style={styles.userEmail}>
                {userProfile?.email || 'john.alexander@gmail.com'}
              </Text>
            </View>

            {/* Edit Profile Button */}
            <Pressable
              style={({ pressed }) => [
                styles.editButton,
                pressed && styles.editButtonPressed,
              ]}
              onPress={handleEditProfile}
            >
              <icons.editIcon width={28} height={28} color={colors.text} />
            </Pressable>
          </View>
        </View>

        {/* Menu Card */}
        <View style={styles.menuCard}>
          <View style={styles.menuContainer}>
            <MenuItem
              title="Dark Mode"
              icon="moonIcon"
              showChevron={false}
              rightElement={
                <PaperSwitch
                  value={isDark}
                  onValueChange={toggleTheme}
                  color={colors.primary}
                />
              }
            />

            <MenuItem
              title="Privacy"
              icon="shieldIcon"
              onPress={() => handleNavigation('privacy')}
            />

            <MenuItem
              title="Language"
              icon="globeIcon"
              onPress={() => handleNavigation('language')}
              rightText={i18n.language === 'en-US' ? 'English' : 'German'}
              isLast
            />
          </View>
        </View>

        {/* Additional Options Card */}
        <View style={styles.menuCard}>
          <View style={styles.menuContainer}>
            <MenuItem
              title="Help"
              icon="helpCircleIcon"
              onPress={() => handleNavigation('help')}
            />

            <MenuItem
              title="About"
              icon="infoCircleIcon"
              onPress={() => handleNavigation('about')}
            />

            <MenuItem
              title="Send Feedback"
              icon="chatIcon"
              onPress={() => handleNavigation('feedback')}
              isLast
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    scrollView: {
      flex: 1,
      backgroundColor: colors.backgrounds.primary,
    },
    scrollContent: {
      flexGrow: 1,
    },
    container: {
      flex: 1,
      paddingHorizontal: 15,
      paddingTop: 40,
      paddingBottom: 16,
      gap: 24,
    },
    header: {
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 20,
      fontFamily: Fonts.medium,
      lineHeight: 24,
      color: colors.text,
      textAlign: 'center',
    },
    profileCard: {
      borderRadius: 12,
      backgroundColor: colors.card,
      borderWidth: 3,
      borderColor: colors.secondaryDarker,
      paddingTop: 16,
      paddingBottom: 16,
      paddingHorizontal: 24,
      shadowColor: colors.secondaryLight,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 1,
      shadowRadius: 1,
      elevation: 1,
    },
    menuCard: {
      borderRadius: 12,
      backgroundColor: colors.card,
      borderWidth: 2,
      borderColor: colors.secondaryDarker,
      paddingVertical: 0,
      paddingHorizontal: 0,
      shadowColor: colors.secondaryLight,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 1,
      elevation: 1,
    },
    profileRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    avatarBorder: {
      width: 48,
      height: 48,
      borderRadius: 999,
      borderWidth: 2,
      borderColor: colors.secondaryDarker,
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
    },
    userInfo: {
      flex: 1,
      gap: 0,
    },
    userName: {
      fontSize: 20,
      fontFamily: Fonts.medium,
      lineHeight: 20,
      color: colors.text,
    },
    userEmail: {
      fontSize: 14,
      fontFamily: Fonts.regular,
      lineHeight: 20,
      color: colors.textMuted,
    },
    editButton: {
      width: 40,
      height: 40,
      borderRadius: 10,
      color: colors.text,
      backgroundColor: colors.backgrounds.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    editButtonPressed: {
      opacity: 0.7,
    },
    menuContainer: {
      width: '100%',
    },
  });
