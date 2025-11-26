import {
  ThemeScheme,
  DarkThemeColors,
  HighContrastDarkThemeColors,
  HighContrastLightThemeColors,
  LightThemeColors,
  ThemeMode,
  VibrantRedDarkThemeColors,
  VibrantRedLightThemeColors,
} from '@/constants/Colors';
import { StorageKeys } from '@/constants/localStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Appearance } from 'react-native';
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  useTheme,
} from 'react-native-paper';

interface ThemeContextType {
  isDark: boolean;
  themeMode: ThemeMode;
  themeScheme: ThemeScheme;
  toggleTheme: () => void;
  handleThemeManualSwitch: (mode: ThemeMode) => void;
  handleThemeSchemeSwitch: (scheme: ThemeScheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const appDarkTheme = {
  ...MD3DarkTheme,
  colors: DarkThemeColors,
};
const appLightTheme = {
  ...MD3LightTheme,
  colors: LightThemeColors,
};

const appHighContrastLightTheme = {
  ...MD3LightTheme,
  colors: HighContrastLightThemeColors,
};
const appHighContrastDarkTheme = {
  ...MD3DarkTheme,
  colors: HighContrastDarkThemeColors,
};

const appVibrantRedLightTheme = {
  ...MD3LightTheme,
  colors: VibrantRedLightThemeColors,
};
const appVibrantRedDarkTheme = {
  ...MD3DarkTheme,
  colors: VibrantRedDarkThemeColors,
};

const getTheme = (isDark: boolean, scheme: ThemeScheme) => {
  switch (scheme) {
    case ThemeScheme.DEFAULT:
      return isDark ? appDarkTheme : appLightTheme;

    case ThemeScheme.HIGH_CONTRAST:
      return isDark ? appHighContrastDarkTheme : appHighContrastLightTheme;

    case ThemeScheme.VIBRANT_RED:
      return isDark ? appVibrantRedDarkTheme : appVibrantRedLightTheme;
    default:
      return isDark ? appDarkTheme : appLightTheme;
  }
};
const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(ThemeMode.SYSTEM);
  const [themeScheme, setThemeScheme] = useState<ThemeScheme>(
    ThemeScheme.DEFAULT,
  );
  // Fetch system mode, light or dark
  const colorScheme = Appearance.getColorScheme();

  const isDark =
    themeMode === ThemeMode.DARK ||
    (themeMode === ThemeMode.SYSTEM && colorScheme === ThemeMode.DARK);

  const toggleTheme = () => {
    setThemeMode((prev) =>
      prev === ThemeMode.DARK || isDark ? ThemeMode.LIGHT : ThemeMode.DARK,
    );
  };

  useEffect(() => {
    // Set previously stored theme mode, theme scheme
    (async () => {
      const storedThemeMode = await AsyncStorage.getItem(StorageKeys.ThemeMode);
      const storedThemeScheme = await AsyncStorage.getItem(
        StorageKeys.ThemeScheme,
      );

      if (
        storedThemeMode === ThemeMode.LIGHT ||
        storedThemeMode === ThemeMode.DARK ||
        storedThemeMode === ThemeMode.SYSTEM
      ) {
        setThemeMode(storedThemeMode);
      }

      if (
        storedThemeScheme === ThemeScheme.DEFAULT ||
        storedThemeScheme === ThemeScheme.HIGH_CONTRAST ||
        storedThemeScheme === ThemeScheme.VIBRANT_RED
      ) {
        setThemeScheme(storedThemeScheme);
      }
    })();
  }, []);

  // Write current theme mode to local storage
  useEffect(() => {
    AsyncStorage.setItem(StorageKeys.ThemeMode, themeMode);
  }, [themeMode]);

  // Write current theme scheme to local storage
  useEffect(() => {
    AsyncStorage.setItem(StorageKeys.ThemeScheme, themeScheme);
  }, [themeScheme]);

  const handleThemeManualSwitch = (mode: ThemeMode) => {
    switch (mode) {
      case ThemeMode.DARK:
        setThemeMode(ThemeMode.DARK);
        break;
      case ThemeMode.LIGHT:
        setThemeMode(ThemeMode.LIGHT);
        break;
      case ThemeMode.SYSTEM:
        setThemeMode(ThemeMode.SYSTEM);
        break;

      default:
        setThemeMode(ThemeMode.SYSTEM);
        break;
    }
  };

  const handleThemeSchemeSwitch = (scheme: ThemeScheme) => {
    switch (scheme) {
      case ThemeScheme.DEFAULT:
        setThemeScheme(ThemeScheme.DEFAULT);
        break;
      case ThemeScheme.HIGH_CONTRAST:
        setThemeScheme(ThemeScheme.HIGH_CONTRAST);
        break;
      case ThemeScheme.VIBRANT_RED:
        setThemeScheme(ThemeScheme.VIBRANT_RED);
        break;
      default:
        setThemeScheme(ThemeScheme.DEFAULT);
        break;
    }
  };
  const value = useMemo(
    () => ({
      isDark,
      themeMode,
      themeScheme,
      toggleTheme,
      handleThemeManualSwitch,
      handleThemeSchemeSwitch,
    }),
    [themeMode, isDark, themeScheme],
  );
  const theme = useMemo(() => {
    return getTheme(isDark, themeScheme);
  }, [themeScheme, isDark]);

  return (
    <ThemeContext.Provider value={value}>
      <PaperProvider theme={theme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
};
export type AppTheme = typeof appDarkTheme | typeof appLightTheme;
export const useAppTheme = () => useTheme<AppTheme>();
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProvider');
  }
  return context;
};
export default ThemeProvider;
