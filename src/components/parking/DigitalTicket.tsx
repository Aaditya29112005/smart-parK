import React from 'react';
import { motion } from 'framer-motion';
import {
    QrCode,
    Download,
    Printer,
    Clock,
    MapPin,
    Car,
    ShieldCheck,
    CheckCircle2,
    Calendar,
    ChevronRight
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ParkingSession } from '@/types/parking';
import { cn } from '@/lib/utils';

interface DigitalTicketProps {
    session: ParkingSession;
    onClose?: () => void;
}

export function DigitalTicket({ session, onClose }: DigitalTicketProps) {
    const ticketId = `PK-${session.id.slice(-6).toUpperCase()}`;
    const entryTime = new Date(session.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const entryDate = new Date(session.start_time).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });

    const handlePrint = () => {
        window.print();
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm mx-auto bg-white rounded-[2.5rem] overflow-hidden shadow-2xl relative"
        >
            {/* Ticket Header */}
            <div className="bg-primary p-8 text-white relative overflow-hidden">
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <p className="text-[10px] font-black tracking-[0.2em] opacity-80 uppercase mb-1">Electronic Permit</p>
                        <h2 className="text-3xl font-black tracking-tighter">{ticketId}</h2>
                    </div>
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                        <ShieldCheck className="w-7 h-7" />
                    </div>
                </div>

                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />
            </div>

            {/* Ticket Content */}
            <div className="p-8 space-y-8 relative">
                {/* Dashed Line Separator */}
                <div className="absolute -top-3 left-0 right-0 flex items-center px-4">
                    <div className="w-6 h-6 bg-white rounded-full -ml-7 shadow-inner" />
                    <div className="flex-1 border-t-2 border-dashed border-primary/20" />
                    <div className="w-6 h-6 bg-white rounded-full -mr-7 shadow-inner" />
                </div>

                {/* Main Info Grid */}
                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Arrival</p>
                        <p className="text-xl font-black">{entryTime}</p>
                        <p className="text-[10px] font-bold text-muted-foreground">{entryDate}</p>
                    </div>
                    <div className="space-y-1 text-right">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Zone / Slot</p>
                        <p className="text-xl font-black text-primary">{session.slot?.name}</p>
                        <p className="text-[10px] font-bold text-muted-foreground px-2 py-0.5 bg-primary/5 rounded-full inline-block">SECURED</p>
                    </div>
                </div>

                {/* Vehicle Details */}
                <div className="p-4 bg-muted/30 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                        <Car className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Registered Vehicle</p>
                        <p className="font-black text-lg tracking-tight">{session.vehicle?.number}</p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-success" />
                </div>

                {/* QR Code Section */}
                <div className="text-center py-4 relative group">
                    <div className="absolute inset-0 bg-primary/5 rounded-3xl scale-110 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-48 h-48 bg-white mx-auto p-4 rounded-3xl border border-border shadow-inner relative z-10">
                        {/* Placeholder SVG "QR Code" */}
                        <svg viewBox="0 0 100 100" className="w-full h-full text-black">
                            <rect x="0" y="0" width="30" height="30" fill="currentColor" />
                            <rect x="70" y="0" width="30" height="30" fill="currentColor" />
                            <rect x="0" y="70" width="30" height="30" fill="currentColor" />
                            <rect x="35" y="35" width="30" height="30" fill="currentColor" />
                            <rect x="10" y="10" width="10" height="10" fill="white" />
                            <rect x="80" y="10" width="10" height="10" fill="white" />
                            <rect x="10" y="80" width="10" height="10" fill="white" />
                            <rect x="45" y="45" width="10" height="10" fill="white" />
                            {/* Random dots */}
                            {[...Array(40)].map((_, i) => (
                                <rect
                                    key={i}
                                    x={Math.random() * 80 + 10}
                                    y={Math.random() * 80 + 10}
                                    width="5"
                                    height="5"
                                    fill="currentColor"
                                />
                            ))}
                        </svg>
                    </div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-6 flex items-center justify-center gap-2">
                        <QrCode className="w-3 h-3" />
                        Scan for validation at checkpoint
                    </p>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                    <Button variant="outline" className="h-12 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2" onClick={handlePrint}>
                        <Printer className="w-4 h-4" />
                        Print
                    </Button>
                    <Button className="h-12 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2">
                        <Download className="w-4 h-4" />
                        Save Wallet
                    </Button>
                </div>
            </div>

            {/* Footer Tag */}
            <div className="bg-muted/50 p-4 text-center">
                <p className="text-[10px] font-bold text-muted-foreground">Powered by Smart Park OS v4.0</p>
            </div>
        </motion.div>
    );
}
