import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Card, Text, useTheme } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/RootNavigator';

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const theme = useTheme();
  const { login, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  /**
   * Handle login button press
   */
  const handleLogin = async () => {
    setError('');

    try {
      await login(email, password);
      // Navigation will happen automatically when user state changes
    } catch (error: any) {
      setError(error.message || 'Login failed. Please try again.');
    }
  };

  /**
   * Navigate to register screen
   */
  const handleNavigateToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text variant="displaySmall" style={[styles.title, { color: theme.colors.primary }]}>
            Welcome Back
          </Text>
          <Text variant="bodyLarge" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            Sign in to continue to DrPlantes
          </Text>

          <Card style={styles.card} mode="elevated">
            <Card.Content>
              {/* General Error Message */}
              {error && (
                <View style={styles.errorContainer}>
                  <Text style={[styles.errorText, { color: theme.colors.error }]}>
                    {error}
                  </Text>
                </View>
              )}

              {/* Email Input */}
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                disabled={loading}
                left={<TextInput.Icon icon="email" />}
                style={styles.input}
              />

              {/* Password Input */}
              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password"
                disabled={loading}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                style={styles.input}
              />

              {/* Login Button */}
              <Button
                mode="contained"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
                style={styles.button}
                contentStyle={styles.buttonContent}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              {/* Register Link */}
              <View style={styles.registerContainer}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Don't have an account?{' '}
                </Text>
                <Button
                  mode="text"
                  onPress={handleNavigateToRegister}
                  disabled={loading}
                  compact
                >
                  Sign Up
                </Button>
              </View>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
  },
  card: {
    width: '100%',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    marginBottom: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
});
