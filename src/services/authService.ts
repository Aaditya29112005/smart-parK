import { supabase } from '@/lib/supabase';
import { UserRole } from '@/types/parking';

export interface AuthUser {
    id: string;
    email: string;
    name?: string;
    role?: UserRole;
    is_admin?: boolean;
    is_valet?: boolean;
}

// Sign up new user
export async function signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
        },
    });

    if (error) throw error;

    // Profile is automatically created by database trigger
    // No need to manually insert it here

    return data;
}

// Sign in existing user
export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw error;
    return data;
}

// Sign out
export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

// Get current user
export async function getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    return {
        id: user.id,
        email: user.email!,
        name: user.user_metadata.full_name,
    };
}

// Listen to auth changes
export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
            callback({
                id: session.user.id,
                email: session.user.email!,
                name: session.user.user_metadata.full_name,
            });
        } else {
            callback(null);
        }
    });
}
