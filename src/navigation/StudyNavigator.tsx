import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { StudyFlowProvider } from '../features/study/StudyFlowProvider';
import { StudyScreen } from '../ui/screens/StudyScreen';
import { StudySessionRouteScreen } from '../ui/screens/StudySessionRouteScreen';
import { StudySessionStatsRouteScreen } from '../ui/screens/StudySessionStatsRouteScreen';
import type { StudyStackParamList } from './types';

const Stack = createNativeStackNavigator<StudyStackParamList>();

export function StudyNavigator() {
  return (
    <StudyFlowProvider>
      <Stack.Navigator initialRouteName="StudyDashboard" screenOptions={{ animation: 'fade', headerShown: false }}>
        <Stack.Screen component={StudyScreen} name="StudyDashboard" />
        <Stack.Screen component={StudySessionRouteScreen} name="StudySession" />
        <Stack.Screen component={StudySessionStatsRouteScreen} name="StudySessionStats" />
      </Stack.Navigator>
    </StudyFlowProvider>
  );
}
