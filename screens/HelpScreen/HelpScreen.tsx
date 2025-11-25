import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { useAppTheme } from '@/context/ThemeContext';
import { Button, Card } from '@/components/ui';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { Fonts } from '@/constants/Fonts';
import { AppColors } from '@/constants/Colors';

interface HelpScreenProps {
  data: { question: string; answer: string }[];
  t:  TFunction<"translation", undefined>
  title?: string;
}
export default function HelpScreen({ data: faqData,t, title }: HelpScreenProps) {
  const { colors } = useAppTheme();
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const styles = useMemo(() => createStyles(colors), [colors]);

  const toggleExpanded = (index: number) => {
    setExpandedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          {title && (
            <Text style={styles.titleText}>{title}</Text>
          )}
          <Text style={[styles.description, { color: colors.textSecondary }]}>
           {t("setting.help.description")}
          </Text>
        </View>

        <View style={styles.faqContainer}>
          {faqData.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              isExpanded={expandedItems.includes(index)}
              onToggle={() => toggleExpanded(index)}
            />
          ))}
        </View>
        <Card>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('setting.help.actions.support.title')}
            </Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              {t('setting.help.actions.support.description')}
            </Text>
            <View>
              <Button mode="contained">{t('setting.help.actions.support.cta')}</Button>
            </View>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

const FAQItem = ({
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
    <View style={[styles.faqItem, { backgroundColor: colors.secondaryDarker }]}>
      <TouchableOpacity
        style={styles.faqHeader}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Text style={[styles.faqQuestion, { color: colors.text }]}>
          {question}
        </Text>
        <MaterialCommunityIcons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          color={colors.text}
        />
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.faqAnswer}>
          <Text style={[styles.faqAnswerText, { color: colors.textSecondary }]}>
            {answer}
          </Text>
        </View>
      )}
    </View>
  );
};

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    scrollView: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollViewContent: {
      paddingBottom: 20,
    },
    container: {
      flex: 1,
      padding: 20,
    },
    titleText: {
      fontSize: 24,
      textAlign: 'center',
      color: colors.text,
    },
    header: {
      marginBottom: 30,
    },
    subtitle: {
      fontSize: 20,
      fontFamily: Fonts.semiBold,
      marginBottom: 16,
    },
    description: {
      fontSize: 16,
      lineHeight: 24,
      opacity: 0.9,
    },
    faqContainer: {
      marginBottom: 30,
    },
    faqItem: {
      borderRadius: 8,
      marginBottom: 12,
      overflow: 'hidden',
    },
    faqHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
    },
    faqQuestion: {
      fontSize: 16,
      fontFamily: Fonts.semiBold,
      flex: 1,
      marginRight: 12,
    },
    faqAnswer: {
      paddingHorizontal: 16,
      paddingBottom: 16,
      paddingTop: 0,
    },
    faqAnswerText: {
      fontSize: 15,
      lineHeight: 22,
      opacity: 0.8,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: Fonts.semiBold,
      marginBottom: 18,
      textAlign: 'center',
    },
    sectionText: {
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 16,
    },
    contactInfo: {
      padding: 16,
      borderRadius: 8,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    contactText: {
      fontSize: 15,
      lineHeight: 24,
    },
    footer: {
      marginTop: 20,
      paddingTop: 20,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    footerText: {
      fontSize: 16,
      fontFamily: Fonts.medium,
      textAlign: 'center',
    },
  });
