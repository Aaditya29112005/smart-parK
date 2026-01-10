import { motion } from 'framer-motion';
import { ParkingSlot } from '@/types/parking';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface ParkingSlotGridProps {
  slots: ParkingSlot[];
  selectedSlot?: string;
  onSelectSlot: (slot: ParkingSlot) => void;
  recommendedSlot?: string;
}

export function ParkingSlotGrid({
  slots,
  selectedSlot,
  onSelectSlot,
  recommendedSlot,
}: ParkingSlotGridProps) {
  // Group slots by row (A, B, C, etc.)
  const groupedSlots = slots.reduce((acc, slot) => {
    const row = slot.name.charAt(0).toUpperCase();
    if (!acc[row]) acc[row] = [];
    acc[row].push(slot);
    return acc;
  }, {} as Record<string, ParkingSlot[]>);

  return (
    <div className="space-y-4">
      {Object.entries(groupedSlots).map(([row, rowSlots]) => (
        <div
          key={row}
          className="flex gap-3 justify-center"
        >
          {rowSlots.map((slot) => {
            const isSelected = selectedSlot === slot.id;
            const isRecommended = recommendedSlot === slot.id;

            return (
              <button
                key={slot.id}
                onClick={() => slot.is_available && onSelectSlot(slot)}
                disabled={!slot.is_available}
                className={cn(
                  "parking-slot w-16 h-20 relative",
                  slot.is_available
                    ? isSelected
                      ? "parking-slot-selected"
                      : "parking-slot-available"
                    : "parking-slot-occupied"
                )}
              >
                {isRecommended && !isSelected && slot.is_available && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center shadow-lg">
                    <Sparkles className="w-3 h-3 text-accent-foreground" />
                  </div>
                )}
                <span className="font-bold">{slot.name}</span>
                {isSelected && (
                  <div className="absolute inset-0 rounded-xl border-2 border-primary-foreground/50" />
                )}
              </button>
            );
          })}
        </div>
      ))}

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-success/20 border-2 border-success/50" />
          <span className="text-sm text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-destructive/20 border-2 border-destructive/50" />
          <span className="text-sm text-muted-foreground">Occupied</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary" />
          <span className="text-sm text-muted-foreground">Selected</span>
        </div>
      </div>
    </div>
  );
}
