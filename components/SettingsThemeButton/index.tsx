import { AppColors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

type SettingsThemeButtonProps = {
  title: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  onPress: () => void;
  isActive: boolean;
  isLast?: boolean;
};

const SettingsThemeButton = ({
  title,
  icon,
  onPress,
  isActive,
  isLast,
}: SettingsThemeButtonProps) => {
  const { colors } = useAppTheme();

  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <TouchableOpacity
      style={[styles.settingsThemeButton, isLast && { borderBottomWidth: 0 }]}
      onPress={onPress}
    >
      <View style={styles.titleWrapper}>
        <MaterialCommunityIcons name={icon} size={24} color={colors.text} />
        <Text variant="bodyLarge" style={styles.title}>
          {title}
        </Text>
      </View>
      <MaterialCommunityIcons
        name={isActive ? 'check-circle' : 'checkbox-blank-circle-outline'}
        size={20}
        color={isActive ? colors.text : colors.textSecondary}
      />
    </TouchableOpacity>
  );
};

export default SettingsThemeButton;

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    settingsThemeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 18,
      paddingVertical: 16,
      borderRadius: 8,
      marginVertical: 4,
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
