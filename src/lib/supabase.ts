import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    full_name: string | null;
                    phone: string | null;
                    created_at: string;
                };
                Insert: {
                    id: string;
                    full_name?: string | null;
                    phone?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    full_name?: string | null;
                    phone?: string | null;
                    created_at?: string;
                };
            };
            parking_locations: {
                Row: {
                    id: string;
                    name: string;
                    address: string;
                    city: string;
                    latitude: number;
                    longitude: number;
                    total_spots: number;
                    available_spots: number;
                    hourly_rate: number;
                    amenities: Record<string, boolean>;
                    created_at: string;
                };
            };
            parking_spots: {
                Row: {
                    id: string;
                    location_id: string;
                    spot_number: string;
                    is_available: boolean;
                    is_ev_charging: boolean;
                    created_at: string;
                };
            };
            bookings: {
                Row: {
                    id: string;
                    user_id: string;
                    location_id: string;
                    spot_id: string;
                    vehicle_number: string;
                    start_time: string;
                    end_time: string | null;
                    status: string;
                    amount: number | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    location_id: string;
                    spot_id: string;
                    vehicle_number: string;
                    start_time?: string;
                    end_time?: string | null;
                    status?: string;
                    amount?: number | null;
                    created_at?: string;
                };
            };
        };
    };
}
