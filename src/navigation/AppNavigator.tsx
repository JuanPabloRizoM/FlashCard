import { useMemo } from 'react';
import { NavigationContainer, type Theme as NavigationTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useAppSettings } from '../features/settings/AppSettingsProvider';
import { TabBarIcon } from '../ui/components/navigation/TabBarIcon';
import { CardsScreen } from '../ui/screens/CardsScreen';
import { DecksScreen } from '../ui/screens/DecksScreen';
import { SettingsScreen } from '../ui/screens/SettingsScreen';
import { StudyScreen } from '../ui/screens/StudyScreen';
import { useAppStrings } from '../ui/strings';
import { spacing, typography, useThemeColors } from '../ui/theme';
import type { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

export function AppNavigator() {
  const { resolvedTheme } = useAppSettings();
  const colors = useThemeColors();
  const strings = useAppStrings();

  const navigationTheme = useMemo<NavigationTheme>(
    () => ({
      dark: resolvedTheme === 'dark',
      colors: {
        primary: colors.primary,
        background: colors.background,
        card: colors.surface,
        text: colors.textPrimary,
        border: colors.border,
        notification: colors.error
      },
      fonts: {
        regular: { fontFamily: 'System', fontWeight: '400' },
        medium: { fontFamily: 'System', fontWeight: '500' },
        bold: { fontFamily: 'System', fontWeight: '700' },
        heavy: { fontFamily: 'System', fontWeight: '800' }
      }
    }),
    [colors, resolvedTheme]
  );

  return (
    <NavigationContainer theme={navigationTheme}>
      <Tab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.textPrimary,
          headerShadowVisible: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarLabelStyle: {
            fontSize: typography.overline,
            fontWeight: '700',
            marginBottom: spacing.xs
          },
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            height: 72,
            paddingTop: spacing.xs
          }
        }}
      >
        <Tab.Screen
          name="Decks"
          component={DecksScreen}
          options={{
            title: strings.tabs.decks,
            tabBarLabel: strings.tabs.decks,
            tabBarIcon: ({ color, focused }) => <TabBarIcon color={color} focused={focused} name="decks" />
          }}
        />
        <Tab.Screen
          name="Cards"
          component={CardsScreen}
          options={{
            title: strings.tabs.cards,
            tabBarLabel: strings.tabs.cards,
            tabBarIcon: ({ color, focused }) => <TabBarIcon color={color} focused={focused} name="cards" />
          }}
        />
        <Tab.Screen
          name="Study"
          component={StudyScreen}
          options={{
            title: strings.tabs.study,
            tabBarLabel: strings.tabs.study,
            tabBarIcon: ({ color, focused }) => <TabBarIcon color={color} focused={focused} name="study" />
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: strings.tabs.settings,
            tabBarLabel: strings.tabs.settings,
            tabBarIcon: ({ color, focused }) => <TabBarIcon color={color} focused={focused} name="settings" />
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
