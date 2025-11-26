import React from 'react';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  Checkbox as PaperCheckbox,
  CheckboxProps as PaperCheckboxProps,
  Text,
} from 'react-native-paper';

interface CheckboxProps extends PaperCheckboxProps {
  label?: string;
  labelPlacement?: 'start' | 'end';
}
const Checkbox = (props: CheckboxProps) => {
  const { label, labelPlacement = 'start', onPress, ...rest } = props;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        alignItems: 'center',
        gap: 16,
        flexDirection: labelPlacement === 'start' ? 'row' : 'row-reverse',
      }}
    >
      {label && (
        <Text variant="bodyLarge" style={styles.label}>
          {label}
        </Text>
      )}

      <PaperCheckbox {...rest} onPress={onPress} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  label: {
    flexGrow: 1,
  },
  labelStart: {},
  labelEnd: {},
});

export default Checkbox;
