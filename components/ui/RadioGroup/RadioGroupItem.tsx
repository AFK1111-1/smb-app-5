import React from 'react';
import { RadioButton, RadioButtonItemProps } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const RadioGroupItem = (props: RadioButtonItemProps) => {
  return (
    <RadioButton.Item
      {...props}
      style={[styles.item, props.style]}
      labelStyle={[styles.label, props.labelStyle]}
      color="#007bff"
    />
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#f8f9fa',
    marginBottom: 8,
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default RadioGroupItem;
