import React, { useMemo } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '..';
import { useAppTheme } from '@/context/ThemeContext';
import { AppColors } from '@/constants/Colors';
import { icons, IconName } from '@/assets/icons';
import ChevronRightIcon from '@/assets/icons/chevron-right-icon';

type MaterialIconName = keyof typeof MaterialCommunityIcons.glyphMap;

export interface MenuItemProps {
  title: string;
  icon?: IconName | MaterialIconName;
  iconType?: 'svg' | 'material';
  showChevron?: boolean;
  chevronStrokeWidth?: number;
  rightElement?: React.ReactNode;
  rightText?: string;
  onPress?: () => void;
  isLast?: boolean;
}

const MenuItem = ({
  title,
  icon,
  iconType = 'svg',
  showChevron = true,
  chevronStrokeWidth = 1.5,
  rightElement,
  rightText,
  onPress,
  isLast = false,
}: MenuItemProps) => {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const renderIcon = () => {
    if (!icon) return null;

    if (iconType === 'material') {
      return (
        <MaterialCommunityIcons
          name={icon as MaterialIconName}
          size={24}
          color={colors.menuItemIcon}
        />
      );
    }

    // SVG icon
    const IconComponent = icons[icon as IconName];
    if (!IconComponent) return null;

    return (
      <IconComponent width={24} height={24} color={colors.menuItemIcon} />
    );
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        disabled={!onPress}
      >
        <View style={styles.leftSection}>
          {renderIcon()}
          <Text style={styles.title}>{title}</Text>
        </View>

        <View style={styles.rightSection}>
          {rightText && <Text style={styles.rightText}>{rightText}</Text>}
          {rightElement ? (
            rightElement
          ) : showChevron ? (
            <ChevronRightIcon
              width={28}
              height={28}
              color={colors.menuItemChevron}
              strokeWidth={chevronStrokeWidth}
            />
          ) : null}
        </View>
      </TouchableOpacity>
      {!isLast && <View style={styles.separator} />}
    </View>
  );
};

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      minHeight: 56,
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      flex: 1,
    },
    rightSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    rightText: {
      fontSize: 14,
      color: colors.textMuted,
    },
    title: {
      fontSize: 16,
      lineHeight: 28,
      color: colors.menuItemIcon,
    },
    separator: {
      height: 1,
      backgroundColor: colors.divider,
    },
  });

export default MenuItem;
