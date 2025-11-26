import SettingsLink from '@/components/SettingsLink';
import SettingsThemeButton from '@/components/SettingsThemeButton';
import { Button, Card } from '@/components/ui';
import Avatar from '@/components/ui/Avatar/Avatar';
import { ThemeScheme } from '@/constants/Colors';
import { ROUTES } from '@/constants/routes';
import { useAppTheme, useThemeContext } from '@/context/ThemeContext';
import { useUserProfileData } from '@/context/UserAuthGuard';
import { useKindeAuth } from '@kinde/expo';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Text } from 'react-native-paper';

export default function SettingsScreen() {
  const { isDark, themeScheme, toggleTheme, handleThemeSchemeSwitch } =
    useThemeContext();
  const { colors } = useAppTheme();
  const userProfile = useUserProfileData();
  const { logout } = useKindeAuth();
  const { t } = useTranslation();


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
            {t('setting.title')}
          </Text>
        </View>
        <View
          style={{
            gap: 24,
            paddingBottom: 20,
          }}
        >
          {userProfile ? (
            <View>
              <View
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    borderRadius: 60,
                    borderWidth: 2,
                    overflow: 'hidden',
                    borderColor: colors.secondaryLight,
                  }}
                >
                  <Avatar uri={userProfile.avatar} size={120}/>
                </View>
              </View>

              <View style={{ marginTop: 16, alignItems: 'center' }}>
                <Text
                  style={{
                    color: colors.text,
                  }}
                  variant="titleLarge"
                >
                  {`${userProfile.firstName} ${userProfile.lastName}`}
                </Text>
                <Text
                  style={{
                    color: colors.text,
                  }}
                  variant="bodyMedium"
                >
                  {userProfile.email || t('setting.messages.noEmail')}
                </Text>
              </View>
            </View>
          ) : (
            <Text>{t('setting.messages.noProfile')}</Text>
          )}
          <Card>
            <View
              style={{
                gap: 8,
                paddingVertical: 12,
              }}
            >
              <SettingsLink
                title={t('setting.items.privacy')}
                icon="shield-sync-outline"
                onPress={() => handleNavigation('privacy')}
              />
              <SettingsLink
                title={t('setting.items.language')}
                icon="earth"
                isLast
                onPress={() => handleNavigation('language')}
              />
            </View>
          </Card>
          <Card>
            <View
              style={{
                gap: 8,
                paddingVertical: 12,
              }}
            >
              <SettingsLink
                title={t('setting.items.help')}
                icon="help-circle-outline"
                onPress={() => handleNavigation('help')}
              />
              <SettingsLink
                title={t('setting.items.about')}
                icon="information-outline"
                onPress={() => handleNavigation('about')}
              />
              <SettingsLink
                title={t('setting.items.feedback')}
                icon="chat-processing-outline"
                isLast
              />
            </View>
          </Card>

          <View>
            <Text
              style={{
                fontSize: 16,
                color: colors.text,
                marginBottom: 12,
              }}
            >
              {t('setting.items.theme.mode.title')}
            </Text>
            <Card>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 8,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 18,
                  paddingVertical: 12,
                  borderRadius: 8,
                  marginVertical: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.text,
                  }}
                >
                  {t('setting.items.theme.mode.darkMode')}
                </Text>
                <Switch value={isDark} onValueChange={toggleTheme} />
              </View>
            </Card>
          </View>

          <View
            style={{
              marginTop: 16,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: colors.text,
                marginBottom: 12,
              }}
            >
              {t('setting.items.theme.scheme.title')}
            </Text>
            <Card>
              <SettingsThemeButton
                title={t('setting.items.theme.scheme.default')}
                icon="theme-light-dark"
                onPress={() => handleThemeSchemeSwitch(ThemeScheme.DEFAULT)}
                isActive={themeScheme === ThemeScheme.DEFAULT}
              />

              <SettingsThemeButton
                title={t('setting.items.theme.scheme.highContrast')}
                icon="contrast-circle"
                onPress={() =>
                  handleThemeSchemeSwitch(ThemeScheme.HIGH_CONTRAST)
                }
                isActive={themeScheme === ThemeScheme.HIGH_CONTRAST}
              />
              <SettingsThemeButton
                title={t('setting.items.theme.scheme.vibrantRed')}
                icon="palette-outline"
                onPress={() => handleThemeSchemeSwitch(ThemeScheme.VIBRANT_RED)}
                isActive={themeScheme === ThemeScheme.VIBRANT_RED}
                isLast
              />
            </Card>
          </View>
          <View>
            <Button icon="logout" onPress={handleLogout} mode="contained">
              {t('setting.actions.logout')}
            </Button>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
  },
});
