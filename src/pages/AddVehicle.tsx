import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, Car, Hash, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useParking } from '@/contexts/ParkingContext';
import { useToast } from '@/hooks/use-toast';
import { Vehicle } from '@/types/parking';
import { cn } from '@/lib/utils';

const CAR_BRANDS = ['Tesla', 'BMW', 'Mercedes', 'Toyota', 'Honda', 'Hyundai', 'Tata', 'Mahindra'];
const CAR_MODELS: Record<string, string[]> = {
  'Tesla': ['Model 3', 'Model S', 'Model X', 'Model Y'],
  'BMW': ['X5', 'M3', 'Series 7', 'i4'],
  'Mercedes': ['C-Class', 'E-Class', 'S-Class', 'G-Wagon'],
  'Toyota': ['Camry', 'Fortuner', 'Innova', 'Glanza'],
  'Honda': ['City', 'Civic', 'Elevate', 'Amaze'],
  'Hyundai': ['Creta', 'Verna', 'Ioniq 5', 'Venue'],
  'Tata': ['Nexon', 'Harrier', 'Safari', 'Punch'],
  'Mahindra': ['XUV700', 'Scorpio-N', 'Thar', 'XUV300']
};

export default function AddVehiclePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { vehicles, setVehicles, setSelectedVehicle, user } = useParking();

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const state = location.state as { scannedData?: { number: string } };
    if (state?.scannedData) {
      setVehicleNumber(state.scannedData.number);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formattedNumber = vehicleNumber.toUpperCase().replace(/\s+/g, ' ').trim();

    if (vehicles.some((v) => v.number === formattedNumber)) {
      toast({
        title: 'Vehicle already exists',
        description: 'This vehicle number is already registered',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      const newVehicle: Vehicle = {
        id: `vehicle_${Date.now()}`,
        user_id: user?.id || 'demo',
        number: formattedNumber,
        type: 'car',
        first_name: firstName,
        last_name: lastName,
        brand: brand,
        model: model,
        mobile_number: mobileNumber,
        created_at: new Date().toISOString(),
      };

      const updatedVehicles = [...vehicles, newVehicle];
      setVehicles(updatedVehicles);
      localStorage.setItem('parking_vehicles', JSON.stringify(updatedVehicles));

      toast({
        title: 'Vehicle Registered!',
        description: `${brand || 'Vehicle'} (${formattedNumber}) is ready.`,
      });

      setIsLoading(false);

      const state = location.state as { location?: any; returnToBooking?: boolean };
      if (state?.returnToBooking) {
        setSelectedVehicle(newVehicle);
        navigate('/slots', { state: { location: state.location } });
      } else {
        navigate('/home');
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FE] flex flex-col">
      {/* Header */}
      <div className="bg-[#4F46E5] text-white px-6 pt-12 pb-8 rounded-b-[40px] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />

        <div className="flex items-center gap-4 relative z-10">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold tracking-tight">Register Vehicle</h1>
        </div>

        <p className="mt-4 text-white/80 text-sm font-medium relative z-10">
          Add your vehicle details for quick parking
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 -mt-6 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[32px] p-6 shadow-sm space-y-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* First Name */}
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <User className="w-4 h-4" />
                  </div>
                  <Input
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="pl-11 h-12 bg-gray-50/50 border-gray-100 rounded-2xl focus-visible:ring-primary/20"
                    required
                  />
                </div>
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <User className="w-4 h-4" />
                  </div>
                  <Input
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="pl-11 h-12 bg-gray-50/50 border-gray-100 rounded-2xl focus-visible:ring-primary/20"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Car Number Plate */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Number Plate</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Hash className="w-4 h-4" />
                </div>
                <Input
                  placeholder="MH 12 AB 1234"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                  className="pl-11 h-12 bg-gray-50/50 border-gray-100 rounded-2xl font-bold tracking-widest uppercase"
                  required
                />
              </div>
            </div>

            {/* Car Brand - FLEXIBLE INPUT */}
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Car Brand</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Car className="w-4 h-4" />
                </div>
                <Input
                  placeholder="Type or select brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="pl-11 h-12 bg-gray-50/50 border-gray-100 rounded-2xl"
                  required
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {CAR_BRANDS.map(b => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBrand(b)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border uppercase tracking-wider",
                      brand === b
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-white text-gray-500 border-gray-100 hover:border-primary/30"
                    )}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Car Model - FLEXIBLE INPUT */}
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Car Model</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Car className="w-4 h-4" />
                </div>
                <Input
                  placeholder="Type or select model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="pl-11 h-12 bg-gray-50/50 border-gray-100 rounded-2xl"
                  required
                />
              </div>
              <AnimatePresence>
                {brand && CAR_MODELS[brand] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-wrap gap-2 overflow-hidden"
                  >
                    {CAR_MODELS[brand].map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setModel(m)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border uppercase tracking-wider",
                          model === m
                            ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                            : "bg-white text-gray-400 border-gray-100 hover:border-amber-500/30"
                        )}
                      >
                        {m}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Number */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Mobile Number</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Smartphone className="w-4 h-4" />
                </div>
                <Input
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="pl-11 h-12 bg-gray-50/50 border-gray-100 rounded-2xl"
                  required
                />
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-[#EFF4FF] p-4 rounded-2xl flex gap-3 items-start border border-[#D9E6FF]">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-primary shadow-sm flex-shrink-0">
                <Car className="w-5 h-5" />
              </div>
              <p className="text-[10px] text-[#1E3A8A] font-bold leading-relaxed uppercase tracking-wider mt-1">
                Your vehicle will be automatically detected when you scan a QR code
              </p>
            </div>

            <Button
              type="submit"
              className="w-full h-14 rounded-2xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? "Synchronizing..." : "Initialize Registration"}
            </Button>
          </form>
        </motion.div>
      </div>

      <div className="h-4" />
    </div>
  );
}
