import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, MapPin, X, Car, Bike, Truck } from 'lucide-react';
import { format } from 'date-fns';
import { Booking, VehicleType } from '@/types/parking';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface BookingCardProps {
    booking: Booking;
    index: number;
    onCancel: (id: string) => void;
}

const VehicleIcon = ({ type, className }: { type: string; className?: string }) => {
    switch (type?.toLowerCase()) {
        case 'bike':
            return <Bike className={className} />;
        case 'truck':
            return <Truck className={className} />;
        default:
            return <Car className={className} />;
    }
};

export function BookingCard({ booking, index, onCancel }: BookingCardProps) {
    // Try to determine vehicle type from icon mapping or just default to car
    // In a real app we'd have the type in the booking, but we can guess or use a generic icon
    const vType = 'car'; // Fallback since vehicle type isn't directly in Booking type currently

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative group"
        >
            <Card variant="elevated" className="p-5 border-l-[6px] border-l-primary hover:shadow-xl transition-all duration-300 relative overflow-hidden bg-gradient-to-br from-card to-card/50">

                {/* Subtle background decoration */}
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <CalendarIcon className="w-24 h-24" />
                </div>

                <div className="flex flex-col gap-4 relative z-10">

                    {/* Header row: Location and Status */}
                    <div className="flex items-start justify-between">
                        <div className="flex-1 pr-4">
                            <h3 className="font-black text-lg text-foreground tracking-tight leading-tight mb-1">
                                {booking.location_name}
                            </h3>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                                <MapPin className="w-3.5 h-3.5" />
                                {booking.location_address || 'Parking Location'}
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
                                {booking.status}
                            </span>
                            <span className="text-lg font-black text-foreground">
                                ₹{booking.total_price.toFixed(0)}
                            </span>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 mt-1 p-3 rounded-xl bg-muted/30 border border-border/50">
                        {/* Time Info */}
                        <div className="col-span-2 sm:col-span-1 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center shadow-sm">
                                <Clock className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Sch. Arrival</p>
                                <p className="text-sm font-bold text-foreground">
                                    {format(new Date(booking.start_time), 'h:mm a')}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {format(new Date(booking.start_time), 'MMM d, yyyy')}
                                </p>
                            </div>
                        </div>

                        {/* Vehicle Info */}
                        <div className="col-span-2 sm:col-span-1 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center shadow-sm">
                                <VehicleIcon type={vType} className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Vehicle</p>
                                <p className="text-sm font-bold text-foreground">
                                    {booking.vehicle_number}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {booking.duration_hours} Hour{booking.duration_hours > 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Row */}
                    <div className="flex justify-end mt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onCancel(booking.id)}
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20 h-8 text-xs font-bold rounded-lg"
                        >
                            <X className="w-3.5 h-3.5 mr-1" />
                            Cancel Booking
                        </Button>
                    </div>

                </div>
            </Card>
        </motion.div>
    );
}
