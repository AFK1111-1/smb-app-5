import { Card } from '@/components/ui';
import { useAppTheme } from '@/context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import Constants from 'expo-constants';
export default function AboutScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const toggleExpanded = (index: number) => {
    setExpandedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const aboutData = useMemo(
    () => [
      {
        question: t('setting.about.items.features.question'),
        answer: t('setting.about.items.features.answer'),
      },
      {
        question: t('setting.about.items.team.question'),
        answer: t('setting.about.items.team.answer'),
      },
      {
        question: t('setting.about.items.legal.question'),
        answer: t('setting.about.items.legal.answer'),
      },
    ],
    [t],
  );
  // Get app version, build number programmatically
  const appVersion = Constants.expoConfig?.version ?? 'N/A';
  const buildNumber =
    Constants.expoConfig?.ios?.buildNumber ??
    Constants.expoConfig?.android?.versionCode?.toString() ??
    'N/A';
  
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <Card>
          <View style={styles.header}>
            <Text
              variant="titleLarge"
              style={[styles.subtitle, { color: colors.text }]}
            >
              {t('setting.about.info.title')}
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.description, { color: colors.textSecondary }]}
            >
              {t('setting.about.info.description')}
            </Text>
          </View>
          <View style={styles.section}>
            <Text
              variant="titleMedium"
              style={[styles.sectionTitle, { color: colors.text }]}
            >
              {t('setting.about.mission.title')}
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.sectionText, { color: colors.textSecondary }]}
            >
              {t('setting.about.mission.description')}
            </Text>
          </View>
        </Card>

        {aboutData.map((item, index) => (
          <AboutItem
            key={index}
            question={item.question}
            answer={item.answer}
            isExpanded={expandedItems.includes(index)}
            onToggle={() => toggleExpanded(index)}
          />
        ))}
        <Card>
          <View>
            <Text
              variant="titleMedium"
              style={[styles.sectionTitle, { color: colors.text }]}
            >
              {t('setting.about.version.title')}
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.sectionText, { color: colors.textSecondary }]}
            >
              {t('setting.about.version.appVersion', { version: appVersion })}
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.sectionText, { color: colors.textSecondary }]}
            >
              {t('setting.about.version.buildNumber', { number: buildNumber })}
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.sectionText, { color: colors.textSecondary }]}
            >
              {t('setting.about.version.releaseDate', {
                date: new Date().toLocaleDateString(),
              })}
            </Text>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

const AboutItem = ({
  question,
  answer,
  isExpanded,
  onToggle,
}: {
  question: string;
  answer: string;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const { colors } = useAppTheme();
  return (
    <View
      style={[styles.aboutItem, { backgroundColor: colors.secondaryDarker }]}
    >
      <TouchableOpacity
        style={styles.aboutHeader}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Text style={[styles.aboutQuestion, { color: colors.text }]}>
          {question}
        </Text>
        <MaterialCommunityIcons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          color={colors.text}
        />
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.aboutAnswer}>
          <Text
            style={[styles.aboutAnswerText, { color: colors.textSecondary }]}
          >
            {answer}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
  },
  subtitle: {
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.9,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  sectionText: {
    opacity: 0.8,
  },
  aboutItem: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  aboutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  aboutQuestion: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  aboutAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 0,
  },
  aboutAnswerText: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.8,
  },
});
