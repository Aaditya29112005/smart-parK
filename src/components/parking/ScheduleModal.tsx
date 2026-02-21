import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar as CalendarIcon, Clock, Car } from 'lucide-react';
import { format, addHours } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useParking } from '@/contexts/ParkingContext';
import { ParkingLocation } from '@/data/parkingLocations';
import { Vehicle } from '@/types/parking';
import type { Booking } from '@/types/parking';
import { VEHICLE_RATES } from '@/types/parking';
import { useToast } from '@/hooks/use-toast';

interface ScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    location: ParkingLocation;
}

export function ScheduleModal({ isOpen, onClose, location }: ScheduleModalProps) {
    const { user, vehicles, selectedVehicle, addBooking } = useParking();
    const { toast } = useToast();
    const navigate = useNavigate();

    const [date, setDate] = useState<Date>(new Date());
    const [startTime, setStartTime] = useState<string>('09:00');
    const [duration, setDuration] = useState<number>(2);

    // Safely initialize vehicleId
    const initialVehicleId = selectedVehicle?.id || (vehicles.length > 0 ? vehicles[0].id : '');
    const [vehicleId, setVehicleId] = useState<string>(initialVehicleId);

    const vehicle = vehicles.find(v => v.id === vehicleId) || (vehicles.length > 0 ? vehicles[0] : undefined);

    // Safety check for pricing
    const hourlyRate = location?.pricing?.hourly || 0;

    // Calculate price based on duration + vehicle type multiplier
    const vehicleMultiplier = vehicle ? (VEHICLE_RATES[vehicle.type] / 20) : 1;
    const totalCost = (hourlyRate * duration * vehicleMultiplier);

    const handleConfirm = () => {
        if (!user) {
            toast({ title: "Error", description: "Please log in first.", variant: "destructive" });
            return;
        }
        if (!vehicle) {
            toast({ title: "Error", description: "Please add a vehicle first.", variant: "destructive" });
            return;
        }

        const [hours, minutes] = startTime.split(':').map(Number);
        const startDateTime = new Date(date);
        startDateTime.setHours(hours, minutes, 0, 0);

        const endDateTime = addHours(startDateTime, duration);

        // Prevent past bookings
        if (startDateTime < new Date()) {
            toast({ title: "Invalid Time", description: "Cannot schedule in the past.", variant: "destructive" });
            return;
        }

        const newBooking: Booking = {
            id: `bk_${Date.now()}`,
            user_id: user.id,
            location_id: location.id,
            location_name: location.name,
            location_address: location.address,
            vehicle_id: vehicle.id,
            vehicle_number: vehicle.number,
            start_time: startDateTime.toISOString(),
            end_time: endDateTime.toISOString(),
            duration_hours: duration,
            total_price: totalCost,
            status: 'upcoming',
            created_at: new Date().toISOString()
        };

        addBooking(newBooking);
        toast({
            title: "Booking Scheduled! 📅",
            description: `Reserved at ${location.name} for ${format(startDateTime, 'PPP p')}`
        });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center sm:p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-md bg-background rounded-t-[2rem] md:rounded-[2rem] overflow-hidden shadow-2xl h-[85vh] md:h-auto flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 pb-2 border-b border-border/50">
                            <div className="flex justify-between items-center mb-1">
                                <Badge variant="outline" className="rounded-full border-primary/20 text-primary bg-primary/5 uppercase text-[10px] tracking-widest font-bold">
                                    Schedule Parking
                                </Badge>
                                <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full hover:bg-muted">
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                            <h2 className="text-2xl font-black tracking-tight">{location?.name || 'Parking Location'}</h2>
                            <p className="text-sm text-muted-foreground">{location?.address || ''}</p>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">

                            {/* Date Selection */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                    <CalendarIcon className="w-4 h-4" /> Select Date
                                </label>
                                <div className="border border-border rounded-xl p-2 bg-card">
                                    <style>{`.rdp { --rdp-cell-size: 40px; --rdp-accent-color: hsl(var(--primary)); margin: 0; } .rdp-day_selected { background-color: var(--rdp-accent-color); }`}</style>
                                    <DayPicker
                                        mode="single"
                                        selected={date}
                                        onSelect={(d) => d && setDate(d)}
                                        disabled={{ before: new Date() }}
                                        className="mx-auto"
                                    />
                                </div>
                            </div>

                            {/* Time & Duration */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase">Start Time</label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="time"
                                            value={startTime}
                                            onChange={(e) => setStartTime(e.target.value)}
                                            className="w-full h-10 pl-9 pr-3 rounded-xl border border-input bg-background/50 text-sm font-medium focus:ring-1 focus:ring-primary outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase">Duration</label>
                                    <select
                                        value={duration}
                                        onChange={(e) => setDuration(Number(e.target.value))}
                                        className="w-full h-10 px-3 rounded-xl border border-input bg-background/50 text-sm font-medium focus:ring-1 focus:ring-primary outline-none appearance-none"
                                    >
                                        {[1, 2, 3, 4, 5, 8, 12, 24].map(h => (
                                            <option key={h} value={h}>{h} Hour{h > 1 ? 's' : ''}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Vehicle Selection */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                    <Car className="w-4 h-4" /> Select Vehicle
                                </label>

                                {vehicles.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-2">
                                        {vehicles.map(v => (
                                            <div
                                                key={v.id}
                                                onClick={() => setVehicleId(v.id)}
                                                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${vehicleId === v.id ? 'border-primary bg-primary/10' : 'border-border bg-card'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center shadow-sm text-lg">
                                                        {v.type === 'car' ? '🚗' : v.type === 'bike' ? '🏍️' : '🚛'}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm">{v.number}</p>
                                                        <p className="text-xs text-muted-foreground capitalize">{v.brand || v.type}</p>
                                                    </div>
                                                </div>
                                                {vehicleId === v.id && <div className="h-2 w-2 rounded-full bg-primary" />}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex flex-col items-center gap-3">
                                        <p className="text-orange-500 text-xs font-medium text-center">
                                            No vehicles found. Please add a vehicle first.
                                        </p>
                                        <Button
                                            size="sm"
                                            variant="default"
                                            onClick={() => {
                                                onClose();
                                                navigate('/add-vehicle');
                                            }}
                                            className="bg-orange-500 text-white hover:bg-orange-600 rounded-lg text-xs font-bold h-8"
                                        >
                                            Add Vehicle Now
                                        </Button>
                                    </div>
                                )}
                            </div>

                        </div>

                        {/* Footer / total */}
                        <div className="p-6 bg-card border-t border-border">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex flex-col">
                                    <span className="text-xs text-muted-foreground font-bold uppercase">Total Estimate</span>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-black text-foreground">₹{totalCost.toFixed(0)}</span>
                                        <span className="text-xs text-muted-foreground">/ {duration} hrs</span>
                                    </div>
                                </div>
                            </div>
                            <Button
                                size="lg"
                                className="w-full font-bold text-lg h-14 rounded-xl shadow-lg shadow-primary/25"
                                onClick={handleConfirm}
                                disabled={!vehicle || !user}
                            >
                                Confirm Schedule
                            </Button>
                        </div>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
