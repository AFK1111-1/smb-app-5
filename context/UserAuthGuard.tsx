import React, {
  useEffect,
  useState,
  ReactNode,
  createContext,
  useContext,
} from 'react';
import { View } from 'react-native';
import { useKindeAuth } from '@kinde/expo';
import { useRouter } from 'expo-router';
import { useGetCurrentUser } from '@/hooks/api/use-users';
import { KindeUserProfile } from '@/types/user';
import { useAppTheme } from './ThemeContext';
import { Button } from '@/components/ui';
import { Text } from 'react-native-paper';
import ActivityIndicator from '@/components/ui/ActivityIndicator';

interface UserAuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface UserProfileDataContextType {
  userProfileData: ReturnType<typeof useGetCurrentUser>['data'];
}

const UserProfileDataContext = createContext<
  UserProfileDataContextType | undefined
>(undefined);

export const useUserProfileData = () => {
  const context = useContext(UserProfileDataContext);
  if (!context) {
    throw new Error('useUserProfileData must be used within a <UserAuthGuard>');
  }
  if (!context.userProfileData) {
    throw new Error('Couldnt find user profile data');
  }
  return context.userProfileData;
};

export default function UserAuthGuard({
  children,
  fallback,
}: UserAuthGuardProps) {
  const [userProfile, setUserProfile] = useState<KindeUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { getUserProfile } = useKindeAuth();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getUserProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  if (loading) return <LoadingScreen message="Fetching user profile..." />;

  if (!userProfile)
    return fallback || <ErrorScreen message="No user profile found" />;

  return (
    <UserDataProvider userProfile={userProfile} fallback={fallback}>
      {children}
    </UserDataProvider>
  );
}

function UserDataProvider({
  userProfile,
  children,
  fallback,
}: {
  userProfile: KindeUserProfile;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const router = useRouter();
  const { isLoading, data: userProfileData } = useGetCurrentUser(
    userProfile.id,
  );
  const { logout } = useKindeAuth();

  const handleLogout = async () => {
    try {
      await logout({ revokeToken: true });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  if (isLoading)
    return <LoadingScreen message="Checking user service details..." />;

  if (!userProfileData)
    return (
      fallback || (
        <ErrorScreen
          message="Failed to load user data"
          onBack={() => router.replace('/')}
          onLogout={() => handleLogout()}
        />
      )
    );

  return (
    <UserProfileDataContext.Provider value={{ userProfileData }}>
      {children}
    </UserProfileDataContext.Provider>
  );
}

function LoadingScreen({ message }: { message: string }) {
  const { colors } = useAppTheme();
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
      <Text variant="bodyLarge" style={{ marginTop: 10 }}>
        {message}
      </Text>
    </View>
  );
}

function ErrorScreen({
  message,
  onBack,
  onLogout,
}: {
  message: string;
  onBack?: () => void;
  onLogout?: () => void;
}) {
  const { colors } = useAppTheme();
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
      <Text variant="bodyMedium" style={{ color: colors.text }}>
        {message}
      </Text>
      {onBack && (
        <View style={{ marginTop: 16 }}>
          <Button onPress={onBack} textColor={colors.text}>
            Go back to Home
          </Button>
        </View>
      )}
      {onLogout && (
        <View style={{ marginTop: 20 }}>
          <Button icon="logout" onPress={onLogout} mode="contained">
            Logout
          </Button>
        </View>
      )}
    </View>
  );
}
