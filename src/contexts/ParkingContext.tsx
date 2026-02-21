import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Vehicle, ParkingSlot, ParkingSession, ParkingLot, User, Driver, SystemLog, ValetAssignment, ValetStatus, Booking } from '@/types/parking';
import { getCurrentUser, onAuthStateChange } from '@/services/authService';

interface ParkingContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  vehicles: Vehicle[];
  setVehicles: (vehicles: Vehicle[]) => void;
  slots: ParkingSlot[];
  setSlots: (slots: ParkingSlot[]) => void;
  activeSession: ParkingSession | null;
  setActiveSession: (session: ParkingSession | null) => void;
  selectedVehicle: Vehicle | null;
  setSelectedVehicle: (vehicle: Vehicle | null) => void;
  history: ParkingSession[];
  setHistory: (history: ParkingSession[]) => void;
  parkingLots: ParkingLot[];
  addParkingLot: (lot: ParkingLot) => void;
  updateParkingLot: (lot: ParkingLot) => void;
  deleteParkingLot: (id: string) => void;
  addLog: (log: Omit<SystemLog, 'id' | 'timestamp'>) => void;
  demandWeights: Record<string, number>;
  setDemandWeights: (weights: Record<string, number>) => void;
  isSurgeActive: boolean;
  setIsSurgeActive: (active: boolean) => void;
  valetAssignments: ValetAssignment[];
  requestValet: (assignment: Omit<ValetAssignment, 'id' | 'status' | 'timestamp'>) => void;
  registerDriver: (driver: Driver) => void;
  updateValetStatus: (id: string, status: ValetStatus, driverId?: string, slotId?: string, slotName?: string) => void;
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  cancelBooking: (id: string) => void;
}

const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

export function ParkingProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [activeSession, setActiveSession] = useState<ParkingSession | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [history, setHistory] = useState<ParkingSession[]>([]);
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [globalTickets, setGlobalTickets] = useState<ParkingSession[]>([]);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [demandWeights, setDemandWeights] = useState<Record<string, number>>({});
  const [isSurgeActive, setIsSurgeActive] = useState(false);
  const [valetAssignments, setValetAssignments] = useState<ValetAssignment[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Load bookings
  useEffect(() => {
    const savedBookings = localStorage.getItem('parking_bookings');
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }
  }, []);

  const addBooking = (booking: Booking) => {
    const updated = [...bookings, booking];
    setBookings(updated);
    localStorage.setItem('parking_bookings', JSON.stringify(updated));
    addLog({ user: user?.name || 'User', action: `Scheduled booking at ${booking.location_name}`, severity: 'low' });
  };

  const cancelBooking = (id: string) => {
    const updated = bookings.map(b => b.id === id ? { ...b, status: 'cancelled' as const } : b);
    setBookings(updated);
    localStorage.setItem('parking_bookings', JSON.stringify(updated));
    addLog({ user: user?.name || 'User', action: `Cancelled booking ${id}`, severity: 'medium' });
  };

  // Add Log helper
  const addLog = (logData: Omit<SystemLog, 'id' | 'timestamp'>) => {
    const newLog: SystemLog = {
      ...logData,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };
    setSystemLogs(prev => [newLog, ...prev].slice(0, 100)); // Keep last 100 logs
  };

  // Load parking lots and admin data from storage
  useEffect(() => {
    const savedLots = localStorage.getItem('parking_lots');
    const savedUser = localStorage.getItem('user');

    if (savedLots) {
      setParkingLots(JSON.parse(savedLots));
    }

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user", e);
      }
    } else {
      // Default seed data
      const defaultLots: ParkingLot[] = [
        { id: '1', name: "Phoenix Market City", capacity: 120, price: 40, status: "Active", address: "Viman Nagar, Pune", location: { lat: 18.5622, lng: 73.9167 } },
        { id: '2', name: "Seasons Mall", capacity: 80, price: 30, status: "Active", address: "Magarpatta, Pune", location: { lat: 18.5197, lng: 73.9312 } },
        { id: '3', name: "City Center", capacity: 200, price: 50, status: "Maintenance", address: "Shivaji Nagar, Pune", location: { lat: 18.5308, lng: 73.8475 } },
      ];
      setParkingLots(defaultLots);
      localStorage.setItem('parking_lots', JSON.stringify(defaultLots));
    }

    // Seed Drivers
    const savedDrivers = localStorage.getItem('drivers');
    if (savedDrivers) {
      setDrivers(JSON.parse(savedDrivers));
    } else {
      const defaultDrivers: Driver[] = [
        { id: 'd1', name: 'Rahul Sharma', email: 'rahul@smartpark.com', phone: '9876543210', licenseNumber: 'DL-1420110012345', managedLocationId: '1', shiftHours: '09:00 - 18:00', performance: 4.8 },
        { id: 'd2', name: 'Amit Patel', email: 'amit@smartpark.com', phone: '9876543211', licenseNumber: 'DL-1420110012346', managedLocationId: '1', shiftHours: '18:00 - 03:00', performance: 4.5 },
        { id: 'd3', name: 'Suresh Kumar', email: 'suresh@smartpark.com', phone: '9876543212', licenseNumber: 'DL-1420110012347', managedLocationId: '2', shiftHours: '09:00 - 18:00', performance: 4.9 },
      ];
      setDrivers(defaultDrivers);
      localStorage.setItem('drivers', JSON.stringify(defaultDrivers));
    }

    // Initial Demand Weights (Predictive Data)
    setDemandWeights({
      '1': 0.85, // Phoenix Market City - High Demand
      '2': 0.45, // Seasons Mall - Medium Demand
      '3': 0.15, // City Center - Low Demand
    });

    // Seed Valet Assignments
    const savedValets = localStorage.getItem('valet_assignments');
    if (savedValets) {
      setValetAssignments(JSON.parse(savedValets));
    } else {
      const defaultValets: ValetAssignment[] = [
        {
          id: 'v1',
          customer_id: 'u1',
          customer_name: 'Amit Sharma',
          vehicle_details: 'Honda City (MH02AB1234)',
          type: 'park',
          status: 'pending',
          location: 'Phoenix Mall Entrance',
          timestamp: new Date().toISOString()
        },
      ];
      setValetAssignments(defaultValets);
      localStorage.setItem('valet_assignments', JSON.stringify(defaultValets));
    }

    // Initial Logs
    addLog({ user: 'system', action: 'System nodes initialized', severity: 'low' });
  }, []);

  const requestValet = (assignment: Omit<ValetAssignment, 'id' | 'status' | 'timestamp'>) => {
    const newAssignment: ValetAssignment = {
      ...assignment,
      id: `v-${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      timestamp: new Date().toISOString(),
    };
    const updated = [newAssignment, ...valetAssignments];
    setValetAssignments(updated);
    localStorage.setItem('valet_assignments', JSON.stringify(updated));
    addLog({ user: assignment.customer_name, action: `Requested valet for ${assignment.type}`, severity: 'medium' });
  };

  const registerDriver = (driver: Driver) => {
    const updated = [...drivers, driver];
    setDrivers(updated);
    localStorage.setItem('drivers', JSON.stringify(updated));
  };

  const updateValetStatus = (id: string, status: ValetStatus, driverId?: string, slotId?: string, slotName?: string) => {
    const updated = valetAssignments.map(a =>
      a.id === id ? {
        ...a,
        status,
        driver_id: driverId || a.driver_id,
        slot_id: slotId || a.slot_id,
        slot_name: slotName || a.slot_name
      } : a
    );
    setValetAssignments(updated);
    localStorage.setItem('valet_assignments', JSON.stringify(updated));
    addLog({ user: driverId || 'system', action: `Valet ${id} updated to ${status}`, severity: 'low' });
  };

  const addParkingLot = (lot: ParkingLot) => {
    const updated = [...parkingLots, lot];
    setParkingLots(updated);
    localStorage.setItem('parking_lots', JSON.stringify(updated));
  };

  const updateParkingLot = (lot: ParkingLot) => {
    const updated = parkingLots.map(l => l.id === lot.id ? lot : l);
    setParkingLots(updated);
    localStorage.setItem('parking_lots', JSON.stringify(updated));
  };

  const deleteParkingLot = (id: string) => {
    const updated = parkingLots.filter(l => l.id !== id);
    setParkingLots(updated);
    localStorage.setItem('parking_lots', JSON.stringify(updated));
  };

  // Check for existing session on mount and listen for auth changes
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (mounted && currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Error loading user session:", error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    initAuth();

    // Listen for auth state changes
    const { data: authListener } = onAuthStateChange((authUser) => {
      if (mounted) {
        setUser(authUser);
        // If auth state changes (e.g. login/logout), we are definitely done loading
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return (
    <ParkingContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        vehicles,
        setVehicles,
        slots,
        setSlots,
        activeSession,
        setActiveSession,
        selectedVehicle,
        setSelectedVehicle,
        history,
        setHistory,
        parkingLots,
        addParkingLot,
        updateParkingLot,
        deleteParkingLot,
        drivers,
        setDrivers,
        globalTickets,
        setGlobalTickets,
        systemLogs,
        addLog,
        demandWeights,
        setDemandWeights,
        isSurgeActive,
        setIsSurgeActive,
        valetAssignments,
        requestValet,
        registerDriver,
        updateValetStatus,
        bookings,
        addBooking,
        cancelBooking,
      }}
    >
      {children}
    </ParkingContext.Provider>
  );
}

export function useParking() {
  const context = useContext(ParkingContext);
  if (context === undefined) {
    throw new Error('useParking must be used within a ParkingProvider');
  }
  return context;
}
