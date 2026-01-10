import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    MapPin,
    DollarSign,
    Users,
    LogOut,
    TrendingUp,
    Shield,
    Zap,
    BarChart3,
    Activity,
    Bell,
    Settings,
    Search,
    BrainCircuit,
    ChevronRight,
    ArrowUpRight,
    Building2,
    Lock,
    Globe,
    Plus,
    Filter,
    X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useParking } from '@/contexts/ParkingContext';
import { MobileLayout } from '@/components/layout/MobileLayout';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';

const REVENUE_DATA = [
    { name: 'Mon', revenue: 125000, forecast: 130000 },
    { name: 'Tue', revenue: 118000, forecast: 125000 },
    { name: 'Wed', revenue: 142000, forecast: 140000 },
    { name: 'Thu', revenue: 135000, forecast: 138000 },
    { name: 'Fri', revenue: 185000, forecast: 180000 },
    { name: 'Sat', revenue: 210000, forecast: 205000 },
    { name: 'Sun', revenue: 195000, forecast: 190000 },
];

export default function SuperAdminDashboard() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { parkingLots, history, drivers, systemLogs, addParkingLot } = useParking();
    const [activeTab, setActiveTab] = useState('network');
    const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);
    const [newLocation, setNewLocation] = useState({
        name: '',
        address: '',
        capacity: '',
        price: '',
        lat: '',
        lng: ''
    });

    const handleAddLocation = (e: React.FormEvent) => {
        e.preventDefault();

        const lotData = {
            id: `lot-${Math.random().toString(36).substr(2, 9)}`,
            name: newLocation.name,
            address: newLocation.address,
            capacity: parseInt(newLocation.capacity),
            price: parseFloat(newLocation.price),
            status: 'Active' as const,
            location: {
                lat: parseFloat(newLocation.lat) || 18.5204,
                lng: parseFloat(newLocation.lng) || 73.8567
            }
        };

        addParkingLot(lotData);
        setIsAddLocationOpen(false);
        setNewLocation({ name: '', address: '', capacity: '', price: '', lat: '', lng: '' });

        toast({
            title: "Node Successfully Deployed! 🚀",
            description: `${lotData.name} is now live in the global network.`,
        });
    };

    // Stats Calculations
    const totalGlobalRevenue = useMemo(() =>
        history.reduce((acc, curr) => acc + (curr.amount || 0), 0) + 4250000,
        [history]);

    const activeLotsCount = parkingLots.filter(l => l.status === 'Active').length;
    const maintenanceLotsCount = parkingLots.filter(l => l.status === 'Maintenance').length;

    const STATS = [
        { label: 'Network Revenue', value: `₹${totalGlobalRevenue.toLocaleString()}`, icon: Globe, trend: '+15.2%', color: 'text-primary' },
        { label: 'Active Zones', value: `${activeLotsCount}/${parkingLots.length}`, icon: Building2, trend: 'Optimal', color: 'text-success' },
        { label: 'Total Staff', value: drivers.length.toString(), icon: Users, trend: 'Active', color: 'text-amber-500' },
        { label: 'System Health', value: '99.9%', icon: Shield, trend: 'Secure', color: 'text-primary' },
    ];

    const handleLogout = () => {
        toast({ title: "Super Admin Logout", description: "Global Command Link terminated" });
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen bg-[#f1f5f9] flex flex-col md:flex-row">
            {/* Nav Sidebar - Super Admin Dark Mode HUD */}
            <aside className="w-full md:w-80 bg-gray-900 text-white flex flex-col z-50">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tighter leading-none">SUPER DOMAIN</h1>
                            <span className="text-[10px] text-primary font-black uppercase tracking-widest leading-none">Global Authority</span>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        {[
                            { id: 'network', label: 'Network Hub', icon: Globe },
                            { id: 'analytics', label: 'Global Analytics', icon: BarChart3 },
                            { id: 'admins', label: 'Admin Management', icon: Users },
                            { id: 'billing', label: 'Revenue & Flow', icon: DollarSign },
                            { id: 'security', label: 'Security Audit', icon: Lock },
                        ].map((item) => (
                            <Button
                                key={item.id}
                                variant="ghost"
                                onClick={() => setActiveTab(item.id)}
                                className={cn(
                                    "w-full justify-start gap-4 h-14 transition-all group rounded-xl",
                                    activeTab === item.id
                                        ? "bg-primary text-white shadow-glow"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-white" : "group-hover:text-primary transition-colors")} />
                                <span className="font-extrabold text-sm tracking-tight">{item.label}</span>
                            </Button>
                        ))}
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-white/10 bg-black/20">
                    <div className="flex items-center gap-3 mb-6 p-3 bg-white/5 rounded-2xl border border-white/10">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black">
                            SA
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-black truncate">Super Admin</p>
                            <p className="text-[10px] text-primary font-black uppercase tracking-widest truncate">Root Access</p>
                        </div>
                    </div>
                    <Button
                        variant="destructive"
                        className="w-full h-12 font-black uppercase tracking-widest text-xs rounded-xl"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Emergency Exit
                    </Button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto">
                {/* Header Sub-HUD */}
                <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 h-24 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">
                                {activeTab} <span className="text-primary underline decoration-4 underline-offset-8">Panel</span>
                            </h2>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Status: Operational Connection Established</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden lg:flex flex-col items-end">
                            <p className="text-[10px] font-black uppercase text-gray-400">Live Traffic Control</p>
                            <div className="flex items-center gap-2">
                                <span className="flex w-3 h-3 rounded-full bg-success animate-pulse shadow-[0_0_10px_rgba(var(--success-rgb),0.5)]" />
                                <span className="text-sm font-black text-gray-900">1,402 Active Nodes</span>
                            </div>
                        </div>
                        <div className="h-10 w-px bg-gray-200" />
                        <Button variant="outline" size="icon" className="rounded-2xl border-2 hover:bg-gray-50">
                            <Bell className="w-6 h-6 text-gray-900" />
                        </Button>
                    </div>
                </header>

                <div className="p-8 space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {STATS.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="p-6 border-gray-200 hover:border-primary/40 transition-all hover:shadow-xl group relative overflow-hidden bg-white">
                                    <div className="flex flex-col gap-4">
                                        <div className={cn(
                                            "w-14 h-14 rounded-2xl flex items-center justify-center bg-gray-50 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm",
                                            stat.color
                                        )}>
                                            <stat.icon className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                            <div className="flex items-baseline gap-2">
                                                <h3 className="text-2xl font-black text-gray-900 tracking-tighter">{stat.value}</h3>
                                                <span className="text-[10px] font-black text-success flex items-center gap-1 bg-success/10 px-2 py-1 rounded-full border border-success/20">
                                                    <TrendingUp className="w-3 h-3" /> {stat.trend}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Abstract Grid BG */}
                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* Global Network Map / Chart */}
                        <div className="xl:col-span-2 space-y-8">
                            <Card className="p-8 border-gray-200 bg-white">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
                                            <BrainCircuit className="w-6 h-6 text-primary" />
                                            NETWORK REVENUE FLOW (7D)
                                        </h3>
                                        <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mt-1">System-wide performance monitoring</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <Button variant="outline" size="sm" className="rounded-xl font-bold">Export PDF</Button>
                                        <Button size="sm" className="rounded-xl font-bold">Filters <Filter className="w-4 h-4 ml-1" /></Button>
                                    </div>
                                </div>
                                <div className="h-[400px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={REVENUE_DATA}>
                                            <defs>
                                                <linearGradient id="superRev" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                            <XAxis dataKey="name" fontSize={11} fontWeight="800" tickLine={false} axisLine={false} dy={10} />
                                            <YAxis fontSize={11} fontWeight="800" tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: 'white',
                                                    borderRadius: '16px',
                                                    border: '1px solid #e5e7eb',
                                                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)'
                                                }}
                                            />
                                            <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={5} fillOpacity={1} fill="url(#superRev)" />
                                            <Area type="monotone" dataKey="forecast" stroke="#94a3b8" strokeWidth={2} strokeDasharray="10 10" fill="transparent" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>

                            {/* Location Management Hub */}
                            <Card className="p-8 border-gray-200 bg-white">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl font-black tracking-tight flex items-center gap-2 uppercase">
                                        <Building2 className="w-6 h-6 text-primary" />
                                        Location Nodes Management
                                    </h3>
                                    <Button
                                        onClick={() => setIsAddLocationOpen(true)}
                                        className="rounded-xl font-black uppercase tracking-widest text-xs h-12 shadow-glow"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        New Location Node
                                    </Button>
                                </div>
                                <div className="space-y-4">
                                    {parkingLots.map((lot) => (
                                        <div key={lot.id} className="group p-5 rounded-2xl border border-gray-100 hover:border-primary/20 hover:bg-gray-50 transition-all flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "w-12 h-12 rounded-xl flex items-center justify-center",
                                                    lot.status === 'Active' ? "bg-success/10 text-success" : "bg-amber-100 text-amber-600"
                                                )}>
                                                    <MapPin className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-gray-900">{lot.name}</h4>
                                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{lot.address}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-10">
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase">Rate</p>
                                                    <p className="text-sm font-black text-gray-900">₹{lot.price}/hr</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase">Capacity</p>
                                                    <p className="text-sm font-black text-gray-900">{lot.capacity} Bays</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase">Status</p>
                                                    <span className={cn(
                                                        "text-[10px] font-black uppercase px-2 py-1 rounded-md",
                                                        lot.status === 'Active' ? "bg-success/10 text-success" : "bg-amber-100 text-amber-600"
                                                    )}>
                                                        {lot.status}
                                                    </span>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>

                        {/* Security Audit & Drivers Intelligence */}
                        <div className="space-y-8">
                            <Card className="p-8 border-gray-200 bg-white h-full flex flex-col shadow-sm">
                                <h3 className="text-xl font-black tracking-tight mb-8 uppercase flex items-center gap-2">
                                    <Lock className="w-6 h-6 text-primary" />
                                    Security Audit Feed
                                </h3>

                                <div className="space-y-6 flex-1">
                                    {systemLogs.length > 0 ? systemLogs.map((log, i) => (
                                        <div key={log.id} className="flex gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 group">
                                            <div className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                                                log.severity === 'high' ? "bg-red-100 text-red-600" : "bg-primary/10 text-primary"
                                            )}>
                                                <Activity className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="text-xs font-black text-gray-900 uppercase tracking-tight truncate">{log.action}</h4>
                                                    <span className="text-[9px] font-bold text-gray-400 whitespace-nowrap ml-2">Just Now</span>
                                                </div>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest truncate">Auth: {log.user}</p>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center py-10">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-gray-200">
                                                <Shield className="w-8 h-8 text-gray-200" />
                                            </div>
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No Security Breaches Detected</p>
                                        </div>
                                    )}
                                </div>

                                <Button variant="outline" className="w-full mt-8 h-12 rounded-xl font-black uppercase text-[10px] tracking-widest border-2 hover:bg-gray-50 transition-all">
                                    Full Audit Report
                                </Button>
                            </Card>

                            <Card className="p-8 border-gray-200 bg-white shadow-sm overflow-hidden relative">
                                <div className="relative z-10">
                                    <h3 className="text-xl font-black tracking-tight mb-1 uppercase">AI Optimization</h3>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Yield Management Suggestions</p>

                                    <div className="p-4 bg-gray-900 rounded-2xl text-white space-y-4 shadow-2xl">
                                        <div className="flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-amber-400" />
                                            <span className="text-xs font-black uppercase tracking-widest">Pricing Alert</span>
                                        </div>
                                        <p className="text-sm font-medium leading-relaxed opacity-80 italic">
                                            "Network activity in <span className="text-primary font-black">Viman Nagar</span> suggests a 15% price hike for next 2 hours."
                                        </p>
                                        <Button className="w-full bg-white text-black hover:bg-primary hover:text-white transition-colors h-10 font-black uppercase text-[10px] tracking-widest">
                                            Apply Optimization
                                        </Button>
                                    </div>
                                </div>
                                <Activity className="absolute -bottom-10 -right-10 w-48 h-48 text-gray-100 -rotate-12" />
                            </Card>
                        </div>
                    </div>
                </div>
            </main>

            <Dialog open={isAddLocationOpen} onOpenChange={setIsAddLocationOpen}>
                <DialogContent className="max-w-md p-0 border-none bg-transparent overflow-hidden sm:rounded-[32px]">
                    <div className="bg-white p-8 space-y-8">
                        <DialogHeader>
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                    <Building2 className="w-7 h-7 text-primary" />
                                </div>
                                <div>
                                    <DialogTitle className="text-2xl font-black tracking-tight uppercase">Deploy New Node</DialogTitle>
                                    <DialogDescription className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Global Network Expansion HUD</DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <form onSubmit={handleAddLocation} className="space-y-5">
                            <div className="grid grid-cols-1 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Location Name</Label>
                                    <Input
                                        placeholder="e.g. Amanora Town Centre"
                                        value={newLocation.name}
                                        onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                                        className="h-12 bg-gray-50 border-gray-100 rounded-xl font-bold focus:border-primary/50"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Deployment Address</Label>
                                    <Input
                                        placeholder="e.g. Hadapsar, Pune"
                                        value={newLocation.address}
                                        onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
                                        className="h-12 bg-gray-50 border-gray-100 rounded-xl font-bold focus:border-primary/50"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Capacity (Bays)</Label>
                                        <Input
                                            type="number"
                                            placeholder="150"
                                            value={newLocation.capacity}
                                            onChange={(e) => setNewLocation({ ...newLocation, capacity: e.target.value })}
                                            className="h-12 bg-gray-50 border-gray-100 rounded-xl font-bold focus:border-primary/50"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Price/Hr (₹)</Label>
                                        <Input
                                            type="number"
                                            placeholder="45"
                                            value={newLocation.price}
                                            onChange={(e) => setNewLocation({ ...newLocation, price: e.target.value })}
                                            className="h-12 bg-gray-50 border-gray-100 rounded-xl font-bold focus:border-primary/50"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Latitude</Label>
                                        <Input
                                            type="number"
                                            step="0.000001"
                                            placeholder="18.5204"
                                            value={newLocation.lat}
                                            onChange={(e) => setNewLocation({ ...newLocation, lat: e.target.value })}
                                            className="h-12 bg-gray-50 border-gray-100 rounded-xl font-bold focus:border-primary/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Longitude</Label>
                                        <Input
                                            type="number"
                                            step="0.000001"
                                            placeholder="73.8567"
                                            value={newLocation.lng}
                                            onChange={(e) => setNewLocation({ ...newLocation, lng: e.target.value })}
                                            className="h-12 bg-gray-50 border-gray-100 rounded-xl font-bold focus:border-primary/50"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsAddLocationOpen(false)}
                                    className="flex-1 h-14 rounded-2xl border-2 font-black uppercase tracking-widest text-xs"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 h-14 rounded-2xl bg-primary text-white shadow-glow font-black uppercase tracking-widest text-xs"
                                >
                                    Initiate Node
                                </Button>
                            </div>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
