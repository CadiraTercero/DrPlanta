import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

/**
 * Custom theme configuration for React Native Paper
 * Based on Material Design 3
 */

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#4CAF50', // Green for plant theme
    primaryContainer: '#C8E6C9',
    secondary: '#8BC34A',
    secondaryContainer: '#DCEDC8',
    tertiary: '#66BB6A',
    error: '#B00020',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    onPrimary: '#FFFFFF',
    onSecondary: '#000000',
    onBackground: '#000000',
    onSurface: '#000000',
    placeholder: '#999999', // Placeholder text color
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#66BB6A',
    primaryContainer: '#2E7D32',
    secondary: '#9CCC65',
    secondaryContainer: '#558B2F',
    tertiary: '#81C784',
    error: '#CF6679',
    background: '#121212',
    surface: '#1E1E1E',
    onPrimary: '#000000',
    onSecondary: '#000000',
    onBackground: '#FFFFFF',
    onSurface: '#FFFFFF',
  },
};

export type ThemeType = typeof lightTheme;
