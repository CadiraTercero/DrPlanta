import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from 'react-native';
import { useTheme, IconButton } from 'react-native-paper';

// Context
import { useAuth } from '../contexts/AuthContext';

// Auth Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

// App Screens
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MyGardenScreen from '../screens/MyGardenScreen';
import AddPlantScreen from '../screens/AddPlantScreen';
import PlantDetailScreen from '../screens/PlantDetailScreen';
import EditPlantScreen from '../screens/EditPlantScreen';
import CalendarScreen from '../screens/CalendarScreen';
import WateringHelpScreen from '../screens/WateringHelpScreen';

/**
 * Auth Stack Parameter List
 */
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

/**
 * Garden Stack Parameter List
 */
export type GardenStackParamList = {
  MyGarden: undefined;
  AddPlant: undefined;
  PlantDetail: { plantId: string };
  EditPlant: { plantId: string };
};

/**
 * Calendar Stack Parameter List
 */
export type CalendarStackParamList = {
  CalendarMain: undefined;
  WateringHelp: undefined;
  PlantDetail: { plantId: string };
  EditPlant: { plantId: string };
};

/**
 * App Stack Parameter List
 */
export type AppStackParamList = {
  HomeTabs: undefined;
  Home: undefined;
  Garden: undefined;
  Profile: undefined;
  Calendar: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const GardenStack = createNativeStackNavigator<GardenStackParamList>();
const CalendarStack = createNativeStackNavigator<CalendarStackParamList>();
const AppTabs = createBottomTabNavigator<AppStackParamList>();

/**
 * Authentication Stack Navigator
 * Contains Login and Register screens
 */
function AuthNavigator() {
  const theme = useTheme();

  return (
    <AuthStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.onPrimary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: 'Sign In',
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          title: 'Sign Up',
          headerShown: false,
        }}
      />
    </AuthStack.Navigator>
  );
}

/**
 * Garden Stack Navigator
 * Contains My Garden and related screens
 */
function GardenNavigator() {
  return (
    <GardenStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <GardenStack.Screen name="MyGarden" component={MyGardenScreen} />
      <GardenStack.Screen name="AddPlant" component={AddPlantScreen} />
      <GardenStack.Screen name="PlantDetail" component={PlantDetailScreen} />
      <GardenStack.Screen name="EditPlant" component={EditPlantScreen} />
    </GardenStack.Navigator>
  );
}

/**
 * Calendar Stack Navigator
 * Contains Calendar and related screens
 */
function CalendarNavigator() {
  return (
    <CalendarStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <CalendarStack.Screen name="CalendarMain" component={CalendarScreen} />
      <CalendarStack.Screen
        name="WateringHelp"
        component={WateringHelpScreen}
        options={{
          headerShown: true,
          title: 'Watering Help',
        }}
      />
      <CalendarStack.Screen
        name="PlantDetail"
        component={PlantDetailScreen}
        options={{
          headerShown: true,
          title: 'Plant Detail',
        }}
      />
      <CalendarStack.Screen
        name="EditPlant"
        component={EditPlantScreen}
        options={{
          headerShown: true,
          title: 'Edit Plant',
        }}
      />
    </CalendarStack.Navigator>
  );
}

/**
 * App Tab Navigator
 * Contains main app screens with bottom tabs
 */
function AppNavigator() {
  const theme = useTheme();

  return (
    <AppTabs.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.onPrimary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
      }}
    >
      <AppTabs.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'DrPlantes',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <IconButton icon="home" iconColor={color} size={24} />
          ),
        }}
      />
      <AppTabs.Screen
        name="Garden"
        component={GardenNavigator}
        options={{
          title: 'My Garden',
          tabBarLabel: 'My Garden',
          tabBarIcon: ({ color }) => (
            <IconButton icon="flower" iconColor={color} size={24} />
          ),
          headerShown: false,
        }}
      />
      <AppTabs.Screen
        name="Calendar"
        component={CalendarNavigator}
        options={{
          title: 'Calendar',
          tabBarLabel: 'Calendar',
          tabBarIcon: ({ color }) => (
            <IconButton icon="water" iconColor={color} size={24} />
          ),
          headerShown: false,
        }}
      />
      <AppTabs.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <IconButton icon="account" iconColor={color} size={24} />
          ),
        }}
      />
    </AppTabs.Navigator>
  );
}

/**
 * Root Navigator
 * Handles conditional rendering based on authentication state
 */
export default function RootNavigator() {
  const { user, loading } = useAuth();
  const theme = useTheme();

  // Show loading screen while checking auth status
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.background,
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
