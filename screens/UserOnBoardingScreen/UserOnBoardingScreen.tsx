import { TouchableOpacity, View } from 'react-native';
import React, { useState, useMemo } from 'react';
import SafeScreen from '@/components/SafeScreen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { User } from '@/types/user';
import { Image } from 'expo-image';
import { useAppTheme } from '@/context/ThemeContext';
import { Button, Card } from '@/components/ui';
import { Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

const onboardingImages = {
  welcome: require('../../assets/images/welcome/welcome-screen.png'),
  stayConnected: require('../../assets/images/welcome/welcome-screen.png'),
  trackProgress: require('../../assets/images/welcome/welcome-screen.png'),
  getStarted: require('../../assets/images/welcome/welcome-screen.png'),
};

const UserOnBoardingModule = ({
  userProfile,
  toggleNewUser,
}: {
  userProfile: User;
  toggleNewUser: () => void;
}) => {
  const { colors } = useAppTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const { t, i18n } = useTranslation();

  // Steps driven by translations
  const onboardingSteps = useMemo(
    () => [
      {
        key: 'welcome',
        title: t('onboarding.welcome.title'),
        description: t('onboarding.welcome.description', { firstName: userProfile.firstName }),
        image: onboardingImages.welcome,
      },
      {
        key: 'stayConnected',
        title: t('onboarding.stayConnected.title'),
        description: t('onboarding.stayConnected.description'),
        image: onboardingImages.stayConnected,
      },
      {
        key: 'trackProgress',
        title: t('onboarding.trackProgress.title'),
        description: t('onboarding.trackProgress.description'),
        image: onboardingImages.trackProgress,
      },
      {
        key: 'getStarted',
        title: t('onboarding.getStarted.title'),
        description: t('onboarding.getStarted.description'),
        image: onboardingImages.getStarted,
      },
    ],
    [t,i18n, userProfile.firstName] // recompute when language/firstname changes
  );

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      toggleNewUser();
    }
  };

  const handleSkip = () => toggleNewUser();

  const step = onboardingSteps[currentStep];

  return (
    <SafeScreen
      topBackgroundColor={colors.background}
      bottomBackgroundColor={colors.background}
      backgroundColor={colors.background}
    >
      <KeyboardAwareScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid
        enableAutomaticScroll
        extraScrollHeight={100}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1, padding: 24 }}>
          <View style={{ flex: 1, paddingBottom: 48 }}>
            <Card fullHeight>
              <View style={{ height:'100%', justifyContent: 'center' }}>
                <OnBoardingStep
                  title={step.title}
                  description={step.description}
                  image={step.image}
                />

                {/* Progress dots */}
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 16 }}>
                  {onboardingSteps.map((_, index) => (
                    <View
                      key={index}
                      style={{
                        width: index === currentStep ? 24 : 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor:
                          index === currentStep ? colors.primary : colors.white,
                        marginHorizontal: 4,
                      }}
                    />
                  ))}
                </View>
              </View>
            </Card>
          </View>

          <View style={{ marginTop: 'auto', gap: 12 }}>
            <Button
              onPress={handleNext}
              mode="contained"
              icon="arrow-right-thin"
              iconPosition="right"
            >
              {currentStep === onboardingSteps.length - 1
                ? t('onboarding.actions.finish')
                : t('onboarding.actions.next')}
            </Button>

            <Button onPress={handleSkip} mode="text">
              {t('onboarding.actions.skip')}
            </Button>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeScreen>
  );
};

export default UserOnBoardingModule;

function OnBoardingStep({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image: any;
}) {
  const { colors } = useAppTheme();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image
        source={image}
        style={{ width: '100%', height: 220 }}
        contentFit="contain"
      />
      <Text
        style={{ color: colors.text, textAlign: 'center', marginBottom: 8, marginTop: 16 }}
        variant="displaySmall"
      >
        {title}
      </Text>
      <Text variant="bodyLarge" style={{ color: colors.text, textAlign: 'center' }}>
        {description}
      </Text>
    </View>
  );
}
