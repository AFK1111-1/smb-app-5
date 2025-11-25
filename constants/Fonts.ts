/**
 * Font family constants for the application
 * Using Inter font family with various weights
 */
export const Fonts = {
  light: 'Inter_300Light',
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export type FontFamily = (typeof Fonts)[keyof typeof Fonts];
