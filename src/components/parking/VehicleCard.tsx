import { motion } from 'framer-motion';
import { Car, Bike, Truck, ChevronRight, Trash2 } from 'lucide-react';
import { Vehicle, VEHICLE_LABELS, VehicleType } from '@/types/parking';
import { cn } from '@/lib/utils';

interface VehicleCardProps {
  vehicle: Vehicle;
  isSelected?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
  showArrow?: boolean;
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

export function VehicleCard({ vehicle, isSelected, onClick, onDelete, showArrow = true }: VehicleCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 cursor-pointer",
        isSelected
          ? "bg-primary text-primary-foreground border-primary shadow-glow"
          : "bg-card border-border hover:border-primary/50 hover:shadow-card-hover"
      )}
    >
      <div
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center",
          isSelected ? "bg-primary-foreground/20" : "bg-primary/10"
        )}
      >
        <VehicleIcon
          type={vehicle.type}
          className={cn("w-6 h-6", isSelected ? "text-primary-foreground" : "text-primary")}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={cn("font-bold text-lg leading-tight truncate", isSelected ? "text-primary-foreground" : "text-foreground")}>
            {vehicle.number}
          </p>
          {vehicle.brand && (
            <span className={cn(
              "text-[10px] px-2 py-0.5 rounded-full font-black uppercase",
              isSelected ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
            )}>
              {vehicle.brand}
            </span>
          )}
        </div>
        <p className={cn("text-xs font-medium mt-0.5", isSelected ? "text-primary-foreground/80" : "text-muted-foreground")}>
          {vehicle.brand ? `${vehicle.brand} ${vehicle.model || ''}` : VEHICLE_LABELS[vehicle.type]}
        </p>
      </div>

      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className={cn(
            "p-2 rounded-lg transition-colors",
            isSelected
              ? "hover:bg-primary-foreground/20 text-primary-foreground"
              : "hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
          )}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}

      {showArrow && (
        <ChevronRight
          className={cn(
            "w-5 h-5",
            isSelected ? "text-primary-foreground" : "text-muted-foreground"
          )}
        />
      )}
    </motion.div>
  );
}
