import { useAppTheme } from '@/context/ThemeContext';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SafeScreen = ({
  children,
  topBackgroundColor,
  bottomBackgroundColor,
  backgroundColor,
}: {
  children: React.ReactNode;
  topBackgroundColor?: string;
  bottomBackgroundColor?: string;
  backgroundColor?: string;
}) => {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();

  const defaultBgColor = backgroundColor || colors.background;
  const topBgColor = topBackgroundColor || defaultBgColor;
  const bottomBgColor = bottomBackgroundColor || defaultBgColor;

  return (
    <View style={{ flex: 1 }}>
      {insets.top > 0 && (
        <View
          style={{
            height: insets.top,
            backgroundColor: topBgColor,
          }}
        />
      )}

      <View
        style={{
          flex: 1,
          backgroundColor: defaultBgColor,
        }}
      >
        {children}
      </View>

      {insets.bottom > 0 && (
        <View
          style={{
            height: insets.bottom,
            backgroundColor: bottomBgColor,
          }}
        />
      )}
    </View>
  );
};

export default SafeScreen;
