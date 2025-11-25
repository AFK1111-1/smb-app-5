import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { Fonts } from '@/constants/Fonts';

export interface CustomTextProps extends RNTextProps {
  /**
   * Font weight variant
   * @default 'regular'
   */
  variant?: 'light' | 'regular' | 'medium' | 'semiBold' | 'bold';
}

/**
 * Custom Text component with Inter font family as default
 *
 * This component automatically applies Inter font to all text.
 * Use this instead of React Native's Text component.
 *
 * @example
 * ```tsx
 * import { Text } from '@/components/ui';
 *
 * <Text>Regular text with Inter</Text>
 * <Text variant="bold">Bold text</Text>
 * <Text variant="medium" style={{ fontSize: 20 }}>Medium weight</Text>
 * ```
 */
export const Text = ({ variant = 'regular', style, ...props }: CustomTextProps) => {
  const fontFamily = Fonts[variant];

  return (
    <RNText
      {...props}
      style={[styles.defaultText, { fontFamily }, style]}
    />
  );
};

const styles = StyleSheet.create({
  defaultText: {
    fontFamily: Fonts.regular,
  },
});

export default Text;
