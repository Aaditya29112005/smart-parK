import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    ArrowLeft,
    Edit2,
    Trash2,
    Plus,
    MapPin,
    Zap,
    Shield,
    MoreVertical,
    Search,
    X,
    Check,
    Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useParking } from '@/contexts/ParkingContext';
import { ParkingLot } from '@/types/parking';
import { cn } from '@/lib/utils';

export default function ManageSpots() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { parkingLots, addParkingLot, updateParkingLot, deleteParkingLot } = useParking();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Form state for adding/editing
    const [editingLot, setEditingLot] = useState<ParkingLot | null>(null);
    const [formName, setFormName] = useState('');
    const [formCapacity, setFormCapacity] = useState('');
    const [formPrice, setFormPrice] = useState('');

    const filteredLots = parkingLots.filter(l =>
        l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const lotData: ParkingLot = {
            id: editingLot?.id || `lot_${Date.now()}`,
            name: formName,
            capacity: parseInt(formCapacity),
            price: parseInt(formPrice),
            status: editingLot?.status || 'Active',
            address: editingLot?.address || 'Street Avenue, Pune',
            location: editingLot?.location || { lat: 18.5204, lng: 73.8567 }
        };

        if (editingLot) {
            updateParkingLot(lotData);
            toast({ title: "Zone Updated", description: `${formName} has been modified successfully.` });
        } else {
            addParkingLot(lotData);
            toast({ title: "New Zone Added", description: `${formName} is now live in the system.` });
        }
        resetForm();
    };

    const resetForm = () => {
        setIsAddModalOpen(false);
        setEditingLot(null);
        setFormName('');
        setFormCapacity('');
        setFormPrice('');
    };

    const handleEdit = (lot: ParkingLot) => {
        setEditingLot(lot);
        setFormName(lot.name);
        setFormCapacity(lot.capacity.toString());
        setFormPrice(lot.price.toString());
        setIsAddModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row">
            {/* Sidebar - Consistent with Dashboard */}
            <aside className="w-full md:w-72 bg-card border-r border-border flex flex-col z-50">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center shadow-glow-sm">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black tracking-tighter leading-none">COMMAND</h1>
                            <span className="text-[10px] text-primary font-bold uppercase tracking-widest leading-none">v4.0 Enterprise</span>
                        </div>
                    </div>
                    <nav className="space-y-1">
                        <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-muted-foreground transition-all group" onClick={() => navigate('/admin')}>
                            <LayoutDashboard className="w-5 h-5 group-hover:text-primary transition-colors" />
                            <span className="font-bold text-sm tracking-tight">Dashboard</span>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start gap-3 h-12 bg-primary/10 text-primary border-r-4 border-primary rounded-none">
                            <MapPin className="w-5 h-5" />
                            <span className="font-bold text-sm tracking-tight">Smart Zones</span>
                        </Button>
                    </nav>
                </div>
            </aside>

            <main className="flex-1 p-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h2 className="text-3xl font-black tracking-tighter text-foreground mb-2">SMART ZONES</h2>
                        <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            <span>TOTAL: {parkingLots.length} NODES</span>
                            <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-primary" /> SYSTEM HEALTH: OPTIMAL</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative w-full sm:w-64 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Filter zones..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-12 rounded-xl bg-white border-border shadow-sm focus:ring-primary/20"
                            />
                        </div>
                        <Button onClick={() => setIsAddModalOpen(true)} className="w-full sm:w-auto h-12 px-8 rounded-xl gradient-primary text-white font-black uppercase tracking-widest shadow-glow-sm">
                            <Plus className="w-5 h-5 mr-2" />
                            Deploy Zone
                        </Button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredLots.map((lot, index) => (
                            <motion.div
                                key={lot.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="p-6 border-border hover:border-primary/50 transition-all hover:shadow-card group relative overflow-hidden bg-white">
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className={cn(
                                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                lot.status === 'Active' ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                                            )}>
                                                {lot.status}
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-primary/10 text-primary" onClick={() => handleEdit(lot)}>
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-destructive/10 text-destructive" onClick={() => deleteParkingLot(lot.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-black tracking-tight mb-2 group-hover:text-primary transition-colors">{lot.name}</h3>
                                        <div className="flex items-center gap-2 text-muted-foreground mb-6">
                                            <MapPin className="w-3 h-3" />
                                            <span className="text-xs font-medium truncate">{lot.address}</span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-3 bg-muted/30 rounded-xl">
                                                <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">CAPACITY</p>
                                                <p className="font-black text-lg">{lot.capacity} <span className="text-xs font-bold text-muted-foreground">SLOTS</span></p>
                                            </div>
                                            <div className="p-3 bg-muted/30 rounded-xl">
                                                <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">REVENUE RATE</p>
                                                <p className="font-black text-lg">₹{lot.price}<span className="text-xs font-bold text-muted-foreground">/HR</span></p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Grid Pattern Decoration */}
                                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(#00000003_1.5px,transparent_1.5px)] bg-[size:15px_15px] opacity-100 -z-0 pointer-events-none" />
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </main>

            {/* Deploy Zone Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={resetForm}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-card border border-border rounded-3xl p-8 shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-black tracking-tighter">
                                    {editingLot ? 'MODIFY NODE' : 'DEPLOY NEW NODE'}
                                </h3>
                                <Button size="icon" variant="ghost" onClick={resetForm}><X className="w-5 h-5" /></Button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Zone Designation</label>
                                    <Input
                                        required
                                        value={formName}
                                        onChange={(e) => setFormName(e.target.value)}
                                        placeholder="e.g. Amanora Infinity"
                                        className="h-14 rounded-2xl bg-muted/30 border-border font-bold text-lg px-6"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Slot Capacity</label>
                                        <Input
                                            required
                                            type="number"
                                            value={formCapacity}
                                            onChange={(e) => setFormCapacity(e.target.value)}
                                            placeholder="150"
                                            className="h-14 rounded-2xl bg-muted/30 border-border font-bold text-lg px-6"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Revenue/Hr (₹)</label>
                                        <Input
                                            required
                                            type="number"
                                            value={formPrice}
                                            onChange={(e) => setFormPrice(e.target.value)}
                                            placeholder="40"
                                            className="h-14 rounded-2xl bg-muted/30 border-border font-bold text-lg px-6"
                                        />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full h-16 rounded-2xl gradient-primary text-white font-black uppercase tracking-widest text-lg shadow-glow mt-4">
                                    <Check className="w-6 h-6 mr-2" />
                                    {editingLot ? 'Confirm Update' : 'Initialize Node'}
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
