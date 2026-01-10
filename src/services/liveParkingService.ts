// Real-time parking slot manager with live updates
export interface LiveParkingSlot {
    id: string;
    name: string;
    is_available: boolean;
    occupied_by?: string; // vehicle ID
    occupied_at?: string; // timestamp
    floor: string;
    zone: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
    position: number;
}

export interface ActiveSession {
    id: string;
    slot_id: string;
    vehicle_number: string;
    start_time: string;
    expected_duration: number; // minutes
    hourly_rate: number;
    status: 'active' | 'ending' | 'completed';
}

// Initialize realistic parking lot with 60% occupancy
export function initializeParkingLot(): LiveParkingSlot[] {
    const zones = ['A', 'B', 'C', 'D', 'E', 'F'];
    const slots: LiveParkingSlot[] = [];

    zones.forEach((zone, zoneIndex) => {
        for (let i = 1; i <= 6; i++) {
            const slotId = `${zone.toLowerCase()}${i}`;
            // Realistic distribution: 60% occupied, 40% available
            const isOccupied = Math.random() < 0.6;

            slots.push({
                id: slotId,
                name: `${zone}${i}`,
                is_available: !isOccupied,
                floor: zoneIndex < 2 ? 'Ground' : zoneIndex < 4 ? 'First' : 'Second',
                zone: zone as any,
                position: i,
                occupied_by: isOccupied ? `DEMO-${Math.floor(Math.random() * 9000) + 1000}` : undefined,
                occupied_at: isOccupied ? new Date(Date.now() - Math.random() * 3600000).toISOString() : undefined,
            });
        }
    });

    return slots;
}

// Simulate real-time slot changes (other users booking/leaving)
export function simulateLiveUpdates(
    slots: LiveParkingSlot[],
    callback: (updatedSlots: LiveParkingSlot[]) => void
) {
    const interval = setInterval(() => {
        const updatedSlots = [...slots];

        // Randomly free up 1-2 slots (cars leaving)
        const occupiedSlots = updatedSlots.filter(s => !s.is_available);
        if (occupiedSlots.length > 0 && Math.random() < 0.3) {
            const randomOccupied = occupiedSlots[Math.floor(Math.random() * occupiedSlots.length)];
            const index = updatedSlots.findIndex(s => s.id === randomOccupied.id);
            updatedSlots[index] = {
                ...updatedSlots[index],
                is_available: true,
                occupied_by: undefined,
                occupied_at: undefined,
            };
        }

        // Randomly occupy 1 available slot (other users booking)
        const availableSlots = updatedSlots.filter(s => s.is_available);
        if (availableSlots.length > 0 && Math.random() < 0.2) {
            const randomAvailable = availableSlots[Math.floor(Math.random() * availableSlots.length)];
            const index = updatedSlots.findIndex(s => s.id === randomAvailable.id);
            updatedSlots[index] = {
                ...updatedSlots[index],
                is_available: false,
                occupied_by: `LIVE-${Math.floor(Math.random() * 9000) + 1000}`,
                occupied_at: new Date().toISOString(),
            };
        }

        callback(updatedSlots);
    }, 15000); // Update every 15 seconds

    return interval;
}

// Calculate real-time parking cost
export function calculateLiveCost(startTime: string, hourlyRate: number): number {
    const start = new Date(startTime);
    const now = new Date();
    const durationMs = now.getTime() - start.getTime();
    const hours = durationMs / (1000 * 60 * 60);

    // Minimum 1 hour charge, then pro-rated
    const chargeableHours = Math.max(1, Math.ceil(hours * 2) / 2); // Round to nearest 0.5 hour
    return Math.round(chargeableHours * hourlyRate);
}

// Get parking duration in human-readable format
export function getParkingDuration(startTime: string): string {
    const start = new Date(startTime);
    const now = new Date();
    const durationMs = now.getTime() - start.getTime();

    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    if (hours === 0) {
        return `${minutes} min`;
    } else if (minutes === 0) {
        return `${hours} hr`;
    } else {
        return `${hours} hr ${minutes} min`;
    }
}

// Check if session should auto-expire
export function shouldAutoExpire(session: ActiveSession): boolean {
    const start = new Date(session.start_time);
    const now = new Date();
    const durationMinutes = (now.getTime() - start.getTime()) / (1000 * 60);

    // Auto-expire if parked for more than expected duration + 30 min grace period
    return durationMinutes > (session.expected_duration + 30);
}
