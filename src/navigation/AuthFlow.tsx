import { useState } from 'react';

import { AuthLandingScreen } from '../ui/screens/auth/AuthLandingScreen';
import { CreateAccountScreen } from '../ui/screens/auth/CreateAccountScreen';
import { ForgotPasswordScreen } from '../ui/screens/auth/ForgotPasswordScreen';
import { SignInScreen } from '../ui/screens/auth/SignInScreen';

type AuthRoute = 'landing' | 'sign_in' | 'create_account' | 'forgot_password';

export function AuthFlow() {
  const [route, setRoute] = useState<AuthRoute>('landing');

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
