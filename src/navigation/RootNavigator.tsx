import { useAuth } from '../features/auth/AuthProvider';
import { AppNavigator } from './AppNavigator';
import { AuthFlow } from './AuthFlow';

export function RootNavigator() {
  const { hasAccess } = useAuth();

  return hasAccess ? <AppNavigator /> : <AuthFlow />;
}
