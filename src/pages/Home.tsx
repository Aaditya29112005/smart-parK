import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Car, LogOut, QrCode, ChevronRight, Sparkles, Search, Loader2 } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { VehicleCard } from '@/components/parking/VehicleCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useParking } from '@/contexts/ParkingContext';
import { useToast } from '@/hooks/use-toast';
import { Vehicle, ParkingSession } from '@/types/parking';
import { HistoryCard } from '@/components/parking/HistoryCard';

// --- Sophisticated UI Utility Components ---

// Noise Texture Overlay Component
const Noise = () => (
  <div className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none mix-blend-overlay z-50"
    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
);

// Magnetic Component for icons
const Magnetic = ({ children }: { children: React.ReactNode }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const mouseX = useSpring(x, springConfig);
  const mouseY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set(clientX - centerX);
    y.set(clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: mouseX, y: mouseY }}
    >
      {children}
    </motion.div>
  );
};

// 3D Tilt Card Component
const TiltCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [100, -100], [10, -10]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [10, -10]), { stiffness: 300, damping: 30 });

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const xPct = (mouseX / width - 0.5) * 200;
    const yPct = (mouseY / height - 0.5) * 200;
    x.set(xPct);
    y.set(yPct);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
    >
      <div style={{ transform: "translateZ(50px)" }}>
        {children}
      </div>
    </motion.div>
  );
};

// Live Ping Component
const LivePing = ({ label }: { label: string }) => (
  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
    </span>
    <span className="text-[11px] font-black text-white uppercase tracking-tighter">{label}</span>
  </div>
);

// --- Demo Data ---

const DEMO_VEHICLES: Vehicle[] = [
  { id: '1', user_id: 'demo', number: 'MH 12 AB 1234', type: 'car', created_at: new Date().toISOString() },
  { id: '2', user_id: 'demo', number: 'MH 14 CD 5678', type: 'bike', created_at: new Date().toISOString() },
];

const DEMO_HISTORY: ParkingSession[] = [
  {
    id: '1',
    user_id: 'demo',
    vehicle_id: '1',
    slot_id: '1',
    start_time: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    end_time: new Date().toISOString(),
    amount: 80,
    status: 'completed',
    created_at: new Date().toISOString(),
    vehicle: DEMO_VEHICLES[0],
    slot: { id: '1', name: 'A2', is_available: true },
  },
  {
    id: '2',
    user_id: 'demo',
    vehicle_id: '2',
    slot_id: '2',
    start_time: new Date(Date.now() - 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    amount: 20,
    status: 'completed',
    created_at: new Date().toISOString(),
    vehicle: DEMO_VEHICLES[1],
    slot: { id: '2', name: 'B1', is_available: true },
  },
];

// --- Main Component ---

export default function HomePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    user,
    setUser,
    isLoading,
    vehicles,
    setVehicles,
    setSelectedVehicle,
    activeSession,
    history,
    setHistory,
  } = useParking();

  useEffect(() => {
    const savedVehicles = localStorage.getItem('parking_vehicles');
    if (savedVehicles) {
      setVehicles(JSON.parse(savedVehicles));
    } else {
      setVehicles(DEMO_VEHICLES);
      localStorage.setItem('parking_vehicles', JSON.stringify(DEMO_VEHICLES));
    }

    const savedHistory = localStorage.getItem('parking_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    } else {
      setHistory(DEMO_HISTORY);
      localStorage.setItem('parking_history', JSON.stringify(DEMO_HISTORY));
    }
  }, [setVehicles, setHistory]);

  const handleLogout = () => {
    setUser(null);
    toast({ title: 'Logged out successfully' });
    navigate('/auth');
  };

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    navigate('/slots');
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    const updatedVehicles = vehicles.filter((v) => v.id !== vehicleId);
    setVehicles(updatedVehicles);
    localStorage.setItem('parking_vehicles', JSON.stringify(updatedVehicles));
    toast({ title: 'Vehicle removed' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const userName = user?.email?.split('@')[0] || 'User';

  return (
    <MobileLayout>
      {/* Header with Mesh Gradient */}
      <div className="min-h-[320px] text-primary-foreground px-6 pt-8 pb-10 relative overflow-hidden flex flex-col justify-end">
        {/* Advanced Fluid Mesh Background */}
        <div className="absolute inset-0 bg-primary pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              x: [0, 50, 0],
              y: [0, 30, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[10%] -right-[10%] w-[120%] h-[120%] bg-accent/30 blur-[130px] rounded-full"
          />
          <motion.div
            animate={{
              scale: [1.3, 1, 1.3],
              x: [0, -40, 0],
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[10%] -left-[20%] w-[100%] h-[100%] bg-white/20 blur-[110px] rounded-full"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/40" />
        </div>

        <Noise />

        <div className="relative z-10 w-full max-w-lg mx-auto">
          {/* Top Actions */}
          <div className="flex items-center justify-between mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <LivePing label="System Online" />
              <h1 className="text-4xl font-black tracking-tighter capitalize mt-3 leading-none">
                <span className="bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/40 drop-shadow-sm">
                  Hi, {userName}
                </span>
                <motion.span
                  animate={{ rotate: [0, 20, -10, 20, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="inline-block ml-3 text-3xl drop-shadow-2xl"
                >👋</motion.span>
              </h1>
            </motion.div>

            <div className="flex flex-col items-end gap-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-[10px] font-black shadow-2xl shadow-accent/40 border border-white/30 uppercase tracking-[0.2em]"
              >
                Premium Tier
              </motion.div>
              <Button
                variant="glass"
                size="icon"
                onClick={handleLogout}
                className="w-12 h-12 rounded-xl text-primary-foreground border-white/20 bg-white/5 backdrop-blur-3xl hover:bg-white/10 hover:border-white/40 transition-all duration-500 shadow-xl"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* SaaS-Pill Floating Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 cursor-pointer group"
            onClick={() => navigate('/find-parking')}
          >
            <div className="bg-white/10 backdrop-blur-3xl rounded-[2rem] p-1.5 pl-6 flex items-center gap-4 border border-white/20 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.3)] hover:bg-white/15 transition-all duration-500 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
              />
              <Search className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
              <div className="text-white/50 group-hover:text-white/90 transition-colors font-bold tracking-tight text-lg">
                Identify Spot
              </div>
              <div className="ml-auto bg-accent text-accent-foreground h-12 px-8 rounded-[1.5rem] flex items-center justify-center font-black tracking-tight shadow-xl shadow-accent/30 group-hover:scale-[1.03] active:scale-95 transition-all duration-300">
                Search
              </div>
            </div>
          </motion.div>

          {/* AI Smart Parking Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <TiltCard>
              <Card className="bg-white/10 backdrop-blur-3xl border-white/20 p-5 rounded-[2rem] hover:bg-white/15 transition-all duration-500 group cursor-pointer overflow-hidden relative shadow-[0_45px_100px_-20px_rgba(0,0,0,0.4)]">
                <Noise />
                {/* Spectral Scanning Line */}
                <motion.div
                  animate={{
                    top: ["-50%", "150%"],
                    opacity: [0.1, 0.4, 0.1]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-white/60 to-transparent z-20 pointer-events-none"
                />

                <div className="flex items-center gap-6 relative z-10">
                  <Magnetic>
                    <div className="w-14 h-14 rounded-2xl bg-accent shadow-2xl shadow-accent/50 flex items-center justify-center group-hover:rotate-[15deg] transition-all duration-700">
                      <Sparkles className="w-7 h-7 text-accent-foreground" />
                    </div>
                  </Magnetic>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-black text-xl text-primary-foreground leading-tight tracking-tighter">AI Recommender</h3>
                      <div className="bg-white/20 px-2 py-0.5 rounded-full text-[8px] font-black uppercase text-white border border-white/10 tracking-[0.2em] backdrop-blur-md">Active</div>
                    </div>
                    <p className="text-sm text-primary-foreground/70 font-bold opacity-80 tracking-tight">Real-time neural spot allocation</p>
                  </div>
                  <ChevronRight className="w-6 h-6 text-primary-foreground/20 group-hover:text-primary-foreground group-hover:translate-x-2 transition-all duration-600" />
                </div>
              </Card>
            </TiltCard>
          </motion.div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="px-6 space-y-8 pb-12 mt-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card
            variant="elevated"
            className="p-5 rounded-2xl border-warning/50 bg-warning/5 cursor-pointer shadow-[0_20px_40px_rgba(var(--warning),0.1)] relative overflow-hidden"
            onClick={() => navigate('/parking')}
          >
            <div className="flex items-center gap-4 relative z-10">
              <Magnetic>
                <div className="w-14 h-14 rounded-xl bg-warning/20 flex items-center justify-center">
                  <Car className="w-7 h-7 text-warning" />
                </div>
              </Magnetic>
              <div className="flex-1">
                <h3 className="font-black text-lg text-foreground tracking-tight">Session In-Progress</h3>
                <p className="text-[10px] text-muted-foreground font-bold opacity-60 uppercase tracking-widest">Tap to view timeline</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-warning animate-ping opacity-75" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <TiltCard>
            <Card
              variant="elevated"
              className="p-6 rounded-[2rem] cursor-pointer hover:bg-white/80 transition-all duration-700 group border-l-[10px] border-l-primary relative overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] hover:shadow-[0_60px_120px_-30px_rgba(0,0,0,0.2)] bg-white/50 backdrop-blur-xl"
              onClick={() => navigate('/smart-scan')}
            >
              <Noise />
              <div className="flex items-center gap-6 relative z-10">
                <Magnetic>
                  <div className="w-16 h-16 rounded-[1.5rem] bg-primary shadow-3xl shadow-primary/40 flex items-center justify-center group-hover:scale-105 transition-all duration-700">
                    <QrCode className="w-8 h-8 text-primary-foreground" />
                  </div>
                </Magnetic>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-black text-xl text-foreground tracking-tighter leading-none">Scan & Park</h3>
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  </div>
                  <p className="text-[10px] text-muted-foreground font-black opacity-30 uppercase tracking-[0.2em]">Holographic Authentication</p>
                </div>
                <ChevronRight className="w-8 h-8 text-muted-foreground/20 group-hover:text-primary group-hover:translate-x-3 transition-all duration-700" />
              </div>
            </Card>
          </TiltCard>
        </motion.div>

        {/* My Vehicles Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-foreground tracking-tighter">My Fleet</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/add-vehicle')}
              className="text-primary font-black uppercase text-[10px] tracking-widest hover:bg-primary/5 rounded-full px-3"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Register
            </Button>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {vehicles.map((vehicle, index) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: -50 }}
                  transition={{
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 150,
                    damping: 20
                  }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <VehicleCard
                    vehicle={vehicle}
                    onClick={() => handleVehicleSelect(vehicle)}
                    onDelete={() => handleDeleteVehicle(vehicle.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {vehicles.length === 0 && (
              <Card className="p-16 text-center rounded-[2.5rem] border-dashed border-2 border-muted-foreground/20 bg-muted/5">
                <Magnetic>
                  <Car className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
                </Magnetic>
                <p className="text-muted-foreground font-bold text-lg tracking-tight">No active deployments</p>
                <Button
                  variant="default"
                  size="lg"
                  onClick={() => navigate('/add-vehicle')}
                  className="mt-8 rounded-2xl px-10 font-black tracking-tight shadow-xl"
                >
                  <Plus className="w-5 h-5 mr-3" />
                  Add Vehicle
                </Button>
              </Card>
            )}
          </div>
        </motion.section>

        {/* History Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-foreground tracking-tighter">Audit Logs</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/history')}
              className="text-primary font-black uppercase text-[11px] tracking-widest hover:bg-primary/5 rounded-full px-4"
            >
              Review All
            </Button>
          </div>

          <div className="space-y-4">
            {history.slice(0, 3).map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <HistoryCard session={session} index={index} />
              </motion.div>
            ))}

            {history.length === 0 && (
              <Card className="p-10 text-center rounded-[2rem] bg-muted/5 border-muted-foreground/10">
                <p className="text-muted-foreground font-bold italic opacity-60 tracking-tight">Historical data null</p>
              </Card>
            )}
          </div>
        </motion.section>
      </div>
    </MobileLayout>
  );
}
