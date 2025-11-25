import ToggleTheme from '@/components/ToggleTheme/ToggleTheme';
import ThemeProvider from '@/context/ThemeContext';
import { KindeAuthProvider } from '@kinde/expo';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Constants from 'expo-constants';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import '@/i18n';
import { NotificationProvider } from '@/context/NotificationProvider';
import { setupGlobalTextStyles } from '@/config/globalTextConfig';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Setup global text styles to use Inter font family
setupGlobalTextStyles();

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

  const [fontsLoaded, fontError] = useFonts({
    Inter_300Light: require('../assets/fonts/Inter-Light.ttf'),
    Inter_400Regular: require('../assets/fonts/Inter-Regular.ttf'),
    Inter_500Medium: require('../assets/fonts/Inter-Medium.ttf'),
    Inter_600SemiBold: require('../assets/fonts/Inter-SemiBold.ttf'),
    Inter_700Bold: require('../assets/fonts/Inter-Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Prevent rendering until the font has loaded or an error was returned
  if (!fontsLoaded && !fontError) {
    return null;
  }

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
            <GestureHandlerRootView style={{ flex: 1 }}>
              <BottomSheetModalProvider>
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
              </BottomSheetModalProvider>
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
