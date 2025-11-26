import { AppColors } from '@/constants/Colors';
import { useAppTheme, useThemeContext } from '@/context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

type SettingsLinkProps = {
  title: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  onPress?: () => void;
  isLast?: boolean;
};

const SettingsLink = ({ title, icon, onPress, isLast }: SettingsLinkProps) => {
  const { colors } = useAppTheme();

  const { themeMode } = useThemeContext();

  const styles = useMemo(
    () => createStyles(colors, themeMode),
    [colors, themeMode],
  );
  return (
    <TouchableOpacity
      style={[styles.settingsLinkButton, isLast && { borderBottomWidth: 0 }]}
      onPress={onPress}
    >
      <View style={styles.titleWrapper}>
        <MaterialCommunityIcons name={icon} size={24} color={colors.text} />
        <Text variant="bodyLarge" style={styles.title}>
          {title}
        </Text>
      </View>
      <MaterialCommunityIcons
        name="chevron-right"
        size={20}
        color={colors.text}
      />
    </TouchableOpacity>
  );
};

export default SettingsLink;

const createStyles = (colors: AppColors, currentTheme: string) =>
  StyleSheet.create({
    settingsLinkButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
    },
    titleWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    title: {
      color: colors.text,
    },
  });
