import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { AVAILABLE_LOCALES } from '@/i18n'
import { useAppTheme } from '@/context/ThemeContext';

interface LanguageSwitcherProps{
  selectedLanguage: string
  onChangeLanguage: (lang: string) => void
}
const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({selectedLanguage,onChangeLanguage}) => {
      const {colors} = useAppTheme()

      

  return (
      <View style={{ gap: 8}}>

      {AVAILABLE_LOCALES.map((lang) => (
        <TouchableOpacity
          key={lang.code}
          onPress={() => onChangeLanguage(lang.code)}
          style={{
            flexDirection: 'row',
            alignContent: 'center',
            gap:8,
            marginHorizontal: 8,
            padding: 8,
            borderRadius: 8,
            backgroundColor: selectedLanguage.startsWith(lang.code)
              ? colors.primary
              : colors.secondaryDarker,
          }}
        >
          <Text style={{ fontSize: 24, textAlign: 'center' }}>{lang.flag}</Text>
          <Text style={{ fontSize: 16, textAlign: 'center', color: colors.text, lineHeight: 24 }}>{lang.label}</Text>
        </TouchableOpacity>
      ))}
      </View>

  )
}

export default LanguageSwitcher