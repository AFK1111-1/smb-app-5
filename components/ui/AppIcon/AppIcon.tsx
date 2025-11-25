import { IconName, icons } from '@/assets/icons';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { Text } from '..';

type AppIconProps = {
  name: IconName;
  label?: string;
  size?: number;
  color?: string;
} & Omit<SvgProps, 'width' | 'height'>;
const AppIcon: React.FC<AppIconProps> = ({
  name,
  label,
  size = 24,
  color,
  ...rest
}) => {
  const SVGIcon = icons[name];

  if (!SVGIcon) {
    console.warn(`Icon ${name} not found in assets/icons`);
    return null;
  }
  return (
    <View style={styles.mainContainer}>
      <SVGIcon width={size} height={size} color={color} fill="none" {...rest} />
      {label && <Text variant='medium' style={[styles.text, { color: color }]}>{label}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 10,
    lineHeight: 20,
  },
});

export default AppIcon;
