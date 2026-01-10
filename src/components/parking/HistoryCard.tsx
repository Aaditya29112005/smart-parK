import { motion } from 'framer-motion';
import { Clock, MapPin, Car, Bike, Truck, Calendar } from 'lucide-react';
import { ParkingSession, VehicleType, VEHICLE_LABELS } from '@/types/parking';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';

interface HistoryCardProps {
  session: ParkingSession;
  index: number;
}

const VehicleIcon = ({ type, className }: { type: VehicleType; className?: string }) => {
  switch (type) {
    case 'bike':
      return <Bike className={className} />;
    case 'truck':
      return <Truck className={className} />;
    default:
      return <Car className={className} />;
  }
};

function formatDuration(startTime: string, endTime: string): string {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const diffInSeconds = Math.floor((end - start) / 1000);

  const hours = Math.floor(diffInSeconds / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export function HistoryCard({ session, index }: HistoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card variant="elevated" className="p-4 hover:shadow-card-hover">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <VehicleIcon
              type={session.vehicle?.type || 'car'}
              className="w-6 h-6 text-primary"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-foreground truncate">
                {session.vehicle?.number || 'Unknown'}
              </h3>
              <span className="font-bold text-lg text-primary">
                ₹{session.amount?.toFixed(0) || 0}
              </span>
            </div>

            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{session.slot?.name || 'Unknown'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>
                  {session.end_time
                    ? formatDuration(session.start_time, session.end_time)
                    : 'Active'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground font-medium">
                {format(new Date(session.start_time), 'd MMM yyyy, h:mm a')}
              </span>
              <span
                className={`ml-auto text-sm font-bold px-3 py-1 rounded-full ${session.status === 'completed'
                    ? 'bg-success/10 text-success'
                    : 'bg-warning/10 text-warning'
                  }`}
              >
                {session.status}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
