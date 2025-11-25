import { Button } from '@/components/ui';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { useAppTheme } from '@/context/ThemeContext';
import { changeAppLanguage } from '@/i18n';
import { router } from 'expo-router';
import i18next from 'i18next';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

export default function LanguageScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    i18next.language,
  );
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const handleLanguageChange = () => {
    changeAppLanguage(selectedLanguage);
    router.back();
  };
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          marginTop: 12,
          marginHorizontal: 16,
          marginBottom: 24,
        }}
      >
        <LanguageSwitcher
          selectedLanguage={selectedLanguage}
          onChangeLanguage={setSelectedLanguage}
        />
        <Button
          onPress={handleLanguageChange}
          labelStyle={{ color: colors.white }}
        >
          {t('setting.languageSwitch.actions.confirm')}
        </Button>
      </View>
    </View>
  );
}
