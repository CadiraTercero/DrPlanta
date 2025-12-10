import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Text, Button, Avatar, Divider, useTheme, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { getGuestPlants } from '../utils/storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/RootNavigator';
import api from '../services/api';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export default function ProfileScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { user, logout, loading: authLoading, isGuestMode, hasLocalData, syncGuestData } = useAuth();
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileData, setProfileData] = useState(user);
  const [plantCount, setPlantCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  /**
   * Fetch fresh profile data
   */
  const fetchProfile = async () => {
    try {
      setLoadingProfile(true);
      const response = await api.get('/users/profile');
      setProfileData(response.data);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoadingProfile(false);
    }
  };

  /**
   * Handle logout with confirmation
   */
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  /**
   * Handle navigation to register/login screens
   */
  const handleNavigateToRegister = () => {
    navigation.navigate('Register');
  };

  const handleNavigateToLogin = () => {
    navigation.navigate('Login');
  };

  /**
   * Handle syncing guest data
   */
  const handleSyncData = async () => {
    try {
      setIsSyncing(true);
      await syncGuestData();
      Alert.alert('Success', 'Your data has been synced successfully!');
    } catch (error: any) {
      Alert.alert('Sync Failed', error.message || 'Failed to sync data. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  /**
   * Handle clearing all guest data
   */
  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all plants, water events, and photos stored on this device. This action cannot be undone.\n\nAre you sure?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All Data',
          style: 'destructive',
          onPress: async () => {
            try {
              const { clearGuestData } = await import('../utils/storage');
              await clearGuestData();
              setPlantCount(0);
              Alert.alert('Success', 'All data has been cleared.');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to clear data. Please try again.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  /**
   * Load guest plant count
   */
  const loadGuestData = async () => {
    if (isGuestMode) {
      const plants = await getGuestPlants();
      setPlantCount(plants.length);
    }
  };

  /**
   * Load profile on mount
   */
  useEffect(() => {
    if (user && !isGuestMode) {
      fetchProfile();
    } else if (isGuestMode) {
      loadGuestData();
    }
  }, [user, isGuestMode]);

  /**
   * Refresh guest data when screen comes into focus
   */
  useFocusEffect(
    React.useCallback(() => {
      if (isGuestMode) {
        loadGuestData();
      }
    }, [isGuestMode])
  );

  /**
   * Get initials from name for avatar
   */
  const getInitials = (name: string): string => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  /**
   * Format date string
   */
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  };

  /**
   * Get role badge color
   */
  const getRoleBadgeColor = (role: string): string => {
    switch (role.toLowerCase()) {
      case 'admin':
        return theme.colors.error;
      case 'moderator':
        return '#FFA726';
      case 'user':
      default:
        return theme.colors.primary;
    }
  };

  if (authLoading || loadingProfile) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="bodyLarge" style={[styles.loadingText, { color: theme.colors.onBackground }]}>
          Loading profile...
        </Text>
      </View>
    );
  }

  // Guest Mode UI
  if (isGuestMode) {
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Guest Mode Header */}
        <View style={styles.header}>
          <Avatar.Icon
            size={100}
            icon="account-circle"
            style={[styles.avatar, { backgroundColor: theme.colors.surfaceVariant }]}
          />
          <Text variant="headlineMedium" style={[styles.name, { color: theme.colors.onBackground }]}>
            Guest Mode
          </Text>
          <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            {plantCount > 0 ? `${plantCount} plants stored locally` : 'No data yet'}
          </Text>
        </View>

        {/* Sign Up Card */}
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <Text variant="titleMedium" style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
              Sign Up to Sync Data
            </Text>
            <Text variant="bodyMedium" style={[styles.cardDescription, { color: theme.colors.onSurfaceVariant }]}>
              Create an account to backup your plants and access them from any device.
            </Text>

            <Button
              mode="contained"
              onPress={handleNavigateToRegister}
              icon="account-plus"
              style={styles.button}
              disabled={authLoading}
            >
              Sign Up
            </Button>

            <View style={styles.loginLinkContainer}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Already have an account?{' '}
              </Text>
              <Button
                mode="text"
                onPress={handleNavigateToLogin}
                disabled={authLoading}
                compact
              >
                Log In
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Benefits Card */}
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <Text variant="titleMedium" style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
              Why sign up?
            </Text>

            <View style={styles.benefitItem}>
              <Text variant="bodyLarge" style={{ color: theme.colors.primary }}>✓</Text>
              <Text variant="bodyMedium" style={[styles.benefitText, { color: theme.colors.onSurface }]}>
                Backup your plant data
              </Text>
            </View>

            <View style={styles.benefitItem}>
              <Text variant="bodyLarge" style={{ color: theme.colors.primary }}>✓</Text>
              <Text variant="bodyMedium" style={[styles.benefitText, { color: theme.colors.onSurface }]}>
                Access from multiple devices
              </Text>
            </View>

            <View style={styles.benefitItem}>
              <Text variant="bodyLarge" style={{ color: theme.colors.primary }}>✓</Text>
              <Text variant="bodyMedium" style={[styles.benefitText, { color: theme.colors.onSurface }]}>
                Never lose your plants
              </Text>
            </View>

            {hasLocalData && (
              <View style={[styles.warningBox, { backgroundColor: '#FFF3E0' }]}>
                <Text variant="bodySmall" style={{ color: '#E65100' }}>
                  ⚠️ Local data will be lost if you uninstall the app without signing up first.
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Developer Tools Card - Only show if there's data */}
        {plantCount > 0 && (
          <Card style={styles.card} mode="elevated">
            <Card.Content>
              <Text variant="titleMedium" style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
                Developer Tools
              </Text>
              <Button
                mode="outlined"
                onPress={handleClearAllData}
                icon="delete-forever"
                style={styles.button}
                textColor={theme.colors.error}
              >
                Clear All Data
              </Button>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                Permanently deletes all plants, water events, and local data
              </Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    );
  }

  if (!profileData) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <Text variant="bodyLarge" style={{ textAlign: 'center', color: theme.colors.error }}>
              Failed to load profile data
            </Text>
            <Button mode="contained" onPress={fetchProfile} style={styles.button}>
              Retry
            </Button>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Profile Header */}
      <View style={styles.header}>
        <Avatar.Text
          size={100}
          label={getInitials(profileData.name)}
          style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
        />
        <Text variant="headlineMedium" style={[styles.name, { color: theme.colors.onBackground }]}>
          {profileData.name}
        </Text>
        <View
          style={[
            styles.roleBadge,
            { backgroundColor: getRoleBadgeColor(profileData.role) + '20' },
          ]}
        >
          <Text
            variant="labelMedium"
            style={[styles.roleText, { color: getRoleBadgeColor(profileData.role) }]}
          >
            {profileData.role.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Profile Information Card */}
      <Card style={styles.card} mode="elevated">
        <Card.Title title="Account Information" />
        <Card.Content>
          <View style={styles.infoRow}>
            <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>
              Email
            </Text>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
              {profileData.email}
            </Text>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.infoRow}>
            <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>
              User ID
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, fontFamily: 'monospace' }}>
              {profileData.id}
            </Text>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.infoRow}>
            <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>
              Member Since
            </Text>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
              {formatDate(profileData.createdAt)}
            </Text>
          </View>

          {profileData.updatedAt && (
            <>
              <Divider style={styles.divider} />
              <View style={styles.infoRow}>
                <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>
                  Last Updated
                </Text>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                  {formatDate(profileData.updatedAt)}
                </Text>
              </View>
            </>
          )}
        </Card.Content>
      </Card>

      {/* Actions Card */}
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <Button
            mode="contained"
            onPress={fetchProfile}
            icon="refresh"
            style={styles.button}
            loading={loadingProfile}
            disabled={loadingProfile}
          >
            Refresh Profile
          </Button>

          <Button
            mode="outlined"
            onPress={handleLogout}
            icon="logout"
            style={styles.button}
            textColor={theme.colors.error}
            disabled={authLoading}
          >
            Logout
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatar: {
    marginBottom: 16,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  roleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  roleText: {
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  card: {
    marginBottom: 16,
  },
  infoRow: {
    paddingVertical: 12,
  },
  divider: {
    marginVertical: 4,
  },
  button: {
    marginVertical: 8,
  },
  subtitle: {
    marginTop: 4,
  },
  cardTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  cardDescription: {
    marginBottom: 16,
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  benefitText: {
    marginLeft: 12,
    flex: 1,
  },
  warningBox: {
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
});
