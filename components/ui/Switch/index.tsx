import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Switch as PaperSwitch,
  SwitchProps as PaperSwitchProps,
  Text,
} from 'react-native-paper';

interface SwitchProps extends PaperSwitchProps {
  label?: string;
  labelPlacement?: 'start' | 'end';
}
const Switch = (props: SwitchProps) => {
  const { label, labelPlacement = 'start', ...rest } = props;
  return (
    <View
      style={{
        alignItems: 'center',
        gap: 16,
        ...(labelPlacement === 'start'
          ? { flexDirection: 'row' }
          : { flexDirection: 'row-reverse' }),
      }}
    >
      {label && (
        <Text variant="bodyLarge" style={[styles.label, styles.labelStart]}>
          {label}
        </Text>
      )}
      <PaperSwitch {...rest} style={[styles.switch, props.style]} />
    </View>
  );
};

const styles = StyleSheet.create({
  switch: {},
  label: {},
  labelStart: {},
  labelEnd: {},
});

export default Switch;
