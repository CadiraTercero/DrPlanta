import React from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

interface ThemedTextInputProps extends TextInputProps {
  // You can add custom props here if needed
}

/**
 * TextInput component that automatically uses the theme's placeholder color
 * This ensures consistent placeholder styling across development and production builds
 */
export const ThemedTextInput: React.FC<ThemedTextInputProps> = (props) => {
  const theme = useTheme();

  return (
    <TextInput
      {...props}
      placeholderTextColor={props.placeholderTextColor || theme.colors.placeholder}
      style={[styles.input, props.style]}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    // Base input styles that can be overridden
  },
});
