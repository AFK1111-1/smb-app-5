import { AppColors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';

import { Image } from 'expo-image';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';

const { width } = Dimensions.get('window');

const ComingSoon = ({ title }: { title: string }) => {
  const { colors } = useAppTheme();
  const {t} = useTranslation()

  const styles = useMemo(() => createStyles(colors), [colors]);
  
  return (
    <View style={styles.container}>
      <Text variant="displaySmall" style={styles.title}>
        {title}
      </Text>
      <Image
        source={require('./../../assets/images/coming-soon.png')}
        style={styles.image}
        contentFit="contain"
      />
      <Text variant="bodyLarge" style={styles.subtitle}>
        {t("common.comingSoon")}
      </Text>
    </View>
  );
};

export default ComingSoon;

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    },
    title: {
      marginBottom: 16,
      color: colors.text,
    },
    subtitle: {
      color: colors.textSecondary,
      marginTop: 20,
    },
    image: {
      width: width * 0.8,
      height: width * 0.8,
    },
  });
