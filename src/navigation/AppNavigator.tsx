import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { CardsScreen } from '../ui/screens/CardsScreen';
import { DecksScreen } from '../ui/screens/DecksScreen';
import { SettingsScreen } from '../ui/screens/SettingsScreen';
import { StudyScreen } from '../ui/screens/StudyScreen';
import { colors } from '../ui/theme';
import type { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.muted,
          tabBarStyle: { backgroundColor: colors.surface }
        }}
      >
        <Tab.Screen name="Decks" component={DecksScreen} />
        <Tab.Screen name="Cards" component={CardsScreen} />
        <Tab.Screen name="Study" component={StudyScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
