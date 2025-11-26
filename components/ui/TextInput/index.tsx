import { AppColors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  TextInput as PaperTextInput,
  TextInputProps as PaperTextInputProps,
  Text,
} from 'react-native-paper';

interface TextInputProps extends PaperTextInputProps {
  label?: string;
  helperText?: string;
  optional?: boolean;
}

const TextInput = (props: TextInputProps) => {
  const { label, error, helperText, ...rest } = props;
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.inputWrapper}>
      {label && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Text variant="bodyLarge" style={styles.label}>
            {label}
          </Text>
          {props.optional && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <MaterialCommunityIcons
                name="information-outline"
                size={14}
                color={colors.textSecondary}
              />
              <Text variant="bodySmall" style={styles.optional}>
                (Optional)
              </Text>
            </View>
          )}
        </View>
      )}

      <PaperTextInput
        {...rest}
        style={[
          styles.input,
          error && { backgroundColor: colors.errorContainer },
          props.style,
        ]}
        outlineStyle={styles.outlineInput}
        mode="outlined"
        underlineColor="transparent"
        error={error}
      />
      {error && helperText ? (
        <Text variant="bodySmall" style={styles.errorText}>
          {helperText}
        </Text>
      ) : helperText ? (
        <Text variant="bodySmall">{helperText}</Text>
      ) : null}
    </View>
  );
};

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    inputWrapper: {},
    input: {
      backgroundColor: colors.formFieldBg,
    },
    outlineInput: {
      borderWidth: 1,
      borderRadius: 8,
    },
    label: {
      marginBottom: 4,
    },
    errorText: {
      color: colors.error,
    },
    optional: {
      color: colors.textSecondary,
    },
  });

export default TextInput;
