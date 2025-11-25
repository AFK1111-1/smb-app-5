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
      style={[
        styles.mainContainer,
        {
          ...(labelPlacement === 'start'
            ? { flexDirection: 'row' }
            : { flexDirection: 'row-reverse' }),
        },
      ]}
    >
      {label && <Text variant="bodyLarge">{label}</Text>}
      <PaperSwitch {...rest} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: 'center',
    gap: 16,
  },
});

export default Switch;
