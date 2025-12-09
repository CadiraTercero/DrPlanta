import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Text, Button, Avatar, Divider, useTheme, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function ProfileScreen() {
  const theme = useTheme();
  const { user, logout, loading: authLoading } = useAuth();
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileData, setProfileData] = useState(user);

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
   * Load profile on mount
   */
  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, []);

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
});
