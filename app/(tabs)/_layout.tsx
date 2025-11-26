import AuthGuard from '@/context/AuthGuard';
import SafeScreen from '@/components/SafeScreen';
import UserAuthGuard from '@/context/UserAuthGuard';
import UserOnBoardingGuard from '@/context/UserOnBoardingGuard';
import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';
import AppIcon from '@/components/ui/AppIcon/AppIcon';
import { IconName } from '@/assets/icons';

type TabConfig = {
  name: string;
  title: string;
  icon: IconName;
};
const tabsConfig: TabConfig[] = [
  {
    name: 'index',
    title: 'Home',
    icon: 'homeOutlinedIcon',
  },
  {
    name: 'settings',
    title: 'Settings',
    icon: 'settingsIcon',
  },
  {
    name: 'notifications',
    title: 'Messages',
    icon: 'messageOutlinedIcon',
  },
  {
    name: 'profile',
    title: 'Profile',
    icon: 'profileIcon',
  },
];

export default function TabLayout() {
  const { colors } = useAppTheme();

  return (
    <AuthGuard>
      <UserAuthGuard>
        <UserOnBoardingGuard>
          <SafeScreen
            topBackgroundColor={colors.background}
            bottomBackgroundColor={colors.tabCardBg}
            backgroundColor={colors.background}
          >
            <Tabs
              screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.textSecondary,
                tabBarInactiveTintColor: colors.text,
                tabBarShowLabel: false,
                tabBarStyle: {
                  backgroundColor: colors.tabCardBg,
                  paddingTop: 16,
                  borderColor: '#444D5B',
                },
                sceneStyle: {
                  backgroundColor: colors.background,
                  paddingHorizontal: 16,
                },
              }}
            >
              {tabsConfig.map((tab) => (
                <Tabs.Screen
                  key={tab.name}
                  name={tab.name}
                  options={{
                    title: tab.title,
                    tabBarIcon: ({ color, focused }) => (
                      <View
                        style={{
                          height: 52,
                          width: 52,
                          paddingVertical: 16,
                          gap: 10,
                        }}
                      >
                        <AppIcon
                          name={tab.icon}
                          size={28}
                          label={tab.title}
                          color={focused ? colors.primary : colors.secondary}
                        />
                      </View>
                    ),
                  }}
                />
              ))}
            </Tabs>
          </SafeScreen>
        </UserOnBoardingGuard>
      </UserAuthGuard>
    </AuthGuard>
  );
}
