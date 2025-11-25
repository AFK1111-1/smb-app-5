import { Card } from '@/components/ui';
import { useAppTheme } from '@/context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

export default function PrivacyScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <View>
          <Text
            variant="bodyMedium"
            style={[styles.sectionText, { color: colors.textSecondary }]}
          >
            {t('setting.privacy.description')}
          </Text>
        </View>
        <Card>
          <View style={styles.section}>
            <Text
              variant="bodyLarge"
              style={[styles.sectionTitle, { color: colors.text }]}
            >
              Our Commitment to Your Privacy
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.sectionText, { color: colors.textSecondary }]}
            >
              At Insighture, we value your privacy and are committed to
              protecting your personal data. This Privacy Policy outlines how we
              collect, use, and safeguard your information.
            </Text>
          </View>
          <View style={styles.section}>
            <Text
              variant="bodyLarge"
              style={[styles.sectionTitle, { color: colors.text }]}
            >
              Information We Collect
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.sectionText, { color: colors.textSecondary }]}
            >
              We collect information you provide directly to us, such as when
              you create an account, update your profile, or contact us for
              support.
            </Text>
          </View>
          <View style={styles.section}>
            <Text
              variant="bodyLarge"
              style={[styles.sectionTitle, { color: colors.text }]}
            >
              How We Use Your Information
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.sectionText, { color: colors.textSecondary }]}
            >
              We use the information we collect to provide, maintain, and
              improve our services, communicate with you, and ensure the
              security of our platform.
            </Text>
          </View>
        </Card>
        <Card>
          <View style={styles.section}>
            <Text
              variant="bodyLarge"
              style={[styles.sectionTitle, { color: colors.text }]}
            >
              Data Security
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.sectionText, { color: colors.textSecondary }]}
            >
              We implement appropriate security measures to protect your
              personal information against unauthorized access, alteration,
              disclosure, or destruction.
            </Text>
          </View>

          <View style={styles.section}>
            <Text
              variant="bodyLarge"
              style={[styles.sectionTitle, { color: colors.text }]}
            >
              Your Rights
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.sectionText, { color: colors.textSecondary }]}
            >
              You have the right to access, update, or delete your personal
              information. You may also opt out of certain communications from
              us.
            </Text>
          </View>

          <View style={styles.section}>
            <Text
              variant="bodyLarge"
              style={[styles.sectionTitle, { color: colors.text }]}
            >
              Contact Us
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.sectionText, { color: colors.textSecondary }]}
            >
              If you have any questions about this Privacy Policy, please
              contact us at privacy@insighture.com.
            </Text>
          </View>
        </Card>
        <View style={styles.footer}>
          <Text
            variant="bodySmall"
            style={[
              styles.footerText,
              { color: colors.textSecondary, fontStyle: 'italic' },
            ]}
          >
            {t("setting.privacy.lastUpdate")}: {new Date().toLocaleDateString()}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  sectionText: {},
  footer: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  footerText: {
    textAlign: 'center',
  },
});
