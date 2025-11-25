import { MD3Colors } from 'react-native-paper/lib/typescript/types';

export enum ThemeScheme {
  DEFAULT = 'default',
  HIGH_CONTRAST = 'highContrast',
  VIBRANT_RED = 'vibrantRed',
}

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}
export interface AppColors extends MD3Colors {
  backgrounds: {
    primary: string;
    secondary: string;
    tertiary: string;
    quaternary: string;
    quinary: string;
  };

  // Card colors
  card: string;
  cardBorder: string;

  // Common colors
  black: string;
  white: string;

  // Text colors
  text: string;
  textSecondary: string;
  textMuted: string;

  // Primary colors
  primaryLight: string;
  primaryDark: string;

  // Secondary colors
  secondaryLight: string;
  secondaryLightest: string;
  secondaryDark: string;
  secondaryDarker: string;

  // Status colors
  success: string;
  warning: string;
  info: string;

  // Border and divider colors
  border: string;
  divider: string;

  // Additional utility colors
  overlay: string;
  disabled: string;
  placeholder: string;

  // Input specific colors
  inputBackground: string;
  inputBorder: string;
  inputBorderHover: string;
  inputBorderFocused: string;
  inputBorderError: string;
  inputBackgroundDisabled: string;
  inputBackgroundReadOnly: string;
  inputBackgroundError: string;
  inputShadowFocused: string;
  inputShadowHover: string;
  inputText: string;
  inputTextPlaceholder: string;
  inputTextFilled: string;
  inputLabel: string;

  // Tabs
  tabCardBg: string;
  tabBorderColor: string;

  // Form Fields
  formFieldBg: string;

  // icon colors
  iconBg: string;

  // Profile and UI specific colors
  avatarBorder: string;
  cameraButton: string;
  editIconColor: string;
  menuItemIcon: string;
  menuItemChevron: string;
  menuItemSeparator: string;
  logoutCardBg: string;
  deleteButtonBorder: string;
  deleteButtonBg: string;

  // Dashboard card colors
  cardLayerBase: string;
  cardLayerMiddle: string;
  cardTextLight: string;
  cardTextLightest: string;

  // Searchbar colors
  searchbarFocusBorder: string;
  searchbarFocusShadow: string;

  // Radio button colors
  radioButtonActive: string;
  radioButtonBg: string;
}

export const LightThemeColors: AppColors = {
  backgrounds: {
    primary: '#F9FAFB',
    secondary: '#F9FAFB',
    tertiary: '#F3F4F6',
    quaternary: '#E5E7EB',
    quinary: '#D1D5DB',
  },
  primary: '#666BE7',
  onPrimary: 'rgb(255, 255, 255)',
  primaryContainer: 'rgb(240, 219, 255)',
  onPrimaryContainer: 'rgb(44, 0, 81)',
  secondary: '#8E8E93',
  onSecondary: 'rgb(255, 255, 255)',
  secondaryContainer: 'rgb(237, 221, 246)',
  onSecondaryContainer: 'rgb(33, 24, 42)',
  tertiary: 'rgb(128, 81, 88)',
  onTertiary: 'rgb(255, 255, 255)',
  tertiaryContainer: 'rgb(255, 217, 221)',
  onTertiaryContainer: 'rgb(50, 16, 23)',
  error: '#FF3B30',
  onError: 'rgb(255, 255, 255)',
  errorContainer: 'rgb(255, 218, 214)',
  onErrorContainer: 'rgb(65, 0, 2)',
  background: 'rgb(255, 251, 255)',
  onBackground: 'rgb(29, 27, 30)',
  surface: 'rgb(255, 251, 255)',
  onSurface: 'rgb(29, 27, 30)',
  surfaceVariant: 'rgb(233, 223, 235)',
  onSurfaceVariant: 'rgb(74, 69, 78)',
  outline: 'rgb(124, 117, 126)',
  outlineVariant: 'rgb(204, 196, 206)',
  shadow: '0 1px 2px 0 #E9E9E9',
  scrim: 'rgb(0, 0, 0)',
  inverseSurface: 'rgb(50, 47, 51)',
  inverseOnSurface: 'rgb(245, 239, 244)',
  inversePrimary: 'rgb(220, 184, 255)',
  elevation: {
    level0: 'transparent',
    level1: 'rgb(248, 242, 251)',
    level2: 'rgb(244, 236, 248)',
    level3: 'rgb(240, 231, 246)',
    level4: 'rgb(239, 229, 245)',
    level5: 'rgb(236, 226, 243)',
  },
  surfaceDisabled: 'rgba(29, 27, 30, 0.12)',
  onSurfaceDisabled: 'rgba(29, 27, 30, 0.38)',
  backdrop: 'rgba(51, 47, 55, 0.4)',
  // Custom colors
  // Card colors
  card: '#FFFFFF',
  cardBorder: 'rgba(87, 87, 87, 0.1)',

  // Common colors
  black: '#000000',
  white: '#FFFFFF',

  // Text colors
  text: '#1A1A1A',
  textSecondary: '#666666',
  textMuted: '#999999',

  // Primary colors
  primaryLight: '#5AC8FA',
  primaryDark: '#0051CC',

  // Secondary colors
  secondaryLight: '#C7C7CC',
  secondaryLightest: '#F7F8FB',
  secondaryDark: '#636366',
  secondaryDarker: '#F7F8FE',

  // Status colors
  success: '#34C759',
  warning: '#FF9500',

  info: '#5AC8FA',

  // Border and divider colors
  border: '#E2E4EB',
  divider: '#E5E7EB',

  // Additional utility colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  disabled: '#C7C7CC',
  placeholder: '#C7C7CC',

  // Input specific colors
  inputBackground: '#FFFFFF',
  inputBorder: '#E5E7EB',
  inputBorderHover: '#7F98F9',
  inputBorderFocused: '#7F98F9',
  inputBorderError: '#EF4444',
  inputBackgroundDisabled: '#F9FAFB',
  inputBackgroundReadOnly: '#F9FAFB',
  inputBackgroundError: 'rgba(254, 202, 202, 0.20)',
  inputShadowFocused: '#E0EAFF',
  inputShadowHover: '#F7F8FE',
  inputText: '#374151',
  inputTextPlaceholder: '#D1D5DB',
  inputTextFilled: '#4B5563',
  inputLabel: '#374151',

  // Tabs
  tabCardBg: '#F7F8FE',
  tabBorderColor: '#E2E4EB',

  // Form Fields
  formFieldBg: '#ffffff',

  // icon colors
  iconBg: '#ffffff',

  // Profile and UI specific colors
  avatarBorder: '#6C727E',
  cameraButton: '#6071F3',
  editIconColor: '#6071F3',
  menuItemIcon: '#384250',
  menuItemChevron: '#9CA3AF',
  menuItemSeparator: '#E2E4EB',
  logoutCardBg: '#F7F8FE',
  deleteButtonBorder: '#E5565C',
  deleteButtonBg: '#FEF3F2',

  // Dashboard card colors
  cardLayerBase: '#372d6e',
  cardLayerMiddle: '#ff4267',
  cardTextLight: '#e2e4eb',
  cardTextLightest: '#f7f8fe',

  // Searchbar colors
  searchbarFocusBorder: '#A3BBFD',
  searchbarFocusShadow: '#F0F1FB',

  // Radio button colors
  radioButtonActive: '#007bff',
  radioButtonBg: '#f8f9fa',
};

export const DarkThemeColors: AppColors = {
  backgrounds: {
    primary: '#111927',
    secondary: '#1F2937',
    tertiary: '#374151',
    quaternary: '#4B5563',
    quinary: '#6B7280',
  },
  primary: '#666BE7',
  onPrimary: 'rgb(71, 12, 122)',
  primaryContainer: 'rgb(95, 43, 146)',
  onPrimaryContainer: 'rgb(240, 219, 255)',
  secondary: '#8E8E93',
  onSecondary: 'rgb(54, 44, 63)',
  secondaryContainer: 'rgb(77, 67, 87)',
  onSecondaryContainer: 'rgb(237, 221, 246)',
  tertiary: 'rgb(243, 183, 190)',
  onTertiary: 'rgb(75, 37, 43)',
  tertiaryContainer: 'rgb(101, 58, 65)',
  onTertiaryContainer: 'rgb(255, 217, 221)',
  error: '#FF453A',
  onError: 'rgb(105, 0, 5)',
  errorContainer: 'rgb(147, 0, 10)',
  onErrorContainer: 'rgb(255, 180, 171)',
  background: '#121826',
  onBackground: 'rgb(231, 225, 229)',
  surface: '#1C1C1E',
  onSurface: 'rgb(231, 225, 229)',
  surfaceVariant: 'rgb(74, 69, 78)',
  onSurfaceVariant: 'rgb(204, 196, 206)',
  outline: 'rgb(150, 142, 152)',
  outlineVariant: 'rgb(74, 69, 78)',
  shadow: '0 1px 1px 0 #3B3D45',
  scrim: 'rgb(0, 0, 0)',
  inverseSurface: 'rgb(231, 225, 229)',
  inverseOnSurface: 'rgb(50, 47, 51)',
  inversePrimary: 'rgb(120, 69, 172)',
  elevation: {
    level0: 'transparent',
    level1: 'rgb(39, 35, 41)',
    level2: 'rgb(44, 40, 48)',
    level3: 'rgb(50, 44, 55)',
    level4: 'rgb(52, 46, 57)',
    level5: 'rgb(56, 49, 62)',
  },
  surfaceDisabled: 'rgba(231, 225, 229, 0.12)',
  onSurfaceDisabled: 'rgba(231, 225, 229, 0.38)',
  backdrop: 'rgba(51, 47, 55, 0.4)',
  // Custom colors
  // Card
  card: '#1F2937',
  cardBorder: '#1F2937',

  // Common colors
  black: '#000000',
  white: '#FFFFFF',

  // Text colors
  text: '#FFFFFF',
  textSecondary: '#E2E4EB',
  textMuted: '#878B9E',

  // Primary colors
  primaryLight: '#64D2FF',
  primaryDark: '#0056CC',

  // Secondary colors
  secondaryLight: '#C7C7CC',
  secondaryLightest: '#F7F8FB',
  secondaryDark: '#424B66',
  secondaryDarker: '#22293B',

  // Status colors
  success: '#30D158',
  warning: '#FF9F0A',

  info: '#64D2FF',

  // Border and divider colors
  border: '#2B3141',
  divider: '#48484A',

  // Additional utility colors
  overlay: 'rgba(0, 0, 0, 0.7)',
  disabled: '#48484A',
  placeholder: '#8E8E93',

  // Input specific colors
  inputBackground: '#1E293B',
  inputBorder: '#334155',
  inputBorderHover: '#7F98F9',
  inputBorderFocused: '#7F98F9',
  inputBorderError: '#EF4444',
  inputBackgroundDisabled: '#1E293B',
  inputBackgroundReadOnly: '#1E293B',
  inputBackgroundError: 'rgba(254, 202, 202, 0.20)',
  inputShadowFocused: '#1F2A37',
  inputShadowHover: 'rgba(75, 85, 99, 0.20)',
  inputText: '#F9FAFB',
  inputTextPlaceholder: '#D1D5DB',
  inputTextFilled: '#E5E7EB',
  inputLabel: '#F9FAFB',

  // Tabs
  tabCardBg: '#22293B',
  tabBorderColor: '#444D5B',

  // Form Fields
  formFieldBg: '#252B3B',

  // icon colors
  iconBg: '#6466F1',

  // Profile and UI specific colors
  avatarBorder: '#F7F8FE',
  cameraButton: 'rgba(18, 24, 38, 0.4)',
  editIconColor: '#C9CCD9',
  menuItemIcon: '#FFFFFF',
  menuItemChevron: '#FFFFFF',
  menuItemSeparator: 'rgba(74, 84, 97, 0.6)',
  logoutCardBg: '#22293B',
  deleteButtonBorder: '#FF453A',
  deleteButtonBg: '#4B1818',

  // Dashboard card colors
  cardLayerBase: '#2a2561',
  cardLayerMiddle: '#d83657',
  cardTextLight: '#e2e4eb',
  cardTextLightest: '#f7f8fe',

  // Searchbar colors
  searchbarFocusBorder: '#8BA9F3',
  searchbarFocusShadow: '#2A2F3F',

  // Radio button colors
  radioButtonActive: '#3399ff',
  radioButtonBg: '#2A2F3F',
};

export const HighContrastLightThemeColors: AppColors = {
  backgrounds: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    tertiary: '#F3F4F6',
    quaternary: '#E5E7EB',
    quinary: '#D1D5DB',
  },
  primary: '#1A1AFF', // brighter blue
  onPrimary: '#FFFFFF',
  primaryContainer: '#DDE1FF',
  onPrimaryContainer: '#000066',

  secondary: '#3D3D3D',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#E0E0E0',
  onSecondaryContainer: '#000000',

  tertiary: '#A51429',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#FFD9DE',
  onTertiaryContainer: '#4A0B10',

  error: '#B00020',
  onError: '#FFFFFF',
  errorContainer: '#FFDAD4',
  onErrorContainer: '#370001',

  background: '#FFFFFF',
  onBackground: '#000000',

  surface: '#FFFFFF',
  onSurface: '#000000',

  surfaceVariant: '#D0D0D0',
  onSurfaceVariant: '#1A1A1A',

  outline: '#000000',
  outlineVariant: '#4A4A4A',

  shadow: '0 2px 4px rgba(0, 0, 0, 0.4)',
  scrim: 'rgba(0, 0, 0, 0.6)',

  inverseSurface: '#1A1A1A',
  inverseOnSurface: '#FFFFFF',
  inversePrimary: '#0033CC',

  elevation: {
    level0: 'transparent',
    level1: '#F2F2F2',
    level2: '#E6E6E6',
    level3: '#DADADA',
    level4: '#CFCFCF',
    level5: '#C4C4C4',
  },

  surfaceDisabled: 'rgba(0, 0, 0, 0.12)',
  onSurfaceDisabled: 'rgba(0, 0, 0, 0.38)',

  backdrop: 'rgba(0, 0, 0, 0.5)',

  // Custom colors
  card: '#FFFFFF',
  cardBorder: 'rgba(0, 0, 0, 0.2)',

  black: '#000000',
  white: '#FFFFFF',

  // Text colors
  text: '#000000',
  textSecondary: '#1A1A1A',
  textMuted: '#333333',

  // Primary colors
  primaryLight: '#3366FF',
  primaryDark: '#001A66',

  // Secondary colors
  secondaryLight: '#E5E5EA',
  secondaryLightest: '#F9F9FC',
  secondaryDark: '#333333',
  secondaryDarker: '#EDEDED',

  // Status colors
  success: '#007E33',
  warning: '#FF8800',
  info: '#0099CC',

  // Border and divider colors
  border: '#000000',
  divider: '#4A4A4A',

  // Utility colors
  overlay: 'rgba(0, 0, 0, 0.6)',
  disabled: '#A0A0A0',
  placeholder: '#666666',

  // Input specific colors
  inputBackground: '#FFFFFF',
  inputBorder: '#000000',
  inputBorderHover: '#1A1AFF',
  inputBorderFocused: '#1A1AFF',
  inputBorderError: '#B00020',
  inputBackgroundDisabled: '#F9FAFB',
  inputBackgroundReadOnly: '#F9FAFB',
  inputBackgroundError: 'rgba(255, 218, 212, 0.40)',
  inputShadowFocused: '#DDE1FF',
  inputShadowHover: '#F0F0FF',
  inputText: '#000000',
  inputTextPlaceholder: '#666666',
  inputTextFilled: '#1A1A1A',
  inputLabel: '#000000',

  // Tabs
  tabCardBg: '#F0F0FF',
  tabBorderColor: '#000000',

  // Form fields
  formFieldBg: '#FFFFFF',

  // icon colors
  iconBg: '#6466F1',

  // Profile and UI specific colors
  avatarBorder: '#000000',
  cameraButton: '#1A1AFF',
  editIconColor: '#1A1AFF',
  menuItemIcon: '#000000',
  menuItemChevron: '#4A4A4A',
  menuItemSeparator: '#000000',
  logoutCardBg: '#F9F9FC',
  deleteButtonBorder: '#B00020',
  deleteButtonBg: '#FFDAD4',

  // Dashboard card colors
  cardLayerBase: '#1A1AFF',
  cardLayerMiddle: '#B00020',
  cardTextLight: '#000000',
  cardTextLightest: '#1A1A1A',

  // Searchbar colors
  searchbarFocusBorder: '#1A1AFF',
  searchbarFocusShadow: '#DDE1FF',

  // Radio button colors
  radioButtonActive: '#1A1AFF',
  radioButtonBg: '#F9F9FC',
};
export const HighContrastDarkThemeColors: AppColors = {
  backgrounds: {
    primary: '#101827',
    secondary: '#1F2937',
    tertiary: '#374151',
    quaternary: '#4B5563',
    quinary: '#6B7280',
  },
  primary: '#6690FF',
  onPrimary: '#000000',
  primaryContainer: '#0033CC',
  onPrimaryContainer: '#FFFFFF',

  secondary: '#AAAAAA',
  onSecondary: '#000000',
  secondaryContainer: '#444444',
  onSecondaryContainer: '#FFFFFF',

  tertiary: '#FF8BA7',
  onTertiary: '#000000',
  tertiaryContainer: '#9A2956',
  onTertiaryContainer: '#FFFFFF',

  error: '#FF453A',
  onError: '#000000',
  errorContainer: '#7A0000',
  onErrorContainer: '#FFFFFF',

  background: '#000000',
  onBackground: '#FFFFFF',

  surface: '#121212',
  onSurface: '#FFFFFF',

  surfaceVariant: '#2C2C2C',
  onSurfaceVariant: '#E0E0E0',

  outline: '#BBBBBB',
  outlineVariant: '#666666',

  shadow: '0 2px 6px rgba(0, 0, 0, 0.8)',
  scrim: 'rgba(0, 0, 0, 0.7)',

  inverseSurface: '#FFFFFF',
  inverseOnSurface: '#000000',
  inversePrimary: '#B3CCFF',

  elevation: {
    level0: 'transparent',
    level1: '#1A1A1A',
    level2: '#222222',
    level3: '#2C2C2C',
    level4: '#333333',
    level5: '#3B3B3B',
  },

  surfaceDisabled: 'rgba(255, 255, 255, 0.12)',
  onSurfaceDisabled: 'rgba(255, 255, 255, 0.38)',

  backdrop: 'rgba(0, 0, 0, 0.6)',

  // Custom colors
  card: '#1C1C1C',
  cardBorder: 'rgba(255, 255, 255, 0.15)',

  black: '#000000',
  white: '#FFFFFF',

  // Text colors
  text: '#FFFFFF',
  textSecondary: '#DDDDDD',
  textMuted: '#AAAAAA',

  // Primary colors
  primaryLight: '#80B3FF',
  primaryDark: '#003399',

  // Secondary colors
  secondaryLight: '#C7C7CC',
  secondaryLightest: '#1F1F1F',
  secondaryDark: '#AAAAAA',
  secondaryDarker: '#2E2E2E',

  // Status colors
  success: '#32D74B',
  warning: '#FFD60A',
  info: '#64D2FF',

  // Border and divider colors
  border: '#666666',
  divider: '#3A3A3A',

  // Additional utility colors
  overlay: 'rgba(255, 255, 255, 0.1)',
  disabled: '#555555',
  placeholder: '#888888',

  // Input specific colors
  inputBackground: '#121212',
  inputBorder: '#BBBBBB',
  inputBorderHover: '#6690FF',
  inputBorderFocused: '#6690FF',
  inputBorderError: '#FF453A',
  inputBackgroundDisabled: '#1A1A1A',
  inputBackgroundReadOnly: '#1A1A1A',
  inputBackgroundError: 'rgba(122, 0, 0, 0.40)',
  inputShadowFocused: '#0033CC',
  inputShadowHover: 'rgba(102, 144, 255, 0.20)',
  inputText: '#FFFFFF',
  inputTextPlaceholder: '#888888',
  inputTextFilled: '#E0E0E0',
  inputLabel: '#FFFFFF',

  // Tabs
  tabCardBg: '#1E1E1E',
  tabBorderColor: '#666666',

  // Form Fields
  formFieldBg: '#1A1A1A',

  // icon colors
  iconBg: '#6466F1',

  // Profile and UI specific colors
  avatarBorder: '#BBBBBB',
  cameraButton: '#6690FF',
  editIconColor: '#AAAAAA',
  menuItemIcon: '#FFFFFF',
  menuItemChevron: '#666666',
  menuItemSeparator: '#666666',
  logoutCardBg: '#1E1E1E',
  deleteButtonBorder: '#FF453A',
  deleteButtonBg: '#7A0000',

  // Dashboard card colors
  cardLayerBase: '#0033CC',
  cardLayerMiddle: '#7A0000',
  cardTextLight: '#FFFFFF',
  cardTextLightest: '#E0E0E0',

  // Searchbar colors
  searchbarFocusBorder: '#6690FF',
  searchbarFocusShadow: '#0033CC',

  // Radio button colors
  radioButtonActive: '#6690FF',
  radioButtonBg: '#1E1E1E',
};

export const VibrantRedLightThemeColors: AppColors = {
  backgrounds: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    tertiary: '#F3F4F6',
    quaternary: '#E5E7EB',
    quinary: '#D1D5DB',
  },
  primary: '#DF1C59',
  onPrimary: 'rgb(255, 255, 255)',
  primaryContainer: 'rgb(240, 219, 255)',
  onPrimaryContainer: 'rgb(44, 0, 81)',
  secondary: '#8E8E93',
  onSecondary: 'rgb(255, 255, 255)',
  secondaryContainer: 'rgb(237, 221, 246)',
  onSecondaryContainer: 'rgb(33, 24, 42)',
  tertiary: 'rgb(128, 81, 88)',
  onTertiary: 'rgb(255, 255, 255)',
  tertiaryContainer: 'rgb(255, 217, 221)',
  onTertiaryContainer: 'rgb(50, 16, 23)',
  error: '#FF3B30',
  onError: 'rgb(255, 255, 255)',
  errorContainer: 'rgb(255, 218, 214)',
  onErrorContainer: 'rgb(65, 0, 2)',
  background: 'rgb(255, 251, 255)',
  onBackground: 'rgb(29, 27, 30)',
  surface: 'rgb(255, 251, 255)',
  onSurface: 'rgb(29, 27, 30)',
  surfaceVariant: 'rgb(233, 223, 235)',
  onSurfaceVariant: 'rgb(74, 69, 78)',
  outline: 'rgb(124, 117, 126)',
  outlineVariant: 'rgb(204, 196, 206)',
  shadow: '0 1px 2px 0 #cbced8',
  scrim: 'rgb(0, 0, 0)',
  inverseSurface: 'rgb(50, 47, 51)',
  inverseOnSurface: 'rgb(245, 239, 244)',
  inversePrimary: 'rgb(220, 184, 255)',
  elevation: {
    level0: 'transparent',
    level1: 'rgb(248, 242, 251)',
    level2: 'rgb(244, 236, 248)',
    level3: 'rgb(240, 231, 246)',
    level4: 'rgb(239, 229, 245)',
    level5: 'rgb(236, 226, 243)',
  },
  surfaceDisabled: 'rgba(29, 27, 30, 0.12)',
  onSurfaceDisabled: 'rgba(29, 27, 30, 0.38)',
  backdrop: 'rgba(51, 47, 55, 0.4)',
  // Custom colors
  // Card colors
  card: '#FFFFFF',
  cardBorder: 'rgba(87, 87, 87, 0.1)',

  // Common colors
  black: '#000000',
  white: '#FFFFFF',

  // Text colors
  text: '#1A1A1A',
  textSecondary: '#666666',
  textMuted: '#999999',

  // Primary colors
  primaryLight: '#5AC8FA',
  primaryDark: '#0051CC',

  // Secondary colors
  secondaryLight: '#C7C7CC',
  secondaryLightest: '#F7F8FB',
  secondaryDark: '#636366',
  secondaryDarker: '#F7F8FE',

  // Status colors
  success: '#34C759',
  warning: '#FF9500',

  info: '#5AC8FA',

  // Border and divider colors
  border: '#E2E4EB',
  divider: '#E5E7EB',

  // Additional utility colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  disabled: '#C7C7CC',
  placeholder: '#C7C7CC',

  // Input specific colors
  inputBackground: '#FFFFFF',
  inputBorder: '#E5E7EB',
  inputBorderHover: '#DF1C59',
  inputBorderFocused: '#DF1C59',
  inputBorderError: '#FF3B30',
  inputBackgroundDisabled: '#F9FAFB',
  inputBackgroundReadOnly: '#F9FAFB',
  inputBackgroundError: 'rgba(254, 202, 202, 0.20)',
  inputShadowFocused: '#FFE5ED',
  inputShadowHover: '#FFF0F5',
  inputText: '#374151',
  inputTextPlaceholder: '#D1D5DB',
  inputTextFilled: '#4B5563',
  inputLabel: '#374151',

  // Tabs
  tabCardBg: '#F7F8FE',
  tabBorderColor: '#E2E4EB',

  // Form Fields
  formFieldBg: '#ffffff',

  // icon colors
  iconBg: '#6466F1',

  // Profile and UI specific colors
  avatarBorder: '#6C727E',
  cameraButton: '#DF1C59',
  editIconColor: '#DF1C59',
  menuItemIcon: '#384250',
  menuItemChevron: '#9DA4AE',
  menuItemSeparator: '#E2E4EB',
  logoutCardBg: '#F7F8FE',
  deleteButtonBorder: '#E5565C',
  deleteButtonBg: '#FEF3F2',

  // Dashboard card colors
  cardLayerBase: '#7A1744',
  cardLayerMiddle: '#B02050',
  cardTextLight: '#e2e4eb',
  cardTextLightest: '#f7f8fe',

  // Searchbar colors
  searchbarFocusBorder: '#DF1C59',
  searchbarFocusShadow: '#FFE5ED',

  // Radio button colors
  radioButtonActive: '#DF1C59',
  radioButtonBg: '#FFF0F5',
};
export const VibrantRedDarkThemeColors: AppColors = {
  backgrounds: {
    primary: '#101827',
    secondary: '#1F2937',
    tertiary: '#374151',
    quaternary: '#4B5563',
    quinary: '#6B7280',
  },
  primary: '#DF1C59',
  onPrimary: 'rgb(122, 12, 63)',
  primaryContainer: 'rgb(146, 43, 83)',
  onPrimaryContainer: 'rgb(255, 219, 238)',
  secondary: '#8E8E93',
  onSecondary: 'rgb(63, 44, 54)',
  secondaryContainer: 'rgb(87, 67, 78)',
  onSecondaryContainer: 'rgb(246, 221, 234)',
  tertiary: 'rgb(243, 183, 190)',
  onTertiary: 'rgb(75, 37, 43)',
  tertiaryContainer: 'rgb(101, 58, 65)',
  onTertiaryContainer: 'rgb(255, 217, 221)',
  error: '#FF453A',
  onError: 'rgb(105, 0, 5)',
  errorContainer: 'rgb(147, 0, 10)',
  onErrorContainer: 'rgb(255, 180, 171)',
  background: '#121826',
  onBackground: 'rgb(231, 225, 229)',
  surface: '#1C1C1E',
  onSurface: 'rgb(231, 225, 229)',
  surfaceVariant: 'rgb(74, 69, 78)',
  onSurfaceVariant: 'rgb(204, 196, 206)',
  outline: 'rgb(150, 142, 152)',
  outlineVariant: 'rgb(74, 69, 78)',
  shadow: '0 1px 1px 0 #3b3d45',
  scrim: 'rgb(0, 0, 0)',
  inverseSurface: 'rgb(231, 225, 229)',
  inverseOnSurface: 'rgb(51, 47, 48)',
  inversePrimary: 'rgb(172, 69, 129)',
  elevation: {
    level0: 'transparent',
    level1: 'rgb(39, 35, 41)',
    level2: 'rgb(44, 40, 48)',
    level3: 'rgb(50, 44, 55)',
    level4: 'rgb(52, 46, 57)',
    level5: 'rgb(56, 49, 62)',
  },
  surfaceDisabled: 'rgba(231, 225, 229, 0.12)',
  onSurfaceDisabled: 'rgba(231, 225, 229, 0.38)',
  backdrop: 'rgba(51, 47, 55, 0.4)',
  // Custom colors
  // Card
  card: 'rgba(51, 59, 81, 0.5)',
  cardBorder: 'rgba(87, 87, 87, 0.1)',

  // Common colors
  black: '#000000',
  white: '#FFFFFF',

  // Text colors
  text: '#FFFFFF',
  textSecondary: '#EBEBF5',
  textMuted: '#8E8E93',

  // Primary colors
  primaryLight: '#64D2FF',
  primaryDark: '#0056CC',

  // Secondary colors
  secondaryLight: '#C7C7CC',
  secondaryLightest: '#F7F8FB',
  secondaryDark: '#424B66',
  secondaryDarker: '#22293B',

  // Status colors
  success: '#30D158',
  warning: '#FF9F0A',

  info: '#64D2FF',

  // Border and divider colors
  border: '#2B3141',
  divider: '#48484A',

  // Additional utility colors
  overlay: 'rgba(0, 0, 0, 0.7)',
  disabled: '#48484A',
  placeholder: '#8E8E93',

  // Input specific colors
  inputBackground: '#1E293B',
  inputBorder: '#334155',
  inputBorderHover: '#DF1C59',
  inputBorderFocused: '#DF1C59',
  inputBorderError: '#FF453A',
  inputBackgroundDisabled: '#1E293B',
  inputBackgroundReadOnly: '#1E293B',
  inputBackgroundError: 'rgba(254, 202, 202, 0.20)',
  inputShadowFocused: '#2E1827',
  inputShadowHover: 'rgba(223, 28, 89, 0.20)',
  inputText: '#F9FAFB',
  inputTextPlaceholder: '#D1D5DB',
  inputTextFilled: '#E5E7EB',
  inputLabel: '#F9FAFB',

  // Tabs
  tabCardBg: '#22293B',
  tabBorderColor: '#444D5B',

  // Form Fields
  formFieldBg: '#252B3B',

  // icon colors
  iconBg: '#6466F1',

  // Profile and UI specific colors
  avatarBorder: '#6B7280',
  cameraButton: '#DF1C59',
  editIconColor: '#C9CCD9',
  menuItemIcon: '#E5E7EB',
  menuItemChevron: '#9CA3AF',
  menuItemSeparator: 'rgba(74, 84, 97, 0.6)',
  logoutCardBg: '#22293B',
  deleteButtonBorder: '#FF453A',
  deleteButtonBg: '#4B1818',

  // Dashboard card colors
  cardLayerBase: '#5A1434',
  cardLayerMiddle: '#9A1744',
  cardTextLight: '#EBEBF5',
  cardTextLightest: '#FFFFFF',

  // Searchbar colors
  searchbarFocusBorder: '#DF1C59',
  searchbarFocusShadow: '#2E1827',

  // Radio button colors
  radioButtonActive: '#DF1C59',
  radioButtonBg: '#2E1827',
};
