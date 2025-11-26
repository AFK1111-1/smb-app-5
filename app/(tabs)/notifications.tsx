import React from 'react';
import { Button } from '@/components/ui';
import { AppColors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Text } from 'react-native-paper';

export default function NotificationsScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();

  const styles = useMemo(() => createStyles(colors), [colors]);

  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  const { today, yesterday, older } =
    categorizeNotifications(notificationsArray);

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingBottom: 20,
      }}
      enableOnAndroid
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <View style={styles.tabContainer}>
          <Button
            onPress={() => setActiveTab('all')}
            style={styles.tabButton}
            buttonColor={activeTab === 'all' ? colors.primary : colors.white}
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
            buttonColor={activeTab === 'unread' ? colors.primary : colors.white}
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
    <View
      style={[
        styles.notificationRow,
        { backgroundColor: colors.secondaryDarker },
      ]}
    >
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          gap: 12,
          alignItems: 'flex-start',
        }}
      >
        <MaterialCommunityIcons
          name={iconMap[notificationType]}
          size={24}
          color={isRead ? colors.text : colors.primary}
        />
        <View style={{ flex: 1, flexDirection: 'row', gap: 4 }}>
          <View style={{ flex: 1 }}>
            <Text
              variant="bodyLarge"
              style={[styles.settingTitle, { color: colors.text }]}
            >
              {title}
            </Text>
            {description && (
              <Text
                variant="bodyMedium"
                style={[
                  styles.settingDescription,
                  { color: colors.textSecondary },
                ]}
              >
                {description}
              </Text>
            )}
          </View>
          <View>
            <Text
              variant="labelSmall"
              style={[styles.settingTime, { color: colors.textSecondary }]}
            >
              {formatTime(createdAt)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// TODO:: REMOVE ANY
const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      gap: 32,
      marginTop: 16,
    },
    section: {
      gap: 12,
    },
    sectionTitle: {
      marginBottom: 8,
      color: colors.text,
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    settingTitle: {
      marginBottom: 8,
    },
    settingDescription: {
      marginTop: 2,
      opacity: 0.9,
    },
    notificationRow: {
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    settingTime: {
      marginTop: 2,
      opacity: 0.7,
      fontStyle: 'italic',
    },
    tabContainer: {
      flexDirection: 'row',
      marginBottom: 8,
      justifyContent: 'flex-start',
      gap: 8,
    },
    tabText: {
      fontSize: 14,
    },
    tabButton: {
      borderRadius: 35,
    },
    tabContent: {
      gap: 32,
    },
    contentStyle: {
      paddingVertical: 0,
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
