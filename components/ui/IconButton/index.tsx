import { useAppTheme } from '@/context/ThemeContext';
import * as React from 'react';
import {
  IconButton as PaperIconButton,
  IconButtonProps as PaperIconButtonProps,
} from 'react-native-paper';

interface IconButtonProps extends PaperIconButtonProps {
  icon: string;
  size?: number;
  iconColor?: 'primary' | 'error' | string;
}

const IconButton = (props: IconButtonProps) => {
  const { icon = 'camera', size = 24, iconColor = 'primary', ...rest } = props;

  const { colors } = useAppTheme();

  const resolvedColor = React.useMemo(() => {
    switch (iconColor) {
      case 'error':
        return colors.error;
      case 'primary':
        return colors.primary;
      default:
        return iconColor;
    }
  }, [colors, iconColor]);

  return (
    <PaperIconButton
      {...rest}
      icon={icon}
      iconColor={resolvedColor}
      size={size}
    />
  );
};

export default IconButton;
