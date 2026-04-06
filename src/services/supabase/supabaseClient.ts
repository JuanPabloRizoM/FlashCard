import 'react-native-url-polyfill/auto';

import { createClient, type Session, type SupabaseClient, type User } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

import type { AuthProfile } from '../../core/types/auth';
import { supabaseAuthStorage } from '../../storage/supabaseAuthStorage';

WebBrowser.maybeCompleteAuthSession();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? '';
const supabaseStorageKey = 'flashcards_supabase_auth_v1';

export const isSupabaseConfigured = supabaseUrl.length > 0 && supabaseAnonKey.length > 0;

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: Platform.OS === 'web',
        flowType: 'pkce',
        persistSession: true,
        storage: supabaseAuthStorage,
        storageKey: supabaseStorageKey
      }
    })
  : null;

export function getSupabaseRedirectUrl(): string {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && typeof window.location?.origin === 'string') {
      return window.location.origin;
    }

    return 'http://localhost:19006';
  }

  return Linking.createURL('auth/callback');
}

export function mapSupabaseSessionToAuthProfile(session: Session): AuthProfile {
  return mapSupabaseUserToAuthProfile(session.user);
}

function mapSupabaseUserToAuthProfile(user: User): AuthProfile {
  const provider = user.app_metadata?.provider === 'google' ? 'google' : 'email';
  const displayNameCandidate =
    typeof user.user_metadata?.full_name === 'string'
      ? user.user_metadata.full_name
      : typeof user.user_metadata?.name === 'string'
        ? user.user_metadata.name
        : null;

  return {
    provider,
    email: typeof user.email === 'string' ? user.email : null,
    displayName: displayNameCandidate
  };
}
