import { AppColors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';
import * as React from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Card as PaperCard } from 'react-native-paper';

interface ReusableCardProps {
  mode?: 'outlined' | 'contained' | 'elevated';
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  fullHeight?: boolean;
  onPress?: () => void;
}

const Card = (props: ReusableCardProps) => {
  const { mode = 'outlined', style, fullHeight, children, ...rest } = props;
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <PaperCard
      mode={mode}
      style={[styles.card, fullHeight && styles.fullHeightCard, style]}
      {...rest}
    >
      <PaperCard.Content>{children}</PaperCard.Content>
    </PaperCard>
  );
};

export default Card;

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      boxShadow: `0 4 30px 0 (54,41, 183, 0.01)`,
      borderColor: colors.cardBorder,
    },
    fullHeightCard: {
      height: '100%',
    },
  });
