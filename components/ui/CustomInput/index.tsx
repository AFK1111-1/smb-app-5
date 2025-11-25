import React, { useState, forwardRef, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme } from '@/context/ThemeContext';
import { AppColors } from '@/constants/Colors';
import { icons } from '@/assets/icons';
import { Fonts } from '@/constants/Fonts';

export type InputSize = 32 | 40 | 48;

export interface CustomInputProps extends RNTextInputProps {
  label?: string;
  helperText?: string;
  error?: boolean;
  optional?: boolean;
  showInfo?: boolean;
  size?: InputSize;
  onInfoPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

const CustomInput = forwardRef<RNTextInput, CustomInputProps>(
  (
    {
      label,
      helperText,
      error = false,
      optional = false,
      showInfo = true,
      size = 40,
      editable = true,
      onInfoPress,
      style,
      containerStyle,
      onFocus,
      onBlur,
      value,
      ...rest
    },
    ref
  ) => {
    const { colors } = useAppTheme();
    const [isFocused, setIsFocused] = useState(false);

    const styles = useMemo(
      () => createStyles(colors, size, error, editable, isFocused, !!value),
      [colors, size, error, editable, isFocused, value]
    );

    const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <View style={styles.labelContainer}>
            <View style={styles.labelRow}>
              <Text variant="bodyLarge" style={styles.label}>
                {label}
              </Text>
              {showInfo && (
                <Pressable
                  onPress={onInfoPress}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <icons.infoIcon
                    width={16}
                    height={16}
                    color={colors.inputTextPlaceholder}
                  />
                </Pressable>
              )}
            </View>
            {optional && (
              <Text variant="bodySmall" style={styles.optional}>
                Optional
              </Text>
            )}
          </View>
        )}
        <View style={styles.inputWrapper}>
          <RNTextInput
            ref={ref}
            value={value}
            editable={editable}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholderTextColor={colors.inputTextPlaceholder}
            style={[styles.input, style]}
            {...rest}
          />
        </View>
        {error && helperText && (
          <Text variant="bodySmall" style={styles.errorText}>
            {helperText}
          </Text>
        )}
      </View>
    );
  }
);

CustomInput.displayName = 'CustomInput';

const createStyles = (
  colors: AppColors,
  size: InputSize,
  error: boolean,
  editable: boolean,
  isFocused: boolean,
  hasValue: boolean
) => {
  const heightMap = {
    32: 32,
    40: 40,
    48: 48,
  };

  const paddingMap = {
    32: { paddingVertical: 4, paddingHorizontal: 12 },
    40: { paddingVertical: 8, paddingHorizontal: 12 },
    48: { paddingVertical: 12, paddingHorizontal: 12 },
  };

  const getBorderColor = () => {
    if (error) return colors.inputBorderError;
    if (isFocused) return colors.inputBorderFocused;
    return colors.inputBorder;
  };

  const getBackgroundColor = () => {
    if (error) return colors.inputBackgroundError;
    if (!editable) return colors.inputBackgroundDisabled;
    return colors.inputBackground;
  };

  const getShadow = () => {
    if (isFocused) {
      return {
        shadowColor: colors.inputShadowFocused,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 3,
        elevation: 3,
      };
    }
    return {};
  };

  const getTextColor = () => {
    if (!editable) return colors.placeholder;
    if (hasValue) return colors.inputTextFilled;
    return colors.inputText;
  };

  return StyleSheet.create({
    container: {
      gap: 4,
    },
    labelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 8,
    },
    labelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    label: {
      fontFamily: Fonts.medium,
      color: colors.inputLabel,
    },
    optional: {
      color: colors.inputTextPlaceholder,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    input: {
      flex: 1,
      height: heightMap[size],
      fontSize: 14,
      fontFamily: Fonts.regular,
      lineHeight: 20,
      color: getTextColor(),
      backgroundColor: getBackgroundColor(),
      borderWidth: 1,
      borderColor: getBorderColor(),
      borderRadius: 5,
      ...paddingMap[size],
      ...getShadow(),
    },
    errorText: {
      color: colors.inputBorderError,
      marginTop: 2,
    },
  });
};

export default CustomInput;
