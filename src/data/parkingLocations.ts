export interface ParkingLocation {
    id: string;
    name: string;
    address: string;
    city: string;
    coordinates: { lat: number; lng: number };
    distance: number; // km from user
    pricing: {
        hourly: number;
        daily: number;
        monthly: number;
    };
    amenities: {
        evCharging: boolean;
        covered: boolean;
        security: boolean;
        wheelchairAccess: boolean;
        valet: boolean;
        overnight: boolean;
    };
    availability: {
        total: number;
        available: number;
    };
    rating: number;
    image: string;
    type: 'garage' | 'street' | 'lot';
}

export const MOCK_PARKING_LOCATIONS: ParkingLocation[] = [
    {
        id: 'loc-1',
        name: 'Phoenix Market City Parking',
        address: 'Viman Nagar, Pune',
        city: 'Pune',
        coordinates: { lat: 18.5679, lng: 73.9143 },
        distance: 1.2,
        pricing: { hourly: 40, daily: 300, monthly: 5000 },
        amenities: {
            evCharging: true,
            covered: true,
            security: true,
            wheelchairAccess: true,
            valet: true,
            overnight: true,
        },
        availability: { total: 500, available: 45 },
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=2667&auto=format&fit=crop', // Modern indoor parking
        type: 'garage',
    },
    {
        id: 'loc-2',
        name: 'Seasons Mall Parking',
        address: 'Hadapsar, Pune',
        city: 'Pune',
        coordinates: { lat: 18.5018, lng: 73.9263 },
        distance: 3.5,
        pricing: { hourly: 30, daily: 250, monthly: 4000 },
        amenities: {
            evCharging: false,
            covered: true,
            security: true,
            wheelchairAccess: true,
            valet: false,
            overnight: true,
        },
        availability: { total: 300, available: 12 },
        rating: 4.2,
        image: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?q=80&w=2574&auto=format&fit=crop', // Outdoor parking lot
        type: 'garage',
    },
    {
        id: 'loc-3',
        name: 'Koregaon Park Street Parking',
        address: 'Koregaon Park, Pune',
        city: 'Pune',
        coordinates: { lat: 18.5362, lng: 73.8958 },
        distance: 2.1,
        pricing: { hourly: 20, daily: 150, monthly: 2500 },
        amenities: {
            evCharging: false,
            covered: false,
            security: false,
            wheelchairAccess: false,
            valet: false,
            overnight: false,
        },
        availability: { total: 50, available: 8 },
        rating: 3.8,
        image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=2670&auto=format&fit=crop', // Street parking
        type: 'street',
    },
    {
        id: 'loc-4',
        name: 'Pune Airport Parking',
        address: 'Lohegaon, Pune',
        city: 'Pune',
        coordinates: { lat: 18.5821, lng: 73.9197 },
        distance: 5.0,
        pricing: { hourly: 60, daily: 500, monthly: 8000 },
        amenities: {
            evCharging: true,
            covered: true,
            security: true,
            wheelchairAccess: true,
            valet: true,
            overnight: true,
        },
        availability: { total: 1000, available: 150 },
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1470224114660-3f6686c562eb?q=80&w=2608&auto=format&fit=crop', // Large multi-level parking
        type: 'garage',
    },
    {
        id: 'loc-5',
        name: 'Deccan Gymkhana Lot',
        address: 'Deccan, Pune',
        city: 'Pune',
        coordinates: { lat: 18.5196, lng: 73.8553 },
        distance: 4.2,
        pricing: { hourly: 25, daily: 200, monthly: 3500 },
        amenities: {
            evCharging: false,
            covered: false,
            security: true,
            wheelchairAccess: false,
            valet: false,
            overnight: true,
        },
        availability: { total: 100, available: 22 },
        rating: 4.0,
        image: 'https://images.unsplash.com/photo-1604063155787-8fbaf5cde9b7?q=80&w=2574&auto=format&fit=crop', // Standard lot
        type: 'lot',
    },
    {
        id: 'loc-6',
        name: 'Amanora Mall Parking',
        address: 'Hadapsar, Pune',
        city: 'Pune',
        coordinates: { lat: 18.5089, lng: 73.9321 },
        distance: 3.8,
        pricing: { hourly: 35, daily: 280, monthly: 4500 },
        amenities: {
            evCharging: true,
            covered: true,
            security: true,
            wheelchairAccess: true,
            valet: false,
            overnight: true,
        },
        availability: { total: 400, available: 65 },
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?q=80&w=2574&auto=format&fit=crop', // Mall parking
        type: 'garage',
    },
];
