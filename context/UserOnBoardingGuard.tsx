import React, { useState } from 'react';
import { useUserProfileData } from './UserAuthGuard';
import UserOnBoardingScreen from '@/screens/UserOnBoardingScreen/UserOnBoardingScreen';

const UserOnBoardingGuard = ({ children }: { children: React.ReactNode }) => {
  const userProfile = useUserProfileData();
  const [isNewUser, setIsNewUser] = useState(true);

  if (isNewUser) {
    return (
      <UserOnBoardingScreen
        userProfile={userProfile}
        toggleNewUser={() => setIsNewUser(false)}
      />
    );
  }
  return <>{children}</>;
};

export default UserOnBoardingGuard;
