import React, { memo, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CourseStack } from './CourseStack';
import { AuthStack } from './AuthStack';
import { OverviewScreen } from '../screens/OverviewScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { AuthProvider, useAuth } from '../auth/AuthContext';
import { ProgressProvider } from '../progress/ProgressContext';
import { theme } from '../theme/theme';

type TabParamList = {
  home: undefined;
  learn: undefined;
  docs: undefined;
  profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: theme.colors.bg,
    card: theme.colors.surface,
    text: theme.colors.text,
    primary: theme.colors.primary,
    border: theme.colors.border,
  },
};

const HomeTabBarIcon = ({ color }: { color: string }) => (
  <TabIcon name="home-outline" color={color} />
);
const LearnTabBarIcon = ({ color }: { color: string }) => (
  <TabIcon name="school-outline" color={color} />
);
const DocsTabBarIcon = ({ color }: { color: string }) => (
  <TabIcon name="document-text-outline" color={color} />
);
const ProfileTabBarIcon = ({ color }: { color: string }) => (
  <TabIcon name="person-outline" color={color} />
);

export const RootTabs = memo(function RootTabs() {
  const insets = useSafeAreaInsets();
  useEffect(() => {
    enableScreens(true);
  }, []);

  return (
    <GestureHandlerRootView style={styles.flex1}>
      <AuthProvider>
        <ProgressProvider>
          <NavigationContainer theme={navTheme}>
            <RootNavigator insetsBottom={insets.bottom} />
          </NavigationContainer>
        </ProgressProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
});

const RootNavigator = memo(function RootNavigator({ insetsBottom }: { insetsBottom: number }) {
  const { user } = useAuth();
  if (!user) return <AuthStack />;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 72 + insetsBottom,
          paddingBottom: Math.max(insetsBottom, 10),
          paddingTop: 10,
          paddingHorizontal: 14,
          borderTopWidth: 0,
          borderTopColor: 'transparent',
          backgroundColor: theme.colors.surface,
          borderTopLeftRadius: 26,
          borderTopRightRadius: 26,
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: -2 },
          elevation: 6,
        },
        tabBarItemStyle: { paddingVertical: 8 },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: '#CBD5E1',
      }}
    >
      <Tab.Screen name="home" component={CourseStack} options={{ tabBarIcon: HomeTabBarIcon }} />
      <Tab.Screen name="learn" component={OverviewScreen} options={{ tabBarIcon: LearnTabBarIcon }} />
      <Tab.Screen name="docs" component={SearchScreen} options={{ tabBarIcon: DocsTabBarIcon }} />
      <Tab.Screen name="profile" component={ProfileScreen} options={{ tabBarIcon: ProfileTabBarIcon }} />
    </Tab.Navigator>
  );
});

const TabIcon = memo(function TabIcon({
  name,
  color,
}: {
  name: string;
  color: string;
}) {
  return <Ionicons name={name} size={26} color={color} />;
});

const styles = StyleSheet.create({
  flex1: { flex: 1 },
});

