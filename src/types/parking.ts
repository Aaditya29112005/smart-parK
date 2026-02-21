export type VehicleType = 'bike' | 'car' | 'truck';
export type UserRole = 'driver' | 'admin' | 'super-admin' | 'user';

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: UserRole;
  is_admin?: boolean;
  is_valet?: boolean;
  managedLocationId?: string;
}

export interface Vehicle {
  id: string;
  user_id: string;
  number: string;
  type: VehicleType;
  first_name?: string;
  last_name?: string;
  brand?: string;
  model?: string;
  mobile_number?: string;
  created_at: string;
}

export interface ParkingSlot {
  id: string;
  name: string;
  is_available: boolean;
  has_ev_charging?: boolean;
  has_handicap?: boolean;
  ev_charge_level?: number; // 0-100
  is_v2g_active?: boolean;
  lat?: number;
  lng?: number;
}

export interface ParkingLot {
  id: string;
  name: string;
  capacity: number;
  price: number;
  status: 'Active' | 'Maintenance';
  address: string;
  location: { lat: number; lng: number };
  rating?: number;
  reviews_count?: number;
  amenities?: string[];
}

export type ParkingStatus = 'active' | 'completed';

export interface ParkingSession {
  id: string;
  user_id: string;
  vehicle_id: string;
  slot_id: string;
  start_time: string;
  end_time: string | null;
  amount: number | null;
  status: ParkingStatus;
  created_at: string;
  vehicle?: Vehicle;
  slot?: ParkingSlot;
}

export type BookingStatus = 'upcoming' | 'active' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  user_id: string;
  location_id: string; // Linking to ParkingLot
  location_name: string;
  location_address: string;
  vehicle_id: string;
  vehicle_number: string;
  start_time: string;
  end_time: string;
  duration_hours: number;
  total_price: number;
  status: BookingStatus;
  created_at: string;
}

export const VEHICLE_RATES: Record<VehicleType, number> = {
  bike: 10,
  car: 20,
  truck: 30,
};

export const VEHICLE_ICONS: Record<VehicleType, string> = {
  bike: '🏍️',
  car: '🚗',
  truck: '🚛',
};

export const VEHICLE_LABELS: Record<VehicleType, string> = {
  bike: 'Bike',
  car: 'Car',
  truck: 'Truck',
};

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  dob?: string;
  licenseNumber: string;
  licenseExpiry?: string;
  photo?: string;
  licensePhoto?: string;
  managedLocationId: string;
  shiftHours: string;
  performance: number;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  location?: string;
  severity: 'low' | 'medium' | 'high';
}

export type ValetStatus = 'pending' | 'accepted' | 'in-progress' | 'parked' | 'retrieving' | 'completed';

export interface ValetAssignment {
  id: string;
  driver_id?: string;
  customer_id: string;
  customer_name: string;
  vehicle_details: string;
  type: 'park' | 'retrieve';
  status: ValetStatus;
  location: string;
  slot_id?: string;
  slot_name?: string;
  timestamp: string;
}
