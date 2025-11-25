import { useAppTheme } from '@/context/ThemeContext';
import * as React from 'react';
import {
  ActivityIndicator as PaperActivityIndicator,
  ActivityIndicatorProps as PaperActivityIndicatorProps,
} from 'react-native-paper';

interface ActivityIndicatorProps extends PaperActivityIndicatorProps {
  size?: number;
  color?: 'primary' | string;
}

const ActivityIndicator = (props: ActivityIndicatorProps) => {
  const { size = 'small', color = 'primary', ...rest } = props;

  const { colors } = useAppTheme();

  return (
    <PaperActivityIndicator
      {...rest}
      color={color || colors.primary}
      size={size}
    />
  );
};

export default ActivityIndicator;
