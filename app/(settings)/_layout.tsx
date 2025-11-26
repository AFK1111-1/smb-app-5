import HeaderBackButton from '@/components/HeaderBackButton';
import SafeScreen from '@/components/SafeScreen';
import { useAppTheme } from '@/context/ThemeContext';
import { Stack, router } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function SettingsLayout() {
  const { colors } = useAppTheme();
const {t} = useTranslation()
  return (
    <SafeScreen>
      <Stack
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerShadowVisible: false,
          headerTitleAlign: 'left',
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 24,
          },
          headerBackVisible: false,
          headerLeft: () => <HeaderBackButton onPress={() => router.back()} />,
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="privacy"
          options={{ title: t("setting.privacy.title"), headerTitleAlign: 'left' }}
        />
        <Stack.Screen
          name="about"
          options={{ title: t('setting.about.title'), headerTitleAlign: 'left' }}
        />
        <Stack.Screen
          name="help"
          options={{
            title: t('setting.help.title'),
            headerTitleAlign: 'left',
          }}
        />
        <Stack.Screen
          name="language"
          options={{
            title: t("setting.languageSwitch.title"),
            headerTitleAlign: 'left',
          }}
        />
        {/* <Stack.Screen name="privacy" options={{ title: "Privacy & Security" }} />
      <Stack.Screen name="language" options={{ title: "Language" }} />
      <Stack.Screen name="help" options={{ title: "Help Center" }} />
      <Stack.Screen name="feedback" options={{ title: "Send Feedback" }} /> */}
      </Stack>
    </SafeScreen>
  );
}
