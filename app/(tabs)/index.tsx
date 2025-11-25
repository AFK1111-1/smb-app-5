import { useUserProfileData } from '@/context/UserAuthGuard';
import { AppColors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
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
import CardBackground from '@/assets/images/dashboard/card-background.svg';
import TopLayer from '@/assets/images/dashboard/top-layer.svg';
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
        swirl: <DashboardSwirlOne style={styles.swirlOne} />,
      },
      {
        title: t('home.quickActions.items.workSmart.title'),
        subTitle: t('home.quickActions.items.workSmart.subTitle'),
        image: <WorkSmartIcon />,
        swirl: <DashboardSwirlTwo style={styles.swirlTwo} />,
      },
      {
        title: t('home.quickActions.items.protectMatters.title'),
        subTitle: t('home.quickActions.items.protectMatters.subTitle'),
        image: <BuiltInProtectionIcon />,
        swirl: <DashboardSwirlThree style={styles.swirlThree} />,
      },
    ],
    [t, styles],
  );
  return (
    <KeyboardAwareScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContent}
      enableOnAndroid
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        {/* Multi-layered Welcome Card */}
        <View style={styles.cardContainer}>
          {/* Purple Base Layer */}
          <View style={styles.cardBaseLayer} />

          {/* Red Middle Layer */}
          <View style={styles.cardMiddleLayer} />

          {/* White Top Layer with Content */}
          <View style={styles.cardTopLayer}>
            {/* Background Image */}
            <View style={styles.cardBackground}>
              <TopLayer width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
            </View>

            {/* Hello John Text */}
            <Text style={styles.greeting}>
              {t('home.hero.title', { name: userProfile.firstName })}
            </Text>

            {/* Welcome back Text */}
            <Text style={styles.welcomeBack}>
              {t('home.hero.secondaryTitle')}
            </Text>

            {/* Description Text */}
            <Text style={styles.cardDescription}>
              {t('home.quickActions.title')}
            </Text>
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.itemsRow}>
            {items.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.wrapper}
                onPress={() => {
                  Alert.alert(item.title, 'This feature is coming soon 🚀');
                }}
              >
                <View style={styles.itemContent}>
                  {item.swirl}
                  <Text style={styles.itemSubTitle}>{item.subTitle}</Text>
                  <Text style={styles.itemTitle}>{item.title}</Text>
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
    scrollView: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollViewContent: {
      paddingBottom: 48,
    },
    container: {
      flex: 1,
      padding: 16,
      gap: 24,
    },
    swirlOne: {
      position: 'absolute',
      left: 50,
      top: 70,
      zIndex: 0,
    },
    swirlTwo: {
      position: 'absolute',
      left: 125,
      top: 70,
      zIndex: 0,
    },
    swirlThree: {
      position: 'absolute',
      left: 0,
      top: 65,
      zIndex: 0,
    },
    itemsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: 0,
      marginTop: -16,
      gap: 16,
    },
    itemContent: {
      justifyContent: 'center',
      maxWidth: 200,
    },
    itemSubTitle: {
      fontFamily: Fonts.regular,
      fontSize: 12,
      lineHeight: 20,
      color: colors.text,
    },
    itemTitle: {
      fontFamily: Fonts.medium,
      fontSize: 20,
      lineHeight: 24,
      color: colors.text,
    },
    cardContainer: {
      position: 'relative',
      width: '100%',
      height: 221,
      marginTop: 40,
    },
    cardBaseLayer: {
      position: 'absolute',
      bottom: 0,
      left: '10%',
      right: '10%',
      top: '26%',
      backgroundColor: colors.cardLayerBase,
      borderRadius: 10,
      shadowColor: 'rgba(54, 41, 183, 0.07)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 30,
      elevation: 4,
    },
    cardMiddleLayer: {
      position: 'absolute',
      top: '16%',
      bottom: '4%',
      left: '6%',
      right: '6%',
      backgroundColor: colors.cardLayerMiddle,
      borderRadius: 10,
      shadowColor: 'rgba(54, 41, 183, 0.07)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 30,
      elevation: 5,
    },
    cardTopLayer: {
      position: 'absolute',
      top: 0,
      bottom: '8%',
      left: 0,
      right: 0,
      backgroundColor: colors.primary,
      borderRadius: 10,
      shadowColor: 'rgba(54, 41, 183, 0.07)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 30,
      elevation: 6,
      overflow: 'hidden',
    },
    cardBackground: {
      position: 'absolute',
      top: '-13%',
      bottom: '-17%',
      left: '-9%',
      right: '-9%',
    },
    greeting: {
      position: 'absolute',
      top: '29%',
      left: '6%',
      right: '48%',
      fontFamily: Fonts.medium,
      fontSize: 20,
      lineHeight: 20,
      color: colors.cardTextLight,
    },
    welcomeBack: {
      position: 'absolute',
      top: '43%',
      left: '6%',
      right: '35%',
      fontFamily: Fonts.medium,
      fontSize: 20,
      lineHeight: 20,
      color: colors.cardTextLight,
    },
    cardDescription: {
      position: 'absolute',
      top: '59%',
      left: '6%',
      right: '9%',
      fontFamily: Fonts.regular,
      fontSize: 12,
      lineHeight: 14,
      color: colors.cardTextLightest,
    },
    wrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
      paddingHorizontal: 21,
      gap: 16,
      borderRadius: 12,
      backgroundColor: colors.card,
      width: '100%',
      boxShadow: colors.shadow,
    },
    title: {
      fontFamily: Fonts.semiBold,
      fontSize: 48,
      color: colors.text,
      textAlign: 'left',
    },
    infoText: {
      fontFamily: Fonts.medium,
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
