import { supabase } from '@/lib/supabase';

// Get all parking locations
export async function getParkingLocations() {
    const { data, error } = await supabase
        .from('parking_locations')
        .select('*')
        .order('name');

    if (error) throw error;
    return data;
}

// Get parking spots for a location
export async function getParkingSpots(locationId: string) {
    const { data, error } = await supabase
        .from('parking_spots')
        .select('*')
        .eq('location_id', locationId)
        .order('spot_number');

    if (error) throw error;
    return data;
}

// Create a booking
export async function createBooking(booking: {
    user_id: string;
    location_id: string;
    spot_id: string;
    vehicle_number: string;
}) {
    const { data, error } = await supabase
        .from('bookings')
        .insert(booking)
        .select()
        .single();

    if (error) throw error;

    // Update spot availability
    await supabase
        .from('parking_spots')
        .update({ is_available: false })
        .eq('id', booking.spot_id);

    return data;
}

// End a booking
export async function endBooking(bookingId: string, amount: number) {
    const { data, error } = await supabase
        .from('bookings')
        .update({
            end_time: new Date().toISOString(),
            status: 'completed',
            amount,
        })
        .eq('id', bookingId)
        .select()
        .single();

    if (error) throw error;

    // Free up the spot
    if (data) {
        await supabase
            .from('parking_spots')
            .update({ is_available: true })
            .eq('id', data.spot_id);
    }

    return data;
}

// Get user's bookings
export async function getUserBookings(userId: string) {
    const { data, error } = await supabase
        .from('bookings')
        .select(`
      *,
      parking_locations (name, address),
      parking_spots (spot_number)
    `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

// Subscribe to real-time spot updates
export function subscribeToSpotUpdates(locationId: string, callback: () => void) {
    return supabase
        .channel(`spots:${locationId}`)
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'parking_spots',
                filter: `location_id=eq.${locationId}`,
            },
            callback
        )
        .subscribe();
}
