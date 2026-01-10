import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Plus,
    Search,
    Clock,
    Star,
    ShieldAlert,
    UserPlus,
    MoreHorizontal,
    ChevronRight,
    Briefcase,
    TrendingUp,
    MapPin,
    Camera,
    Upload,
    Calendar,
    User,
    Smartphone,
    Mail,
    FileText,
    CreditCard,
    Map as MapIcon,
    X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription
} from '@/components/ui/dialog';
import { useParking } from '@/contexts/ParkingContext';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DriverManagement() {
    const { drivers, setDrivers, parkingLots, addLog, valetAssignments, registerDriver } = useParking();
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);

    // File Input Refs
    const photoRef = useRef<HTMLInputElement>(null);
    const licenseRef = useRef<HTMLInputElement>(null);

    const [newDriver, setNewDriver] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        dob: '',
        licenseNumber: '',
        licenseExpiry: '',
        managedLocationId: '1',
        shiftHours: '09:00 - 18:00',
        photo: '',
        licensePhoto: ''
    });

    const [previews, setPreviews] = useState({
        photo: '',
        licensePhoto: ''
    });

    const filteredDrivers = drivers.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeMissions = valetAssignments.filter(a => a.status !== 'completed');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'licensePhoto') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setPreviews(prev => ({ ...prev, [type]: base64String }));
                setNewDriver(prev => ({ ...prev, [type]: base64String }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddDriver = (e: React.FormEvent) => {
        e.preventDefault();
        const driver = {
            ...newDriver,
            id: 'd' + (drivers.length + 1),
            performance: 5.0
        };
        registerDriver(driver as any);
        addLog({
            user: 'admin',
            action: `Registered new driver: ${driver.name}`,
            location: parkingLots.find(l => l.id === driver.managedLocationId)?.name,
            severity: 'low'
        });
        toast({ title: "Personnel Registered", description: `${driver.name} has been added to the fleet.` });
        setIsAddOpen(false);
        // Reset state
        setNewDriver({
            name: '',
            email: '',
            phone: '',
            address: '',
            dob: '',
            licenseNumber: '',
            licenseExpiry: '',
            managedLocationId: '1',
            shiftHours: '09:00 - 18:00',
            photo: '',
            licensePhoto: ''
        });
        setPreviews({ photo: '', licensePhoto: '' });
    };

    const handleSuspend = (id: string, name: string) => {
        toast({
            title: "Action Restricted",
            description: `Suspension protocol for ${name} initiated. System logs updated.`,
            variant: "destructive"
        });
        addLog({ user: 'admin', action: `Suspended driver: ${name}`, severity: 'medium' });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        DRIVER CONTROL CENTER
                    </h2>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mt-2 ml-1">Personnel Management & Bio-Metric Calibration</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Identify Personnel..."
                            className="bg-white border-border/50 pl-11 h-12 w-72 rounded-2xl shadow-sm focus:ring-primary/20 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-12 px-6 rounded-2xl font-black uppercase tracking-widest text-xs shadow-glow hover:scale-[1.02] active:scale-95 transition-all">
                                <UserPlus className="w-4 h-4 mr-2" />
                                Register Personnel
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl rounded-[40px] border-0 shadow-2xl p-0 overflow-hidden bg-background">
                            <div className="gradient-hero p-10 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                                <DialogTitle className="text-3xl font-black tracking-tighter relative z-10">REGISTER PERSONNEL</DialogTitle>
                                <DialogDescription className="text-white/70 text-sm font-bold uppercase tracking-widest mt-1 relative z-10">
                                    Initiating secure driver onboarding & validation
                                </DialogDescription>
                                <Briefcase className="absolute bottom-8 right-8 w-16 h-16 opacity-10" />
                            </div>

                            <form onSubmit={handleAddDriver}>
                                <Tabs defaultValue="bio" className="w-full">
                                    <div className="px-10 pt-6">
                                        <TabsList className="grid w-full grid-cols-3 h-12 rounded-2xl bg-gray-100/50 p-1">
                                            <TabsTrigger value="bio" className="rounded-xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                                1. Bio-Metric
                                            </TabsTrigger>
                                            <TabsTrigger value="personal" className="rounded-xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                                2. Personal
                                            </TabsTrigger>
                                            <TabsTrigger value="license" className="rounded-xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                                3. License & Fleet
                                            </TabsTrigger>
                                        </TabsList>
                                    </div>

                                    <ScrollArea className="h-[450px]">
                                        <div className="p-10">
                                            <TabsContent value="bio" className="mt-0 space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                {/* Driver Photo Section */}
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Camera className="w-4 h-4 text-primary" />
                                                        <h4 className="text-xs font-black uppercase tracking-widest text-primary">Driver Profile Image *</h4>
                                                    </div>
                                                    <div className="flex items-center gap-8">
                                                        <div
                                                            className="w-32 h-32 rounded-[32px] bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:border-primary/50 transition-all shadow-inner"
                                                            onClick={() => photoRef.current?.click()}
                                                        >
                                                            {previews.photo ? (
                                                                <img src={previews.photo} alt="Preview" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <>
                                                                    <Upload className="w-6 h-6 text-gray-300 group-hover:text-primary transition-colors" />
                                                                    <span className="text-[9px] font-black text-gray-400 mt-2 uppercase tracking-tighter">Choose File</span>
                                                                </>
                                                            )}
                                                            <input
                                                                type="file"
                                                                ref={photoRef}
                                                                className="hidden"
                                                                accept="image/*"
                                                                onChange={(e) => handleFileChange(e, 'photo')}
                                                            />
                                                        </div>
                                                        <div className="flex-1 space-y-2">
                                                            <h5 className="text-sm font-bold text-gray-900">Portrait Identity</h5>
                                                            <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                                                Upload a clear portrait from your computer for bio-metric verification and personnel records.
                                                            </p>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-8 rounded-lg text-[10px] font-black uppercase tracking-widest"
                                                                onClick={() => photoRef.current?.click()}
                                                            >
                                                                Access Finder
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TabsContent>

                                            <TabsContent value="personal" className="mt-0 space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                {/* Personal Details Section */}
                                                <div className="space-y-6">
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-4 h-4 text-primary" />
                                                        <h4 className="text-xs font-black uppercase tracking-widest text-primary">Personal Details</h4>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-6">
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name *</label>
                                                            <div className="relative">
                                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                                <Input
                                                                    required
                                                                    value={newDriver.name}
                                                                    onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                                                                    placeholder="Enter full name"
                                                                    className="h-12 pl-12 rounded-2xl bg-gray-50/50 border-gray-100 focus:ring-primary font-bold"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Phone Number *</label>
                                                            <div className="relative">
                                                                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                                <Input
                                                                    required
                                                                    type="tel"
                                                                    value={newDriver.phone}
                                                                    onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
                                                                    placeholder="+91 98765 43210"
                                                                    className="h-12 pl-12 rounded-2xl bg-gray-50/50 border-gray-100 focus:ring-primary font-bold"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-6">
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                                                            <div className="relative">
                                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                                <Input
                                                                    type="email"
                                                                    value={newDriver.email}
                                                                    onChange={(e) => setNewDriver({ ...newDriver, email: e.target.value })}
                                                                    placeholder="driver@example.com"
                                                                    className="h-12 pl-12 rounded-2xl bg-gray-50/50 border-gray-100 focus:ring-primary font-bold"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Date of Birth</label>
                                                            <div className="relative">
                                                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                                <Input
                                                                    type="date"
                                                                    value={newDriver.dob}
                                                                    onChange={(e) => setNewDriver({ ...newDriver, dob: e.target.value })}
                                                                    className="h-12 pl-12 rounded-2xl bg-gray-50/50 border-gray-100 focus:ring-primary font-bold"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Physical Address</label>
                                                        <div className="relative">
                                                            <MapPin className="absolute left-4 top-4 w-4 h-4 text-gray-400" />
                                                            <textarea
                                                                value={newDriver.address}
                                                                onChange={(e) => setNewDriver({ ...newDriver, address: e.target.value })}
                                                                placeholder="Enter full residential address"
                                                                className="w-full min-h-[100px] pl-12 pt-4 rounded-2xl bg-gray-50/50 border-gray-100 focus:ring-primary text-sm font-bold"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </TabsContent>

                                            <TabsContent value="license" className="mt-0 space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                {/* License Details Section */}
                                                <div className="space-y-6">
                                                    <div className="flex items-center gap-2">
                                                        <CreditCard className="w-4 h-4 text-primary" />
                                                        <h4 className="text-xs font-black uppercase tracking-widest text-primary">License Verification</h4>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-6">
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">License Number *</label>
                                                            <div className="relative">
                                                                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                                <Input
                                                                    required
                                                                    value={newDriver.licenseNumber}
                                                                    onChange={(e) => setNewDriver({ ...newDriver, licenseNumber: e.target.value.toUpperCase() })}
                                                                    placeholder="DL-1420110012345"
                                                                    className="h-12 pl-12 rounded-2xl bg-gray-50/50 border-gray-100 focus:ring-primary font-bold tracking-wider"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Expiry Date</label>
                                                            <div className="relative">
                                                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                                <Input
                                                                    type="date"
                                                                    value={newDriver.licenseExpiry}
                                                                    onChange={(e) => setNewDriver({ ...newDriver, licenseExpiry: e.target.value })}
                                                                    className="h-12 pl-12 rounded-2xl bg-gray-50/50 border-gray-100 focus:ring-primary font-bold"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">License Photo (Front/Back) *</label>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-6 px-2 text-[8px] font-black uppercase tracking-widest hover:bg-primary/5 hover:text-primary transition-colors"
                                                                onClick={() => licenseRef.current?.click()}
                                                            >
                                                                Access Finder
                                                            </Button>
                                                        </div>
                                                        <div
                                                            className="w-full h-40 rounded-[32px] bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:border-primary/50 transition-all shadow-inner"
                                                            onClick={() => licenseRef.current?.click()}
                                                        >
                                                            {previews.licensePhoto ? (
                                                                <img src={previews.licensePhoto} alt="License" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="flex flex-col items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                                                        <FileText className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
                                                                    </div>
                                                                    <div className="text-center">
                                                                        <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Identify License Documents</span>
                                                                        <span className="block text-[8px] font-bold text-gray-300 uppercase tracking-tighter mt-1">Tap to browse files</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            <input
                                                                type="file"
                                                                ref={licenseRef}
                                                                className="hidden"
                                                                accept="image/*"
                                                                onChange={(e) => handleFileChange(e, 'licensePhoto')}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent w-full" />

                                                {/* Deployment Config */}
                                                <div className="space-y-6">
                                                    <div className="flex items-center gap-2">
                                                        <Briefcase className="w-4 h-4 text-primary" />
                                                        <h4 className="text-xs font-black uppercase tracking-widest text-primary">Deployment Protocol</h4>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-6">
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Assigned Location</label>
                                                            <div className="relative">
                                                                <MapIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                                                <select
                                                                    className="w-full h-12 pl-12 rounded-2xl bg-gray-50/50 border-gray-100 focus:ring-primary text-sm font-bold appearance-none cursor-pointer"
                                                                    value={newDriver.managedLocationId}
                                                                    onChange={(e) => setNewDriver({ ...newDriver, managedLocationId: e.target.value })}
                                                                >
                                                                    {parkingLots.map(lot => (
                                                                        <option key={lot.id} value={lot.id}>{lot.name}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Shift Schedule</label>
                                                            <div className="relative">
                                                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                                                <select
                                                                    className="w-full h-12 pl-12 rounded-2xl bg-gray-50/50 border-gray-100 focus:ring-primary text-sm font-bold appearance-none cursor-pointer"
                                                                    value={newDriver.shiftHours}
                                                                    onChange={(e) => setNewDriver({ ...newDriver, shiftHours: e.target.value })}
                                                                >
                                                                    <option>09:00 - 18:00 (Standard)</option>
                                                                    <option>18:00 - 03:00 (Evening)</option>
                                                                    <option>03:00 - 12:00 (Early Bird)</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TabsContent>
                                        </div>
                                    </ScrollArea>
                                </Tabs>

                                <div className="p-10 bg-gray-50 border-t border-gray-100 flex gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-16 flex-1 rounded-2xl font-black uppercase tracking-widest text-xs"
                                        onClick={() => setIsAddOpen(false)}
                                    >
                                        Abort
                                    </Button>
                                    <Button type="submit" className="h-16 flex-[2] rounded-2xl font-black uppercase tracking-[0.3em] text-xs shadow-glow">
                                        Finalize Deployment
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </header>

            {/* Active Valet Missions Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-orange-600" />
                        </div>
                        <h3 className="text-xs font-black uppercase tracking-[0.2em]">Operational Missions</h3>
                    </div>
                    <Badge variant="outline" className="font-black border-orange-200 text-orange-600 bg-orange-50">{activeMissions.length} Active</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {activeMissions.length > 0 ? (
                        activeMissions.map((mission) => (
                            <Card key={mission.id} className="p-5 border border-border/50 bg-white hover:border-primary/30 transition-all hover:shadow-lg relative group overflow-hidden rounded-[32px]">
                                <div className="flex justify-between items-start mb-4">
                                    <Badge variant="outline" className={cn(
                                        "font-black uppercase text-[8px] px-2 py-1 rounded-lg",
                                        mission.status === 'pending' ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-blue-50 text-blue-600 border-blue-200"
                                    )}>
                                        {mission.status}
                                    </Badge>
                                    <span className="text-[8px] font-black text-muted-foreground uppercase opacity-40">{mission.type}</span>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                        <p className="text-sm font-black tracking-tight truncate">{mission.customer_name}</p>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground font-bold tracking-tight bg-gray-50 p-2 rounded-xl truncate">{mission.vehicle_details}</p>
                                    <div className="pt-3 border-t border-dashed border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-3 h-3 text-primary opacity-50" />
                                            <span className="text-[9px] font-black text-primary uppercase">{mission.driver_id ? drivers.find(d => d.id === mission.driver_id)?.name.split(' ')[0] : 'STANDBY'}</span>
                                        </div>
                                        <Badge variant="secondary" className="text-[8px] font-black bg-gray-900 text-white rounded-md">{mission.slot_name || 'PEND'}</Badge>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <Card className="col-span-full p-12 border-dashed border-2 border-border/20 flex flex-col items-center justify-center text-muted-foreground rounded-[40px] bg-gray-50/30">
                            <Clock className="w-10 h-10 mb-3 opacity-10" />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em]">No Live Assignments Detected</p>
                        </Card>
                    )}
                </div>
            </section>

            <div className="flex items-center gap-3 pt-4">
                <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em]">Personnel Registry</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                    {filteredDrivers.map((driver, index) => (
                        <motion.div
                            key={driver.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="p-0 border-0 hover:shadow-2xl transition-all group relative overflow-hidden bg-white rounded-[40px] border border-gray-100">
                                <div className="p-8">
                                    <div className="flex items-start justify-between mb-8">
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 rounded-[24px] bg-primary/5 flex items-center justify-center border border-primary/10 relative group-hover:scale-105 transition-transform overflow-hidden shadow-inner">
                                                {driver.photo ? (
                                                    <img src={driver.photo} alt={driver.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Users className="w-8 h-8 text-primary opacity-40" />
                                                )}
                                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-4 border-white flex items-center justify-center">
                                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-black text-xl tracking-tighter leading-none mb-2">{driver.name}</h3>
                                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60">ID://{driver.id.toUpperCase()}</p>
                                            </div>
                                        </div>
                                        <Badge className="bg-success/10 text-success border-success/20 font-black text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-lg">Active</Badge>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 rounded-3xl bg-gray-50/50 border border-gray-100 group-hover:bg-white transition-colors">
                                            <div className="flex items-center gap-3">
                                                <Clock className="w-4 h-4 text-primary opacity-40" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Duty Cycle</span>
                                            </div>
                                            <span className="text-xs font-black text-gray-900">{driver.shiftHours.split(' ')[0]}</span>
                                        </div>

                                        <div className="flex items-center justify-between p-4 rounded-3xl bg-gray-50/50 border border-gray-100 group-hover:bg-white transition-colors">
                                            <div className="flex items-center gap-3">
                                                <Star className="w-4 h-4 text-amber-500 opacity-40" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Score</span>
                                            </div>
                                            <span className="text-xs font-black text-gray-900">{driver.performance.toFixed(1)} <span className="text-[10px] text-gray-300">/ 5.0</span></span>
                                        </div>

                                        <div className="flex items-center justify-between p-4 rounded-3xl bg-gray-50/50 border border-gray-100 group-hover:bg-white transition-colors">
                                            <div className="flex items-center gap-3">
                                                <MapIcon className="w-4 h-4 text-success opacity-40" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Zone</span>
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-tighter text-gray-900">
                                                {parkingLots.find(l => l.id === driver.managedLocationId)?.name || 'Central'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex gap-3">
                                        <Button
                                            variant="outline"
                                            className="flex-1 h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest border-gray-100 hover:bg-gray-50 hover:text-destructive group-hover:border-destructive/20 transition-all"
                                            onClick={() => handleSuspend(driver.id, driver.name)}
                                        >
                                            <ShieldAlert className="w-3.5 h-3.5 mr-2 opacity-50" />
                                            Terminate
                                        </Button>
                                        <Button className="h-12 w-12 p-0 rounded-2xl hover:shadow-xl transition-all">
                                            <ChevronRight className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="h-12" />
        </div>
    );
}
