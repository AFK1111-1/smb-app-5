import React from 'react';
import { Button } from '@/components/ui';
import { AppColors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';
import { Fonts } from '@/constants/Fonts';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, Pressable } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Text } from 'react-native-paper';
import { router } from 'expo-router';

export default function NotificationsScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();

  const styles = useMemo(() => createStyles(colors), [colors]);

  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  const { today, yesterday, older } =
    categorizeNotifications(notificationsArray);

  return (
    <KeyboardAwareScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContent}
      enableOnAndroid
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        {/* Need to add a Back Button? */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Notifications
          </Text>
        </View>

        <View style={styles.tabContainer}>
          <Button
            onPress={() => setActiveTab('all')}
            style={styles.tabButton}
            buttonColor={activeTab === 'all' ? colors.primary : colors.elevation.level0}
            textColor={activeTab === 'all' ? colors.white : colors.secondary}
            labelStyle={styles.tabText}
            contentStyle={styles.contentStyle}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === 'all' ? colors.white : colors.secondary,
                },
              ]}
              variant="bodySmall"
            >
              {t('notifications.tabs.all')}
            </Text>
          </Button>
          <Button
            onPress={() => setActiveTab('unread')}
            style={[styles.tabButton]}
            buttonColor={activeTab === 'unread' ? colors.primary : colors.elevation.level0}
            textColor={activeTab === 'unread' ? colors.white : colors.secondary}
            labelStyle={styles.tabText}
            contentStyle={styles.contentStyle}
          >
            <Text
              variant="bodySmall"
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === 'unread' ? colors.white : colors.secondary,
                },
              ]}
            >
              {t('notifications.tabs.unread')}
            </Text>
          </Button>
        </View>

        <View style={styles.tabContent}>
          {activeTab === 'all' ? (
            <>
              <>
                {today.length > 0 && (
                  <View style={styles.section}>
                    <Text variant="labelLarge" style={styles.sectionTitle}>
                      {t('notifications.sections.today')}
                    </Text>
                    {today.map((n) => (
                      <NotificationItem key={n.id} {...n} />
                    ))}
                  </View>
                )}
                {yesterday.length > 0 && (
                  <View style={styles.section}>
                    <Text variant="labelLarge" style={styles.sectionTitle}>
                      {t('notifications.sections.yesterday')}
                    </Text>
                    {yesterday.map((n) => (
                      <NotificationItem key={n.id} {...n} />
                    ))}
                  </View>
                )}
                {older.length > 0 && (
                  <View style={styles.section}>
                    <Text variant="labelLarge" style={styles.sectionTitle}>
                      {t('notifications.sections.older')}
                    </Text>
                    {older.map((n) => (
                      <NotificationItem key={n.id} {...n} />
                    ))}
                  </View>
                )}
              </>
            </>
          ) : (
            <View style={styles.section}>
              {notificationsArray.length > 0 ? (
                <>
                  {notificationsArray
                    .filter((n) => !n.isRead)
                    .map((n) => (
                      <NotificationItem key={n.id} {...n} />
                    ))}
                </>
              ) : (
                <Text variant="bodyLarge">{t('notifications.empty')}</Text>
              )}
            </View>
          )}
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const NotificationItem = ({
  title,
  description,
  createdAt,
  notificationType,
  isRead,
}: Notification) => {
  const { colors } = useAppTheme();

  const styles = useMemo(() => createStyles(colors), [colors]);
  const iconMap: Record<
    NotificationType,
    keyof typeof MaterialCommunityIcons.glyphMap
  > = {
    message: 'message-text',
    profile: 'account-circle',
  };

  return (
    <View style={styles.notificationRow}>
      <View style={styles.notificationRowContent}>
        {/* Icon Container */}
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={iconMap[notificationType]}
            size={24}
            color={isRead ? colors.textSecondary : colors.primary}
          />
        </View>

        {/* Content */}
        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <Text style={[styles.settingTitle, { color: colors.text }]}>
              {title}
            </Text>
            <Text style={[styles.settingTime, { color: colors.textSecondary }]}>
              {formatTime(createdAt)}
            </Text>
          </View>
          {description && (
            <Text
              style={[styles.settingDescription, { color: colors.textSecondary }]}
            >
              {description}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    scrollView: {
      flex: 1,
      backgroundColor: colors.backgrounds.primary,
    },
    scrollViewContent: {
      paddingBottom: 20,
    },
    container: {
      flex: 1,
      paddingHorizontal: 18,
      paddingTop: 41,
      gap: 24,
    },
    notificationRowContent: {
      flexDirection: 'row',
      gap: 8,
      alignItems: 'flex-start',
    },
    iconContainer: {
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    notificationContent: {
      flex: 1,
      gap: 6,
    },
    notificationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      padding: 8,
      borderRadius: 38,
    },
    backButtonPressed: {
      opacity: 0.7,
    },
    headerTitle: {
      fontSize: 20,
      fontFamily: Fonts.medium,
      lineHeight: 24,
      textAlign: 'center',
      flex: 1,
    },
    section: {
      gap: 16,
    },
    sectionTitle: {
      fontSize: 15,
      fontFamily: Fonts.medium,
      lineHeight: 20,
      color: colors.text,
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    settingTitle: {
      fontSize: 15,
      fontFamily: Fonts.medium,
      lineHeight: 20,
    },
    settingDescription: {
      fontSize: 13,
      fontFamily: Fonts.light,
      lineHeight: 14,
      marginTop: 6,
    },
    notificationRow: {
      backgroundColor: colors.card,
      borderRadius: 8,
      borderWidth: 0.5,
      borderColor: colors.cardBorder,
      paddingLeft: 10,
      paddingRight: 16,
      paddingVertical: 16,
    },
    settingTime: {
      fontSize: 10,
      fontStyle: 'italic',
      lineHeight: 20,
    },
    tabContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      gap: 0,
    },
    tabText: {
      fontSize: 14,
    },
    tabButton: {
      borderRadius: 35,
    },
    tabContent: {
      gap: 24,
    },
    contentStyle: {
      paddingVertical: 4,
      paddingHorizontal: 20,
    },
  });

type NotificationType = 'profile' | 'message';

interface Notification {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  isRead: boolean;
  notificationType: NotificationType;
}

const notificationsArray: Notification[] = [
  {
    id: '1',
    title: 'New message from Alice',
    description: 'Hey, are you available tomorrow?',
    createdAt: '2025-06-18T10:00:00Z',
    isRead: false,
    notificationType: 'message',
  },
  {
    id: '2',
    title: 'Profile updated successfully',
    description: 'Your profile info was changed',
    createdAt: '2025-06-17T08:30:00Z',
    isRead: true,
    notificationType: 'profile',
  },
  {
    id: '3',
    title: 'New message from Bob',
    description: 'Check out this update',
    createdAt: '2025-06-16T12:00:00Z',
    isRead: false,
    notificationType: 'message',
  },
  {
    id: '4',
    title: 'Email changed',
    description: 'You changed your email to john@example.com',
    createdAt: '2025-06-15T14:00:00Z',
    isRead: true,
    notificationType: 'profile',
  },
];

function formatTime(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString();
}

function categorizeNotifications(all: Notification[]) {
  const today: Notification[] = [];
  const yesterday: Notification[] = [];
  const older: Notification[] = [];

  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(todayStart.getDate() - 1);

  all.forEach((n) => {
    const created = new Date(n.createdAt);
    if (created >= todayStart) {
      today.push(n);
    } else if (created >= yesterdayStart) {
      yesterday.push(n);
    } else {
      older.push(n);
    }
  });

  return { today, yesterday, older };
}
