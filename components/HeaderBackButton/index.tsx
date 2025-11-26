import { View } from 'react-native';
import React from 'react';
import { useAppTheme } from '@/context/ThemeContext';
import IconButton from '../ui/IconButton';

const HeaderBackButton = ({ onPress }: { onPress: () => void }) => {
  const { colors } = useAppTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        height: 42,
        width: 42,
        borderRadius: 42,
        marginRight: 16,
      }}
    >
      <IconButton
        icon={'chevron-left'}
        size={24}
        iconColor={colors.text}
        onPress={onPress}
      />
    </View>
  );
};

export default HeaderBackButton;
