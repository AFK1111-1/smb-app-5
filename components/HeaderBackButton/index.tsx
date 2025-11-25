import { View, StyleSheet } from 'react-native';
import React from 'react';
import { useAppTheme } from '@/context/ThemeContext';
import IconButton from '../ui/IconButton';

const HeaderBackButton = ({ onPress }: { onPress: () => void }) => {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      <IconButton
        icon={'chevron-left'}
        size={24}
        iconColor={colors.text}
        onPress={onPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    height: 42,
    width: 42,
    borderRadius: 42,
    marginRight: 16,
  },
});

export default HeaderBackButton;
