import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useThemeContext } from '@/context/ThemeContext';
import { FAB } from 'react-native-paper';

const ToggleTheme = () => {
  const { toggleTheme } = useThemeContext();
  return (
    <FAB
      size="small"
      icon="theme-light-dark"
      onPress={toggleTheme}
      style={{ position: 'absolute', margin: 16, right: 20, bottom: 0 }}
    />
  );
};

export default ToggleTheme;

const styles = StyleSheet.create({});
