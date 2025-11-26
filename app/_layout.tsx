import ToggleTheme from '@/components/ToggleTheme/ToggleTheme';
import ThemeProvider from '@/context/ThemeContext';
import { KindeAuthProvider } from '@kinde/expo';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Constants from 'expo-constants';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import '@/i18n';
import { NotificationProvider } from '@/context/NotificationProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function RootLayout() {
  const kindeDomain = Constants.expoConfig?.extra?.kindeDomain;
  const kindeClientId = Constants.expoConfig?.extra?.kindeClientId;
  const kindeScopes = Constants.expoConfig?.extra?.kindeScopes;
  return (
    <QueryClientProvider client={queryClient}>
      <KindeAuthProvider
        config={{
          domain: kindeDomain,
          clientId: kindeClientId,
          scopes: kindeScopes,
        }}
        callbacks={
          {
            // optional
          }
        }
      >
        <NotificationProvider>
          <ThemeProvider>
            <GestureHandlerRootView>
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="(root)/index"
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="+not-found" />
              </Stack>
            </GestureHandlerRootView>
          </ThemeProvider>
        </NotificationProvider>
      </KindeAuthProvider>
    </QueryClientProvider>
  );
}

let AppEntryPoint = RootLayout;

if (process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true') {
  const StorybookUIRoot = require('../.rnstorybook').default;
  AppEntryPoint = function StorybookRoot() {
    return (
      <ThemeProvider>
        <StorybookUIRoot />
        <ToggleTheme />
      </ThemeProvider>
    );
  };
}

export default AppEntryPoint;
