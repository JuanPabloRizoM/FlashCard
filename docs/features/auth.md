# Auth Feature

## Purpose

Auth v1 is a visual and architectural shell only.

It prepares the app for future authentication without pretending that backend auth, Google OAuth, password-reset email delivery, billing, or account management already exist.

## Current Modes

- `signed_out`: shows the auth flow shell
- `guest`: enters the main app shell locally
- `authenticated`: reserved for future backend integration

## Current Behavior

- The app boots into the auth flow when no guest/auth session exists.
- `Continue as guest` persists a local guest session and opens the main app.
- Email sign-in, account creation, Google sign-in, and password reset are local placeholder actions only.
- Forgot password has a confirmation state, but no real email is sent yet.
- Auth copy is language-aware and follows the saved app language (`Español` by default, `English` optional).

## Architecture

- `src/features/auth/AuthProvider.tsx` owns auth shell state and future-ready actions.
- `src/navigation/RootNavigator.tsx` splits the app into auth flow vs main app flow.
- `src/navigation/AuthFlow.tsx` owns the auth-screen shell routing.
- `src/storage/authSessionStorage.*.ts` persists the local auth shell state.
- UI text for auth lives in the centralized strings layer.

## Out Of Scope In Auth v1

- Supabase or any backend auth
- Google OAuth
- password reset backend
- account management tools
- cloud sync
- billing actions
