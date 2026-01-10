import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Loader2, UserCheck, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DigitalTwinHub } from '@/components/parking/DigitalTwinHub';
import { useParking } from '@/contexts/ParkingContext';
import { useToast } from '@/hooks/use-toast';
import { ParkingSlot, ParkingSession, VEHICLE_RATES } from '@/types/parking';

// Demo parking slots - Large parking area with 36 slots
const DEMO_SLOTS: ParkingSlot[] = [
  // Row A (Ground Floor)
  { id: 'a1', name: 'A1', is_available: true },
  { id: 'a2', name: 'A2', is_available: false },
  { id: 'a3', name: 'A3', is_available: false },
  { id: 'a4', name: 'A4', is_available: true },
  { id: 'a5', name: 'A5', is_available: false },
  { id: 'a6', name: 'A6', is_available: true },

  // Row B
  { id: 'b1', name: 'B1', is_available: true },
  { id: 'b2', name: 'B2', is_available: false },
  { id: 'b3', name: 'B3', is_available: true },
  { id: 'b4', name: 'B4', is_available: false },
  { id: 'b5', name: 'B5', is_available: true },
  { id: 'b6', name: 'B6', is_available: false },

  // Row C
  { id: 'c1', name: 'C1', is_available: true },
  { id: 'c2', name: 'C2', is_available: true },
  { id: 'c3', name: 'C3', is_available: false },
  { id: 'c4', name: 'C4', is_available: false },
  { id: 'c5', name: 'C5', is_available: true },
  { id: 'c6', name: 'C6', is_available: false },

  // Row D
  { id: 'd1', name: 'D1', is_available: false },
  { id: 'd2', name: 'D2', is_available: true },
  { id: 'd3', name: 'D3', is_available: false },
  { id: 'd4', name: 'D4', is_available: true },
  { id: 'd5', name: 'D5', is_available: false },
  { id: 'd6', name: 'D6', is_available: true },

  // Row E
  { id: 'e1', name: 'E1', is_available: true },
  { id: 'e2', name: 'E2', is_available: false },
  { id: 'e3', name: 'E3', is_available: false },
  { id: 'e4', name: 'E4', is_available: false },
  { id: 'e5', name: 'E5', is_available: true },
  { id: 'e6', name: 'E6', is_available: true },

  // Row F
  { id: 'f1', name: 'F1', is_available: false },
  { id: 'f2', name: 'F2', is_available: true },
  { id: 'f3', name: 'F3', is_available: false },
  { id: 'f4', name: 'F4', is_available: false },
  { id: 'f5', name: 'F5', is_available: true },
  { id: 'f6', name: 'F6', is_available: false },
];

export default function SlotSelectionPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    user,
    vehicles,
    selectedVehicle,
    setSelectedVehicle,
    setActiveSession,
    requestValet,
    valetAssignments
  } = useParking();

  const [slots, setSlots] = useState<ParkingSlot[]>(DEMO_SLOTS);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isValetLoading, setIsValetLoading] = useState(false);
  const [recommendedSlot, setRecommendedSlot] = useState<string>('');

  useEffect(() => {
    // Auto-select if there's only one vehicle and none selected
    if (!selectedVehicle && vehicles.length === 1) {
      setSelectedVehicle(vehicles[0]);
    }

    if (!selectedVehicle && vehicles.length > 1) {
      navigate('/home');
      return;
    }

    if (!selectedVehicle && vehicles.length === 0) {
      navigate('/add-vehicle', { state: { returnToBooking: true } });
      return;
    }

    // FORCE RESET - Always load fresh demo slots
    localStorage.removeItem('parking_slots');
    setSlots(DEMO_SLOTS);
    localStorage.setItem('parking_slots', JSON.stringify(DEMO_SLOTS));

    // AI recommendation
    const availableSlots = DEMO_SLOTS.filter((s: ParkingSlot) => s.is_available);
    if (availableSlots.length > 0) {
      const bestSlot = availableSlots.sort((a: ParkingSlot, b: ParkingSlot) => {
        const scoreA = (4 - parseInt(a.id.slice(1))) + (a.id.startsWith('a') ? 10 : 0);
        const scoreB = (4 - parseInt(b.id.slice(1))) + (b.id.startsWith('a') ? 10 : 0);
        return scoreB - scoreA;
      })[0];

      setTimeout(() => {
        setRecommendedSlot(bestSlot.id);
        toast({
          title: "AI Analysis Complete ⚡",
          description: `Found optimal slot ${bestSlot.name} based on vehicle size and exit proximity.`,
        });
      }, 1500);
    }
  }, [selectedVehicle, vehicles, setSelectedVehicle, navigate, toast]);

  const handleSlotSelect = (slot: ParkingSlot) => {
    setSelectedSlotId(slot.id);
  };

  const handleStartParking = async () => {
    if (!selectedSlotId || !selectedVehicle || !user) return;

    setIsLoading(true);

    const selectedSlot = slots.find((s) => s.id === selectedSlotId);
    if (!selectedSlot) return;

    // Create parking session
    const session: ParkingSession = {
      id: `session_${Date.now()}`,
      user_id: user.id,
      vehicle_id: selectedVehicle.id,
      slot_id: selectedSlotId,
      start_time: new Date().toISOString(),
      end_time: null,
      amount: null,
      status: 'active',
      created_at: new Date().toISOString(),
      vehicle: selectedVehicle,
      slot: selectedSlot,
    };

    // Update slot availability
    const updatedSlots = slots.map((s) =>
      s.id === selectedSlotId ? { ...s, is_available: false } : s
    );
    setSlots(updatedSlots);
    localStorage.setItem('parking_slots', JSON.stringify(updatedSlots));

    // Save active session
    setActiveSession(session);
    localStorage.setItem('parking_active_session', JSON.stringify(session));

    setTimeout(() => {
      toast({
        title: 'Parking started! 🚗',
        description: `Your vehicle is parked at slot ${selectedSlot.name}`,
      });
      setIsLoading(false);
      navigate('/parking');
    }, 500);
  };

  const handleRequestValet = async () => {
    if (!selectedSlotId || !selectedVehicle || !user) return;

    setIsValetLoading(true);
    const selectedSlot = slots.find((s) => s.id === selectedSlotId);

    requestValet({
      customer_id: user.id,
      customer_name: user.email.split('@')[0],
      vehicle_details: `${selectedVehicle.number} (${selectedVehicle.type})`,
      type: 'park',
      location: `Zone ${selectedSlot?.name.charAt(0)} - ${selectedSlot?.name}`,
      slot_id: selectedSlotId,
      slot_name: selectedSlot?.name
    });

    setTimeout(() => {
      toast({
        title: "Valet Requested! 🏎️",
        description: "An elite driver is being assigned to your location.",
      });
      setIsValetLoading(false);
      navigate('/parking');
    }, 1500);
  };

  const selectedSlot = slots.find((s) => s.id === selectedSlotId);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-hero text-primary-foreground px-6 pt-6 pb-6 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary-foreground"
          />
        </div>

        <div className="relative z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-primary-foreground hover:bg-primary-foreground/20 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl font-bold">Select Parking Slot</h1>
            <p className="text-primary-foreground/80 text-sm mt-1">
              {selectedVehicle?.number} • {selectedVehicle?.type}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-80 space-y-6">
        {/* AI Recommendation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="p-4 border-accent bg-accent/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">
                  {recommendedSlot ? 'AI Recommendation' : 'Analyzing Layout...'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {recommendedSlot
                    ? `Slot ${slots.find((s) => s.id === recommendedSlot)?.name} is optimized for your ${selectedVehicle?.type}`
                    : 'Calculating optimal path and vehicle dimensions...'}
                </p>
              </div>
              {!recommendedSlot && <Loader2 className="w-5 h-5 text-accent animate-spin" />}
            </div>
          </Card>
        </motion.div>

        {/* Slots Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 overflow-hidden">
            <h2 className="text-lg font-bold text-foreground mb-4 text-center">
              Digital Twin Layout ({slots.length} slots)
            </h2>
            <DigitalTwinHub
              slots={slots}
              selectedSlot={selectedSlotId || undefined}
              onSelectSlot={handleSlotSelect}
              recommendedSlot={recommendedSlot}
            />
          </Card>
        </motion.div>
      </div>

      {/* Bottom Action */}
      {selectedSlot && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border z-50"
        >
          <Card className="p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Selected Slot</p>
                <p className="text-xl font-bold text-foreground">{selectedSlot.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Rate</p>
                <p className="text-xl font-bold text-primary">
                  ₹{VEHICLE_RATES[selectedVehicle?.type || 'car']}/hr
                </p>
              </div>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button
              variant="outline"
              size="xl"
              className="flex-1 bg-white border-primary/20 text-primary hover:bg-primary/5 font-bold"
              onClick={handleRequestValet}
              disabled={isLoading || isValetLoading}
            >
              {isValetLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <div className="flex flex-col items-center leading-none">
                  <UserCheck className="w-4 h-4 mb-1" />
                  <span className="text-[10px] uppercase">Request Valet</span>
                </div>
              )}
            </Button>
            <Button
              variant="gradient"
              size="xl"
              className="flex-[2] shadow-lg shadow-primary/20"
              onClick={handleStartParking}
              disabled={isLoading || isValetLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <div className="flex items-center gap-2">
                  Start Parking
                  <ShieldCheck className="w-5 h-5 opacity-50" />
                </div>
              )}
            </Button>
          </div>
        </motion.div>
      )
      }
    </div >
  );
}
