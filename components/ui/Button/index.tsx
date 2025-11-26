import React, { useMemo } from 'react';
import {
  ButtonProps as PaperButtonProps,
  Button as PaperButton,
} from 'react-native-paper';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { AppColors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';

interface ButtonProps extends PaperButtonProps {
  iconPosition?: 'left' | 'right';
  buttonColor?: 'primary' | 'error' | string;
}

const Button = (props: ButtonProps) => {
  const {
    iconPosition = 'left',
    style,
    labelStyle,
    contentStyle,
    buttonColor = 'primary',
    mode = 'contained',
    textColor,
    ...rest
  } = props;

  const { colors } = useAppTheme();

  const styles = useMemo(() => createStyles(colors), [colors]);

  const directionStyle: StyleProp<ViewStyle> = useMemo(
    () => ({
      flexDirection: iconPosition === 'right' ? 'row-reverse' : 'row',
    }),
    [iconPosition],
  );

  const dynamicProps = useMemo(() => {
    if (buttonColor === 'error') {
      switch (mode) {
        case 'contained':
          return {
            buttonColor: colors.error,
            textColor: colors.onError,
          };
        case 'outlined':
          return {
            textColor: colors.error,
            style: { borderColor: colors.error },
          };
        case 'text':
        case 'contained-tonal':
          return {
            textColor: colors.error,
          };
        default:
          return {};
      }
    }
    if (buttonColor === 'primary') {
      switch (mode) {
        case 'outlined':
          return {
            style: { borderColor: colors.primary },
          };

        default:
          return {};
      }
    }
    return {
      buttonColor,
    };
  }, [buttonColor, mode, colors]);

  return (
    <PaperButton
      {...rest}
      mode={mode}
      buttonColor={dynamicProps.buttonColor}
      textColor={dynamicProps.textColor || textColor}
      style={[styles.button, dynamicProps.style, style]}
      contentStyle={[styles.content, directionStyle, contentStyle]}
      labelStyle={[styles.label, labelStyle]}
    />
  );
};

export default Button;

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    button: {
      borderRadius: 8,
    },
    content: {
      paddingVertical: 8,
    },
    label: {
      fontSize: 16,
    },
  });
