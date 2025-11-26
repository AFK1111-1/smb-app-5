import LoadingScreen from '@/components/FullScreenLoader';
import { Button } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { useKindeAuth } from '@kinde/expo';
import Constants from 'expo-constants';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import 'react-native-gesture-handler';

export default function GetStartNow() {
  const { isAuthenticated, login, isLoading } = useKindeAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(ROUTES.MAIN_TABS);
    }
  }, [isAuthenticated]);

  const handleGetStartedPress = useCallback(
    () =>
      login({
        audience: Constants.expoConfig?.extra?.kindeAudience,
      }),
    [login],
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <LoadingScreen />
      </View>
    );
  }
  if (isAuthenticated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <LoadingScreen />
      </View>
    );
  }
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#5157E6',
        padding: 24,
      }}
    >
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
          flexGrow: 1,
        }}
      >
        <Image
          source={require('./../../assets/images/smb-white-slogan-logo.png')}
          style={{
            width: 220,
            height: 220,
          }}
          contentFit="contain"
        />
      </View>
      <View
        style={{
          marginBottom: 80,
          gap: 12,
          alignItems: 'center',
          marginTop: 'auto',
        }}
      >
        <Button
          onPress={handleGetStartedPress}
          style={{
            borderRadius: 48,
            width: 220,
            alignItems: 'center',
          }}
          buttonColor="#fff"
          labelStyle={{
            color: '#5157E6',
          }}
        >
          Get Started
        </Button>
      </View>
    </View>
  );
}
