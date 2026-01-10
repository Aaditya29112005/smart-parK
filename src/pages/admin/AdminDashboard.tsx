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
    Ticket,
    XCircle,
    CheckCircle2,
    Calendar,
    HandCoins,
    Filter,
    Edit2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { LiveMonitor } from '@/components/admin/LiveMonitor';
import { useParking } from '@/contexts/ParkingContext';
import DriverManagement from './DriverManagement';
import { Badge } from '@/components/ui/badge';

const REVENUE_DATA = [
    { name: '08:00', revenue: 4500 },
    { name: '10:00', revenue: 12000 },
    { name: '12:00', revenue: 18000 },
    { name: '14:00', revenue: 16500 },
    { name: '16:00', revenue: 22000 },
    { name: '18:00', revenue: 28000 },
    { name: '20:00', revenue: 15000 },
];

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { parkingLots, history, activeSession, setHistory, user, addLog } = useParking();
    const [activeTab, setActiveTab] = useState('overview');

    // For Demo: Assume Admin manages Phoenix Market City (ID: 1)
    const managedLotId = user?.managedLocationId || '1';
    const currentLot = parkingLots.find(l => l.id === managedLotId) || parkingLots[0];

    const lotHistory = useMemo(() =>
        history.filter(s => s.slot?.id?.startsWith('a') || s.slot?.id?.startsWith('b')), // Mock filter
        [history]);

    const totalRevenue = lotHistory.reduce((acc, curr) => acc + (curr.amount || 0), 0) + 42000;

    const ADMIN_STATS = [
        { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: DollarSign, trend: '+12.5%', color: 'text-primary' },
        { label: 'Active Sessions', value: activeSession ? '1' : '18', icon: Activity, trend: '+5.2%', color: 'text-success' },
        { label: 'Occupancy', value: '84%', icon: MapPin, trend: 'High', color: 'text-amber-500' },
        { label: 'System Health', value: '99.9%', icon: Shield, trend: 'Secure', color: 'text-primary' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('is_admin');
        localStorage.removeItem('is_super_admin');
        addLog({ user: 'admin', action: 'Admin Logout', severity: 'low' });
        toast({ title: "Admin Logout", description: "Securely signed out of Command Center" });
        navigate('/admin/login');
    };

    const handleCancelTicket = (id: string) => {
        const ticket = history.find(h => h.id === id);
        if (ticket) {
            setHistory(history.filter(h => h.id !== id));
            addLog({
                user: 'admin',
                action: `Cancelled Ticket #${id.slice(-4)}`,
                location: currentLot.name,
                severity: 'medium'
            });
            toast({ title: "Ticket Cancelled", description: "The session has been voided and logged." });
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row">
            {/* Nav Sidebar */}
            <aside className="w-full md:w-72 bg-card border-r border-border flex flex-col z-50">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center shadow-glow-sm">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black tracking-tighter leading-none">COMMAND</h1>
                            <span className="text-[10px] text-primary font-bold uppercase tracking-widest leading-none">Node Manager v4.2</span>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        {[
                            { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
                            { id: 'monitoring', label: 'Live Monitor', icon: Activity },
                            { id: 'tickets', label: 'Ticket Hub', icon: Ticket },
                            { id: 'personnel', label: 'Personnel', icon: Users },
                            { id: 'finance', label: 'Financials', icon: HandCoins },
                        ].map((item) => (
                            <Button
                                key={item.id}
                                variant="ghost"
                                onClick={() => setActiveTab(item.id)}
                                className={cn(
                                    "w-full justify-start gap-3 h-12 transition-all group",
                                    activeTab === item.id
                                        ? "bg-primary/10 text-primary border-r-4 border-primary rounded-none"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-primary" : "group-hover:text-primary transition-colors")} />
                                <span className="font-bold text-sm tracking-tight">{item.label}</span>
                            </Button>
                        ))}
                    </nav>
                </div>

                <div className="mt-auto p-4 border-t border-border bg-muted/30">
                    <div className="flex items-center gap-3 mb-4 p-2 bg-background rounded-lg border border-border">
                        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white font-black text-xs">
                            AD
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-black truncate">Main Admin</p>
                            <p className="text-[10px] text-muted-foreground truncate uppercase">{currentLot.name}</p>
                        </div>
                        <Settings className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <Button
                        variant="destructive"
                        size="sm"
                        className="w-full h-10 font-black uppercase tracking-widest text-[10px]"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-3 h-3 mr-2" />
                        Terminate Link
                    </Button>
                </div>
            </aside>

            {/* Main Content Hub */}
            <main className="flex-1 overflow-y-auto">
                {/* Header HUD */}
                <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-border px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <h2 className="text-xl font-black capitalize tracking-tight text-foreground">
                            {activeTab} <span className="text-primary italic">Console</span>
                        </h2>
                        <div className="hidden lg:flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-xl border border-border">
                            <Search className="w-4 h-4 text-muted-foreground" />
                            <input
                                className="bg-transparent border-0 text-sm focus:ring-0 w-64 placeholder:text-muted-foreground font-medium"
                                placeholder={`Search ${activeTab}...`}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-muted-foreground">
                            <span className="flex w-2 h-2 rounded-full bg-success animate-pulse" />
                            Local Node: Online
                        </div>
                        <Button variant="outline" size="icon" className="rounded-full relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full border-2 border-white" />
                        </Button>
                    </div>
                </header>

                <div className="p-8 max-w-[1600px] mx-auto space-y-8">
                    {activeTab === 'overview' && (
                        <div className="space-y-8">
                            {/* Hero Welcome */}
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-8 rounded-3xl gradient-hero text-white shadow-glow relative overflow-hidden"
                            >
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
                                        <span className="text-xs font-black tracking-[0.3em] uppercase opacity-80">Local Yield Active</span>
                                    </div>
                                    <h1 className="text-3xl font-black tracking-tighter mb-2">Welcome Back, Manager.</h1>
                                    <p className="text-white/70 max-w-lg text-sm font-medium">
                                        Occupancy at <span className="font-black text-white">{currentLot.name}</span> is peak at <span className="text-white font-black underline">84%</span>. Suggested price correction: <span className="text-white font-black underline">+₹10</span>.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <Button variant="glass" className="bg-white/20 hover:bg-white/30 text-white border-white/20 h-14 px-8 rounded-2xl group">
                                        Correct Pricing <ArrowUpRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </motion.div>

                            {/* Stats HUD Nodes */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {ADMIN_STATS.map((stat, index) => (
                                    <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }}>
                                        <Card className="p-6 border-border hover:border-primary/50 transition-all hover:shadow-card group relative overflow-hidden bg-white">
                                            <div className="flex flex-col gap-4">
                                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center bg-muted group-hover:gradient-primary group-hover:text-white transition-all duration-500", stat.color)}>
                                                    <stat.icon className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
                                                    <div className="flex items-baseline gap-2">
                                                        <h3 className="text-2xl font-black tracking-tighter">{stat.value}</h3>
                                                        <span className="text-xs font-bold text-success flex items-center gap-1 bg-success/10 px-2 py-0.5 rounded-full">
                                                            <TrendingUp className="w-3 h-3" /> {stat.trend}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                                <Card className="xl:col-span-2 p-8 border-border bg-white">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-xl font-black tracking-tight flex items-center gap-2 uppercase">
                                            <BrainCircuit className="w-6 h-6 text-primary" />
                                            Daily Revenue Velocity
                                        </h3>
                                    </div>
                                    <div className="h-[350px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={REVENUE_DATA}>
                                                <defs>
                                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                                <XAxis dataKey="name" fontSize={11} fontWeight="800" tickLine={false} axisLine={false} dy={10} />
                                                <YAxis fontSize={11} fontWeight="800" tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                                                <Tooltip />
                                                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Card>
                                <div className="space-y-8">
                                    <Card className="p-8 border-border bg-white shadow-sm overflow-hidden relative">
                                        <h3 className="text-xl font-black tracking-tight mb-6 uppercase">Admin Shortcuts</h3>
                                        <div className="space-y-3 relative z-10">
                                            <Button variant="outline" className="w-full justify-between h-14 rounded-xl border-2 hover:bg-primary/5 hover:border-primary/30 group">
                                                <div className="flex items-center gap-3">
                                                    <Shield className="w-5 h-5 text-primary" />
                                                    <span className="font-black text-xs uppercase tracking-widest text-muted-foreground group-hover:text-primary">System Logs</span>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                            </Button>
                                            <Button variant="outline" className="w-full justify-between h-14 rounded-xl border-2 hover:bg-primary/5 hover:border-primary/30 group" onClick={() => navigate('/admin/spots')}>
                                                <div className="flex items-center gap-3">
                                                    <MapPin className="w-5 h-5 text-primary" />
                                                    <span className="font-black text-xs uppercase tracking-widest text-muted-foreground group-hover:text-primary">Adjust Slots</span>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                            </Button>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'monitoring' && <LiveMonitor />}

                    {activeTab === 'tickets' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <header className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-black tracking-tight uppercase">Ticket Control Hub</h3>
                                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Global ticket correction & dispute resolution</p>
                                </div>
                                <Button className="h-10 rounded-xl font-black uppercase text-[10px] tracking-widest">Export Tickets <Filter className="w-3 h-3 ml-2" /></Button>
                            </header>

                            <div className="grid grid-cols-1 gap-4">
                                {lotHistory.slice().reverse().map((ticket) => (
                                    <Card key={ticket.id} className="p-4 border-border hover:border-primary/30 transition-all flex flex-col md:flex-row items-center justify-between gap-4 group bg-white">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
                                                <Ticket className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-black text-sm uppercase">#{ticket.id.slice(-6).toUpperCase()}</span>
                                                    <Badge variant="secondary" className="text-[10px] font-black uppercase bg-success/10 text-success border-0">Paid</Badge>
                                                </div>
                                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                                    {ticket.vehicle?.number} • {ticket.slot?.name}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-10">
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-muted-foreground uppercase">Amount</p>
                                                <p className="font-black text-primary">₹{ticket.amount?.toFixed(2)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-muted-foreground uppercase">Start Time</p>
                                                <p className="text-xs font-bold">{new Date(ticket.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="icon" variant="outline" className="rounded-xl border-2 hover:border-destructive hover:text-destructive" onClick={() => handleCancelTicket(ticket.id)}>
                                                    <XCircle className="w-4 h-4" />
                                                </Button>
                                                <Button size="icon" variant="outline" className="rounded-xl border-2 hover:border-success hover:text-success">
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'personnel' && <DriverManagement />}

                    {activeTab === 'finance' && (
                        <div className="space-y-8 bg-white p-8 rounded-3xl border border-border">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-black tracking-tight uppercase">Live Yield Control</h3>
                                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-1">Real-time revenue monitoring per node</p>
                                </div>
                                <div className="p-3 bg-primary/5 border border-primary/20 rounded-2xl flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-gray-400 uppercase">Today's Revenue</p>
                                        <p className="text-xl font-black text-primary">₹{totalRevenue.toLocaleString()}</p>
                                    </div>
                                    <TrendingUp className="w-6 h-6 text-success" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card className="p-6 border-2 bg-slate-900 text-white space-y-4 shadow-2xl overflow-hidden relative group">
                                    <div className="flex items-center gap-2 mb-2">
                                        <ArrowUpRight className="w-4 h-4 text-success" />
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Revenue Target</span>
                                    </div>
                                    <h4 className="text-4xl font-black tracking-tighter">84%</h4>
                                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: '84%' }} className="h-full bg-success" />
                                    </div>
                                    <p className="text-[10px] font-bold opacity-60">₹1,42,000 / ₹1,70,000 goal</p>
                                    <DollarSign className="absolute -bottom-10 -right-10 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform" />
                                </Card>

                                <Card className="p-6 border-border bg-white flex flex-col justify-between">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Unpaid Disputes</h4>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-black text-destructive">04</span>
                                        <span className="text-[10px] font-bold text-muted-foreground">tickets flagged</span>
                                    </div>
                                    <Button variant="link" className="text-primary font-black uppercase text-[10px] tracking-widest p-0 h-auto justify-start mt-4">Resolve Now <ChevronRight className="w-3 h-3 ml-1" /></Button>
                                </Card>

                                <Card className="p-6 border-border bg-white flex flex-col justify-between">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Refund Requests</h4>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-black text-amber-500">01</span>
                                        <span className="text-[10px] font-bold text-muted-foreground">Awaiting approval</span>
                                    </div>
                                    <Button variant="link" className="text-primary font-black uppercase text-[10px] tracking-widest p-0 h-auto justify-start mt-4">Open Ledger <ChevronRight className="w-3 h-3 ml-1" /></Button>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
