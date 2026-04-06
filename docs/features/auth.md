# Auth Feature

## Purpose

Auth v1 uses real Supabase authentication while preserving guest entry.

It supports real email/password auth, reset-email delivery, Google sign-in wiring, and session restore, without changing deck/card/study feature behavior.

## Current Modes

- `signed_out`: shows the auth flow shell
- `guest`: enters the main app shell locally
- `authenticated`: real Supabase-authenticated session

## Current Behavior

- The app boots into the auth flow when no guest/auth session exists.
- `Continue as guest` persists a local guest session and opens the main app.
- Email sign-in uses Supabase Auth.
- Account creation uses Supabase Auth.
- Google sign-in is wired through Supabase OAuth.
- Forgot password sends the real Supabase reset-email action.
- Auth copy is language-aware and follows the saved app language (`Español` by default, `English` optional).

## Architecture

- `src/features/auth/AuthProvider.tsx` owns auth shell state and future-ready actions.
- `src/navigation/RootNavigator.tsx` splits the app into auth flow vs main app flow.
- `src/navigation/AuthFlow.tsx` owns the auth-screen shell routing.
- `src/storage/authSessionStorage.*.ts` persists guest/auth shell state.
- `src/storage/supabaseAuthStorage.*.ts` backs Supabase session persistence.
- `src/services/supabase/supabaseClient.ts` owns the Supabase client, redirect URL logic, and auth-session mapping.
- UI text for auth lives in the centralized strings layer.

## Current Limitations

- Guest mode is still separate from real authenticated sync behavior.
- Reset-password email delivery is real, but an in-app set-new-password screen is not implemented yet.
- Supabase project configuration and Google provider setup must be supplied by environment and dashboard settings.
