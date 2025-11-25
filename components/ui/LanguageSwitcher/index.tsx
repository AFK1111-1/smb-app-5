import { View, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { AVAILABLE_LOCALES } from '@/i18n';
import { Text } from '..';
import { useAppTheme } from '@/context/ThemeContext';

interface LanguageSwitcherProps {
  selectedLanguage: string;
  onChangeLanguage: (lang: string) => void;
}
const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  selectedLanguage,
  onChangeLanguage,
}) => {
  const { colors } = useAppTheme();

  return (
    <View style={styles.topContainer}>
      {AVAILABLE_LOCALES.map((lang) => (
        <TouchableOpacity
          key={lang.code}
          onPress={() => onChangeLanguage(lang.code)}
          style={[
            styles.mainContainer,
            {
              backgroundColor: selectedLanguage.startsWith(lang.code)
                ? colors.primary
                : colors.secondaryDarker,
            },
          ]}
        >
          <Text style={styles.text}>{lang.flag}</Text>
          <Text style={[styles.label, { color: colors.text }]}>
            {lang.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    gap: 8,
  },
  mainContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    gap: 8,
    marginHorizontal: 8,
    padding: 8,
    borderRadius: 8,
  },
  text: {
    fontSize: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default LanguageSwitcher;
