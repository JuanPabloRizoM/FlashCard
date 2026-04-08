import { useAuth } from '../features/auth/AuthProvider';
import { AppNavigator } from './AppNavigator';
import { AuthFlow } from './AuthFlow';

export function RootNavigator() {
  const { consumePendingAuthEntry, hasAccess, pendingAuthEntry } = useAuth();

  return hasAccess ? (
    <AppNavigator />
  ) : (
    <AuthFlow pendingAuthEntry={pendingAuthEntry} onConsumePendingAuthEntry={consumePendingAuthEntry} />
  );
}
