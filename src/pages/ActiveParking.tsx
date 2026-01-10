import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Car, Loader2, AlertCircle, Ticket, CheckCircle2, Compass, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ParkingTimer } from '@/components/parking/ParkingTimer';
import { useParking } from '@/contexts/ParkingContext';
import { useToast } from '@/hooks/use-toast';
import { VEHICLE_RATES, VEHICLE_ICONS } from '@/types/parking';
import { DigitalTicket } from '@/components/parking/DigitalTicket';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ARTerminal } from '@/components/parking/ARTerminal';

export default function ActiveParkingPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    user,
    activeSession,
    setActiveSession,
    slots,
    setSlots,
    history,
    setHistory,
    valetAssignments,
  } = useParking();
  const [isLoading, setIsLoading] = useState(false);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [isAROpen, setIsAROpen] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number, lng: number } | null>(null);

  useEffect(() => {
    // Check for active session in localStorage
    const savedSession = localStorage.getItem('parking_active_session');
    if (savedSession && !activeSession) {
      setActiveSession(JSON.parse(savedSession));
    }

    if (!savedSession && !activeSession) {
      navigate('/home');
      return;
    }

    // Get live location for AR
    if ('geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.error(err),
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [activeSession, navigate, setActiveSession]);

  useEffect(() => {
    if (!activeSession) return;

    // Calculate current amount every second
    const interval = setInterval(() => {
      const start = new Date(activeSession.start_time).getTime();
      const now = Date.now();
      const diffInSeconds = Math.floor((now - start) / 1000);
      const rate = VEHICLE_RATES[activeSession.vehicle?.type || 'car'];
      const amount = (diffInSeconds / 3600) * rate;
      setCurrentAmount(amount);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession]);

  const handleStopParking = async () => {
    if (!activeSession) return;

    setIsLoading(true);

    const endTime = new Date().toISOString();
    const start = new Date(activeSession.start_time).getTime();
    const end = new Date(endTime).getTime();
    const diffInSeconds = Math.floor((end - start) / 1000);
    const rate = VEHICLE_RATES[activeSession.vehicle?.type || 'car'];
    const finalAmount = Math.max(1, (diffInSeconds / 3600) * rate);

    // Complete the session
    const completedSession = {
      ...activeSession,
      end_time: endTime,
      amount: finalAmount,
      status: 'completed' as const,
    };

    // Free up the slot
    const updatedSlots = slots.map((s) =>
      s.id === activeSession.slot_id ? { ...s, is_available: true } : s
    );
    setSlots(updatedSlots);
    localStorage.setItem('parking_slots', JSON.stringify(updatedSlots));

    // Add to history
    const updatedHistory = [completedSession, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('parking_history', JSON.stringify(updatedHistory));

    // Clear active session
    setActiveSession(null);
    localStorage.removeItem('parking_active_session');

    setTimeout(() => {
      setIsLoading(false);
      navigate('/bill', { state: { session: completedSession } });
    }, 500);
  };

  const activeValet = valetAssignments.find(a => a.customer_id === user?.id && a.status !== 'completed' && a.status !== 'parked');
  const parkedValet = valetAssignments.find(a => a.customer_id === user?.id && a.status === 'parked');

  if (!activeSession) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="gradient-hero text-primary-foreground px-6 pt-6 pb-6 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary-foreground"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.05 }}
            className="absolute top-40 -left-32 w-96 h-96 rounded-full bg-primary-foreground"
          />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/home')}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="glass"
              size="sm"
              onClick={() => setIsTicketOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-black uppercase text-[10px] tracking-widest gap-2"
            >
              <Ticket className="w-4 h-4" />
              Digital Ticket
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
              <span className="text-sm font-medium text-primary-foreground/80">
                ACTIVE PARKING
              </span>
            </div>
            <h1 className="text-2xl font-bold">Parking in Progress</h1>
          </motion.div>
        </div>
      </div>

      <Dialog open={isTicketOpen} onOpenChange={setIsTicketOpen}>
        <DialogContent className="p-0 border-0 bg-transparent shadow-none max-w-sm sm:max-w-sm">
          {activeSession && <DigitalTicket session={activeSession} />}
        </DialogContent>
      </Dialog>

      {/* Timer */}
      <div className="px-4 flex justify-center -mt-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          <ParkingTimer startTime={activeSession.start_time} />
        </motion.div>
      </div>

      {/* Valet Status HUD */}
      <AnimatePresence>
        {(activeValet || parkedValet) && (
          <div className="px-4 mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className={`p-5 border-2 ${parkedValet ? 'border-emerald-500/20 bg-emerald-50/50' : 'border-primary/20 bg-primary/5'} relative overflow-hidden`}>
                <div className={`absolute top-0 right-0 w-32 h-32 ${parkedValet ? 'bg-emerald-500/10' : 'bg-primary/10'} rounded-full -mr-16 -mt-16 blur-2xl`} />

                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${parkedValet ? 'bg-emerald-500' : 'bg-primary'} animate-pulse`} />
                    <span className={`text-[10px] font-black ${parkedValet ? 'text-emerald-600' : 'text-primary'} uppercase tracking-widest`}>
                      {parkedValet ? 'Mission Success' : 'Valet Mission Active'}
                    </span>
                  </div>
                  <Badge variant="outline" className={`${parkedValet ? 'bg-emerald-500/10 text-emerald-600 border-emerald-200' : 'bg-primary/10 text-primary border-primary/20'} text-[9px] font-black uppercase`}>
                    {(activeValet || parkedValet)?.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 relative z-10">
                  <div className={`w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center ${parkedValet ? 'text-emerald-600' : 'text-primary'}`}>
                    {parkedValet ? <CheckCircle2 className="w-6 h-6 animate-bounce" /> : <Navigation className="w-6 h-6 animate-pulse" />}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 text-sm">
                      {parkedValet ? 'Vehicle Parked Successfully' :
                        activeValet?.status === 'pending' ? 'Dispatching Valet...' :
                          activeValet?.status === 'accepted' ? 'Valet En Route' :
                            activeValet?.status === 'in-progress' ? 'Securing Vehicle' : 'Mission Success!'}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">
                      {(activeValet || parkedValet)?.driver_id ? 'Driver: Rajesh Kumar' : 'Assigning nearest elite driver'}
                    </p>
                  </div>
                </div>

                {parkedValet && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 p-3 bg-emerald-500 rounded-xl flex items-center justify-between text-white shadow-lg shadow-emerald-200"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-xs font-black uppercase tracking-tighter">Secured at {parkedValet.slot_name}</span>
                    </div>
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 h-8 text-[10px] font-black uppercase">
                      View Photo
                    </Button>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Info Cards */}
      <div className="px-4 mt-8 space-y-4">
        {/* Vehicle & Slot Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl">
                {VEHICLE_ICONS[activeSession.vehicle?.type || 'car']}
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Vehicle</p>
                <p className="text-lg font-bold text-foreground">
                  {activeSession.vehicle?.number}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Slot</p>
                <p className="text-lg font-bold text-primary">
                  {activeSession.slot?.name}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Current Amount */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-4 bg-success/5 border-success/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Charges</p>
                <p className="text-3xl font-bold text-success">
                  ₹{currentAmount.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Rate</p>
                <p className="text-lg font-semibold text-foreground">
                  ₹{VEHICLE_RATES[activeSession.vehicle?.type || 'car']}/hr
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Warning */}
        {!parkedValet && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-4 bg-warning/5 border-warning/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Remember your slot
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your vehicle is parked at slot {activeSession.slot?.name}. Make sure
                    to stop parking before leaving.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* AR Guide Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            onClick={() => setIsAROpen(true)}
            className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase italic tracking-tighter flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(var(--primary),0.3)]"
          >
            <Compass className="w-6 h-6 animate-pulse" />
            Find My Car (AR Guide)
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {isAROpen && activeSession && (
          <ARTerminal
            targetCoords={{
              lat: activeSession.slot?.lat || 18.5622,
              lng: activeSession.slot?.lng || 73.9167
            }}
            userCoords={userCoords}
            onClose={() => setIsAROpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Stop Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border">
        <Button
          variant="destructive"
          size="xl"
          className="w-full shadow-lg shadow-red-100"
          onClick={handleStopParking}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            'Stop Parking'
          )}
        </Button>
      </div>
    </div>
  );
}
