import { useAppTheme } from '@/context/ThemeContext';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import ActivityIndicator from '../ui/ActivityIndicator';

const LoadingScreen = () => {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});

export default LoadingScreen;
