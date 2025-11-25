import { useKindeAuth } from '@kinde/expo';
import { useRouter } from 'expo-router';
import React, { ReactNode, useEffect } from 'react';
import { Text, View } from 'react-native';
import { useAppTheme } from './ThemeContext';
import { ROUTES } from '@/constants/routes';
import ActivityIndicator from '@/components/ui/ActivityIndicator';

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useKindeAuth();
  const router = useRouter();
  const { colors } = useAppTheme();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(ROUTES.ROOT);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator />
        <Text style={{ marginTop: 10, fontSize: 16, color: colors.text }}>
          Checking authentication...
        </Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      fallback || (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
            backgroundColor: colors.background,
          }}
        >
          <ActivityIndicator />
        </View>
      )
    );
  }

  return <>{children}</>;
}
