import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Car,
    MapPin,
    Clock,
    CheckCircle2,
    ChevronRight,
    Navigation,
    Bell,
    User,
    Star,
    LogOut,
    Trophy,
    Activity,
    ArrowRightLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useParking } from "@/contexts/ParkingContext";

export default function DriverDashboard() {
    const { valetAssignments, updateValetStatus, user, setUser } = useParking();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'assignments' | 'history'>('assignments');

    const pendingJob = valetAssignments.find(a => a.status === 'pending');
    const myCurrentJob = valetAssignments.find(a => a.driver_id === 'd1' && ['accepted', 'in-progress'].includes(a.status));
    const completedJobs = valetAssignments.filter(a => a.driver_id === 'd1' && a.status === 'completed');

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-24 font-sans text-slate-900">
            {/* Dynamic Header */}
            <div className="bg-primary pt-14 pb-10 px-6 rounded-b-[48px] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/20 rounded-full -ml-10 -mb-10 blur-2xl" />

                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <p className="text-primary-foreground/60 text-xs font-bold uppercase tracking-widest mb-1">Elite Valet Service</p>
                        <h1 className="text-3xl font-black text-white leading-tight">
                            Awaiting Orders, <br />
                            {user?.email.split('@')[0] || "Rajesh"}
                        </h1>
                    </div>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Button size="icon" variant="ghost" className="text-white hover:bg-white/10 relative">
                                <Bell className="w-6 h-6" />
                                {pendingJob && (
                                    <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-primary animate-ping" />
                                )}
                            </Button>
                        </div>
                        <Button size="icon" variant="ghost" onClick={handleLogout} className="text-white hover:bg-white/10">
                            <LogOut className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Quick Stats Bar */}
                <div className="mt-8 flex gap-4 relative z-10">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex-1 border border-white/10">
                        <div className="flex items-center gap-2 mb-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            <span className="text-[10px] text-white/70 font-bold uppercase">Rating</span>
                        </div>
                        <p className="text-xl font-black text-white">4.92</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex-1 border border-white/10">
                        <div className="flex items-center gap-2 mb-1">
                            <Trophy className="w-3 h-3 text-emerald-400" />
                            <span className="text-[10px] text-white/70 font-bold uppercase">Jobs Done</span>
                        </div>
                        <p className="text-xl font-black text-white">128</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex-1 border border-white/10">
                        <div className="flex items-center gap-2 mb-1">
                            <Activity className="w-3 h-3 text-blue-400" />
                            <span className="text-[10px] text-white/70 font-bold uppercase">Bonus</span>
                        </div>
                        <p className="text-xl font-black text-white">₹450</p>
                    </div>
                </div>
            </div>

            <div className="px-6 -mt-8 relative z-20 space-y-8">
                {/* Real-time Order Alert */}
                <AnimatePresence>
                    {pendingJob && !myCurrentJob && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative group"
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse" />
                            <Card className="p-6 border-none shadow-xl bg-white relative overflow-hidden">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-2">
                                        <Activity className="w-3 h-3 animate-pulse" />
                                        <span className="text-[10px] font-bold uppercase">New Request Nearby</span>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-bold">2 MINS AGO</span>
                                </div>
                                <div className="flex gap-5 mb-6">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-primary border border-slate-200 shadow-inner">
                                        <Car className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-800 text-lg leading-tight mb-1">{pendingJob.vehicle_details}</h3>
                                        <p className="text-xs font-bold text-slate-500 flex items-center gap-1">
                                            <User className="w-3 h-3" /> {pendingJob.customer_name} • Premium Member
                                        </p>
                                        <div className="flex gap-2 mt-2">
                                            <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[9px] font-black uppercase">
                                                {pendingJob.type === 'park' ? 'Pick-up & Park' : 'Retrieve & Return'}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
                                            <MapPin className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="font-bold text-slate-600">{pendingJob.location}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-400">
                                        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
                                            <Clock className="w-4 h-4" />
                                        </div>
                                        <span className="font-medium italic">Estimated Service Time: 12 mins</span>
                                    </div>
                                </div>

                                <Button
                                    className="w-full h-14 bg-primary text-white hover:bg-primary/90 rounded-2xl shadow-lg shadow-primary/30 font-black uppercase tracking-widest text-sm group"
                                    onClick={() => updateValetStatus(pendingJob.id, 'accepted', 'd1')}
                                >
                                    Accept Assignment <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Current Active Assignment */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                        <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Active Operation</h2>
                        <Badge variant="outline" className="border-none text-[10px] font-bold text-primary animate-pulse">LIVE TRACKING</Badge>
                    </div>
                    {myCurrentJob ? (
                        <Card className="p-6 border-none shadow-2xl bg-white border-l-4 border-l-emerald-500">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <Navigation className="w-5 h-5 text-emerald-600 animate-pulse" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">Status</p>
                                        <p className="text-sm font-black text-slate-800 uppercase italic">
                                            {myCurrentJob.status === 'accepted' ? 'En Route to Pickup' : 'Vehicle Secured'}
                                        </p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="h-10 w-10 text-primary">
                                    <Navigation className="w-5 h-5" />
                                </Button>
                            </div>

                            <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase mb-3 letter-spacing-widest">Job Details</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-slate-400 font-bold">VEHICLE</p>
                                        <p className="text-xs font-black text-slate-700">{myCurrentJob.vehicle_details}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-slate-400 font-bold">LOCATION</p>
                                        <p className="text-xs font-black text-slate-700">{myCurrentJob.location}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {myCurrentJob.status === 'accepted' ? (
                                    <Button
                                        className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-lg shadow-emerald-200 font-black uppercase"
                                        onClick={() => updateValetStatus(myCurrentJob.id, 'in-progress', 'd1')}
                                    >
                                        Vehicle Received
                                    </Button>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="p-4 bg-primary/5 rounded-2xl border border-dashed border-primary/30 text-center mb-2">
                                            <p className="text-xs font-bold text-primary">AUTO-SYNCING WITH SLOT B-102</p>
                                        </div>
                                        <Button
                                            className="w-full h-14 bg-primary text-white hover:bg-primary/90 rounded-2xl shadow-xl shadow-primary/20 font-black uppercase"
                                            onClick={() => updateValetStatus(myCurrentJob.id, 'completed', 'd1', 'slot-123', 'B-102')}
                                        >
                                            Confirm Parking <CheckCircle2 className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </Card>
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center text-center px-10">
                            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-6 shadow-inner">
                                <Car className="w-10 h-10 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-black text-slate-800 mb-2">SCANNING FOR JOBS</h3>
                            <p className="text-sm text-slate-400 font-medium">Position yourself at high-traffic zones for faster assignments.</p>
                        </div>
                    )}
                </div>

                {/* History / Earnings Snapshot */}
                <div className="space-y-4 pb-10">
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">Mission History</h2>
                    {completedJobs.slice(0, 3).map(job => (
                        <div key={job.id} className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-slate-100">
                            <div className="flex gap-4 items-center">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-700 leading-tight">{job.vehicle_details}</p>
                                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">{new Date(job.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {job.slot_name || 'B-34'}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-black text-primary leading-tight">+₹12.50</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Credited</p>
                            </div>
                        </div>
                    ))}
                    <Button variant="ghost" className="w-full text-primary font-black uppercase text-xs tracking-widest py-6">
                        View Full Logs <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            </div>

            {/* Futuristic Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 h-24 bg-white/80 backdrop-blur-2xl border-t border-white/20 px-10 flex justify-between items-center z-50 rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                <button className="flex flex-col items-center gap-1.5 group">
                    <div className="p-1 rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                        <Navigation className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-[10px] font-black uppercase text-primary tracking-tighter">Mission</span>
                </button>
                <button className="flex flex-col items-center gap-1.5 group opacity-40 hover:opacity-100 transition-opacity">
                    <div className="p-1 rounded-lg transition-colors">
                        <ArrowRightLeft className="w-6 h-6 text-slate-600" />
                    </div>
                    <span className="text-[10px] font-black uppercase text-slate-600 tracking-tighter">Ledger</span>
                </button>
                <button className="flex flex-col items-center gap-1.5 group opacity-40 hover:opacity-100 transition-opacity">
                    <div className="p-1 rounded-lg transition-colors">
                        <User className="w-6 h-6 text-slate-600" />
                    </div>
                    <span className="text-[10px] font-black uppercase text-slate-600 tracking-tighter">Profile</span>
                </button>
            </div>
        </div>
    );
}
