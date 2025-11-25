import React from 'react';
import HelpTemplate from '@/screens/HelpScreen/HelpScreen';
import { useTranslation } from 'react-i18next';

const faqData = [
  {
    question: 'How do I reset my password?',
    answer:
      "On the login screen, tap 'Forgot Password?' and enter your email address. You'll receive a password reset link in your email inbox.",
  },
  {
    question: 'How do I change my profile information?',
    answer:
      "Go to Settings > Profile and tap on any field you want to edit. Make your changes and tap 'Save' to update your information.",
  },
  {
    question: 'How do I enable/disable notifications?',
    answer:
      'Navigate to Settings > Notifications where you can toggle different types of notifications on or off according to your preferences.',
  },
  {
    question: 'How do I change the app theme?',
    answer:
      "In Settings, you'll find theme options where you can choose between Light, Dark, or System theme that follows your device's settings.",
  },
  {
    question: 'Is my data secure?',
    answer:
      'Yes, we take data security seriously. All your information is encrypted and stored securely. We never share your personal data with third parties without your consent.',
  },
  {
    question: 'How do I delete my account?',
    answer:
      "To delete your account, please contact our support team at support@insighture.com. We'll process your request within 24-48 hours.",
  },
  {
    question: 'The app is running slowly, what should I do?',
    answer:
      'Try closing and reopening the app, ensure you have the latest version installed, and restart your device. If issues persist, contact support.',
  },
  {
    question: 'How do I contact customer support?',
    answer:
      "You can reach our support team via email at support@insighture.com or through the 'Send Feedback' option in Settings.",
  },
];
export default function HelpScreen() {
  const {t} = useTranslation()
   return <HelpTemplate data={faqData}  t={t}/>;
}
