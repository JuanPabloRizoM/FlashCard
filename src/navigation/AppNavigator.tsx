import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { TabBarIcon } from '../ui/components/navigation/TabBarIcon';
import { CardsScreen } from '../ui/screens/CardsScreen';
import { DecksScreen } from '../ui/screens/DecksScreen';
import { SettingsScreen } from '../ui/screens/SettingsScreen';
import { StudyScreen } from '../ui/screens/StudyScreen';
import { colors, spacing, typography } from '../ui/theme';
import type { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.textPrimary,
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
            tabBarIcon: ({ color, focused }) => <TabBarIcon color={color} focused={focused} name="decks" />
          }}
        />
        <Tab.Screen
          name="Cards"
          component={CardsScreen}
          options={{
            tabBarIcon: ({ color, focused }) => <TabBarIcon color={color} focused={focused} name="cards" />
          }}
        />
        <Tab.Screen
          name="Study"
          component={StudyScreen}
          options={{
            tabBarIcon: ({ color, focused }) => <TabBarIcon color={color} focused={focused} name="study" />
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ color, focused }) => <TabBarIcon color={color} focused={focused} name="settings" />
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
