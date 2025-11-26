import { useUserProfileData } from '@/context/UserAuthGuard';
import { AppColors } from '@/constants/Colors';
import { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAppTheme } from '@/context/ThemeContext';
import { Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import DesignSystemIcon from '@/assets/images/dashboard/design_system.svg';
import WorkSmartIcon from '@/assets/images/dashboard/work_smart.svg';
import BuiltInProtectionIcon from '@/assets/images/dashboard/builtin_protection.svg';
import DashboardSwirlOne from '@/assets/images/dashboard/dashboard-swirl-1.svg';
import DashboardSwirlTwo from '@/assets/images/dashboard/dashboard-swirl-2.svg';
import DashboardSwirlThree from '@/assets/images/dashboard/dashboard-swirl-3.svg';
import notificationService from '@/services/notificationService';

export default function HomeScreen() {
  const { colors } = useAppTheme();
  const userProfile = useUserProfileData();
  const { t } = useTranslation();

  useEffect(() => {
    let unsubscribe: () => void;

    const init = async () => {
      // TODO: send `token` to your backend here
      await notificationService.getFCMToken();

      // Subscribe to token refresh
      unsubscribe = notificationService.onTokenRefresh((newToken) => {
        console.log('Token refreshed:', newToken);
        // TODO: send newToken to your backend
      });
    };

    init();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const styles = useMemo(() => createStyles(colors), [colors]);
  const items = useMemo(
    () => [
      {
        title: t('home.quickActions.items.designSystem.title'),
        subTitle: t('home.quickActions.items.designSystem.subTitle'),
        image: <DesignSystemIcon />,
        swirl: (
          <DashboardSwirlOne
            style={{
              position: 'absolute',
              left: 50,
              top: 70,
              zIndex: 0,
            }}
          />
        ),
      },
      {
        title: t('home.quickActions.items.workSmart.title'),
        subTitle: t('home.quickActions.items.workSmart.subTitle'),
        image: <WorkSmartIcon />,
        swirl: (
          <DashboardSwirlTwo
            style={{
              position: 'absolute',
              left: 125,
              top: 70,
              zIndex: 0,
            }}
          />
        ),
      },
      {
        title: t('home.quickActions.items.protectMatters.title'),
        subTitle: t('home.quickActions.items.protectMatters.subTitle'),
        image: <BuiltInProtectionIcon />,
        swirl: (
          <DashboardSwirlThree
            style={{
              position: 'absolute',
              left: 0,
              top: 65,
              zIndex: 0,
            }}
          />
        ),
      },
    ],
    [t],
  );
  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingBottom: 48,
      }}
      enableOnAndroid
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <View
          style={{
            width: '100%',
            top: 40,
          }}
        >
          <Text style={styles.title}>
            {t('home.hero.title', { name: userProfile.firstName })}
          </Text>

          <Text variant="bodyMedium" style={styles.infoText}>
            {t('home.hero.secondaryTitle')}
          </Text>
        </View>
        <View style={styles.section}>
          <View
            style={{
              marginBottom: 16,
            }}
          >
            <Text variant="headlineSmall" style={styles.sectionTitle}>
              {t('home.quickActions.title')}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginHorizontal: -8,
              marginTop: -16,
              gap: 16,
            }}
          >
            {items.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.wrapper}
                onPress={() => {
                  Alert.alert(item.title, 'This feature is coming soon 🚀');
                }}
              >
                <View
                  style={{
                    justifyContent: 'center',
                    maxWidth: 200,
                  }}
                >
                  {item.swirl}
                  <Text
                    style={{
                      fontWeight: 400,
                      fontSize: 12,
                      lineHeight: 20,
                      color: colors.text,
                    }}
                  >
                    {item.subTitle}
                  </Text>
                  <Text
                    style={{
                      fontWeight: 500,
                      fontSize: 20,
                      lineHeight: 24,
                      color: colors.text,
                    }}
                  >
                    {item.title}
                  </Text>
                </View>
                <View>{item.image}</View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      gap: 72,
    },
    wrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
      paddingHorizontal: 21,
      gap: 16,
      borderRadius: 12,
      backgroundColor: colors.backgrounds.tertiary,
      width: '100%',
      boxShadow: colors.shadow,
    },
    title: {
      fontWeight: 600,
      fontSize: 48,
      color: colors.text,
      textAlign: 'left',
    },
    infoText: {
      fontWeight: 500,
      fontSize: 20,
      color: colors.text,
      marginTop: 12,
    },
    section: {
      marginTop: 16,
      gap: 16,
    },
    sectionTitle: {
      color: colors.text,
      textAlign: 'left',
      marginBottom: 4,
    },
  });
