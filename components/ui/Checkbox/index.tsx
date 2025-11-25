import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
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
      style={[
        styles.mainContainer,
        {
          flexDirection: labelPlacement === 'start' ? 'row' : 'row-reverse',
        },
      ]}
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
  mainContainer: {
    alignItems: 'center',
    gap: 16,
  },
  label: {
    flexGrow: 1,
  },
});

export default Checkbox;
