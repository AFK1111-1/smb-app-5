import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';
import { Fonts } from '@/constants/Fonts';
import { AppColors } from '@/constants/Colors';

interface InAppNotificationProps {
  visible: boolean;
  title: string;
  body: string;
  onHide: () => void;
}

const InAppNotification: React.FC<InAppNotificationProps> = ({
  visible,
  title,
  body,
  onHide,
}) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }).start();

      // Auto hide after 5s
      const timeout = setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 200,
          useNativeDriver: true,
        }).start(() => onHide());
      }, 5000);
      return () => clearTimeout(timeout);
    } else {
      slideAnim.setValue(-100);
    }
  }, [visible, slideAnim, onHide]);

  if (!visible) return null;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.containerWrapper, { transform: [{ translateY: slideAnim }] }]}
    >
      <View style={[styles.container, { backgroundColor: colors.surface }]} pointerEvents="auto">
        <View>
          <Text style={[styles.title, { color: colors.onSurface }]}>{title}</Text>
          <Text style={[styles.body, { color: colors.textSecondary }]}>{body}</Text>
        </View>
        <View>
          <TouchableOpacity onPress={onHide}>
            <Text
              style={[styles.dismissText, { color: colors.textMuted }]}
            >
              Tap to dismiss
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

export default InAppNotification;

const createStyles = (colors: AppColors) => StyleSheet.create({
  containerWrapper: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  container: {
    padding: 15,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    width: '90%',
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 16,
  },
  body: {
    fontSize: 14,
  },
  dismissText: {
    marginTop: 10,
    fontSize: 12,
    textAlign: 'right',
  },
});
