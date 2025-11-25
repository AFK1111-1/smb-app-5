import React from 'react';
import { RadioButton, RadioButtonItemProps } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { Fonts } from '@/constants/Fonts';
import { useAppTheme } from '@/context/ThemeContext';

const RadioGroupItem = (props: RadioButtonItemProps) => {
  const { colors } = useAppTheme();

  return (
    <RadioButton.Item
      {...props}
      style={[{ backgroundColor: colors.radioButtonBg }, styles.item, props.style]}
      labelStyle={[styles.label, props.labelStyle]}
      color={colors.radioButtonActive}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    marginBottom: 8,
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    fontFamily: Fonts.medium,
  },
});

export default RadioGroupItem;
