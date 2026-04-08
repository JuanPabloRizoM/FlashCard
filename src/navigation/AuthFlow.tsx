import { useEffect, useState } from 'react';

import type { AuthEntryDestination } from '../core/types/auth';

import { AuthLandingScreen } from '../ui/screens/auth/AuthLandingScreen';
import { CreateAccountScreen } from '../ui/screens/auth/CreateAccountScreen';
import { ForgotPasswordScreen } from '../ui/screens/auth/ForgotPasswordScreen';
import { SignInScreen } from '../ui/screens/auth/SignInScreen';

type AuthRoute = 'landing' | 'sign_in' | 'create_account' | 'forgot_password';

type AuthFlowProps = {
  pendingAuthEntry?: AuthEntryDestination | null;
  onConsumePendingAuthEntry?: () => void;
};

function resolveInitialRoute(pendingAuthEntry?: AuthEntryDestination | null): AuthRoute {
  if (pendingAuthEntry === 'create_account') {
    return 'create_account';
  }

  return 'landing';
}

export function AuthFlow({ pendingAuthEntry, onConsumePendingAuthEntry }: AuthFlowProps) {
  const [route, setRoute] = useState<AuthRoute>(() => resolveInitialRoute(pendingAuthEntry));

  useEffect(() => {
    onConsumePendingAuthEntry?.();
  }, [onConsumePendingAuthEntry]);

  switch (route) {
    case 'sign_in':
      return (
        <SignInScreen
          onBack={() => {
            setRoute('landing');
          }}
          onOpenForgotPassword={() => {
            setRoute('forgot_password');
          }}
        />
      );
    case 'create_account':
      return (
        <CreateAccountScreen
          onBack={() => {
            setRoute('landing');
          }}
        />
      );
    case 'forgot_password':
      return (
        <ForgotPasswordScreen
          onBack={() => {
            setRoute('sign_in');
          }}
        />
      );
    default:
      return (
        <AuthLandingScreen
          autoTriggerGoogle={pendingAuthEntry === 'google'}
          onOpenCreateAccount={() => {
            setRoute('create_account');
          }}
          onOpenSignIn={() => {
            setRoute('sign_in');
          }}
        />
      );
  }
}
