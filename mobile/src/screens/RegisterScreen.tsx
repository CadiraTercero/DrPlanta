import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Card, Text, useTheme } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/RootNavigator';

type RegisterScreenProps = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const theme = useTheme();
  const { register, loading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  /**
   * Handle register button press
   */
  const handleRegister = async () => {
    setError('');

    try {
      await register(email, password, name);
      // Navigation will happen automatically when user state changes
    } catch (error: any) {
      setError(error.message || 'Registration failed. Please try again.');
    }
  };

  /**
   * Navigate to login screen
   */
  const handleNavigateToLogin = () => {
    navigation.navigate('Login');
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
            Create Account
          </Text>
          <Text variant="bodyLarge" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            Join DrPlantes and start your plant journey
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

              {/* Name Input */}
              <TextInput
                label="Full Name"
                value={name}
                onChangeText={setName}
                mode="outlined"
                autoCapitalize="words"
                autoComplete="name"
                disabled={loading}
                left={<TextInput.Icon icon="account" />}
                style={styles.input}
              />

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
                autoComplete="password-new"
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

              {/* Confirm Password Input */}
              <TextInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                mode="outlined"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoComplete="password-new"
                disabled={loading}
                left={<TextInput.Icon icon="lock-check" />}
                right={
                  <TextInput.Icon
                    icon={showConfirmPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                }
                style={styles.input}
              />

              {/* Register Button */}
              <Button
                mode="contained"
                onPress={handleRegister}
                loading={loading}
                disabled={loading}
                style={styles.button}
                contentStyle={styles.buttonContent}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>

              {/* Login Link */}
              <View style={styles.loginContainer}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Already have an account?{' '}
                </Text>
                <Button
                  mode="text"
                  onPress={handleNavigateToLogin}
                  disabled={loading}
                  compact
                >
                  Sign In
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
});
