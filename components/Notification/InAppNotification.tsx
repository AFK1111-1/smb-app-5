import React, { useEffect } from 'react';
import {
  Animated,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';

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
  const slideAnim = new Animated.Value(-100);

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }).start();

      // Auto hide after 5s
      const timeout = setTimeout(() => onHide(), 5000);
      return () => clearTimeout(timeout);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
    >
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
      </View>
      <View>
        <TouchableOpacity onPress={onHide}>
          <Text
            style={{
              color: '#888',
              marginTop: 10,
              fontSize: 12,
              textAlign: 'right',
            }}
          >
            Tap to dismiss
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default InAppNotification;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    width: '90%',
    zIndex: 9999,
  },
  title: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  body: { color: '#ccc', fontSize: 14 },
});
