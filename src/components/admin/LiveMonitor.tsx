import { motion } from 'framer-motion';
import { Activity, Radio, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const MONITOR_ZONES = [
    { id: 'zone-a', name: 'Zone A (Main)', occupancy: 85, status: 'stable' },
    { id: 'zone-b', name: 'Zone B (VIP)', occupancy: 42, status: 'low' },
    { id: 'zone-c', name: 'Zone C (Cargo)', occupancy: 94, status: 'critical' },
];

export function LiveMonitor() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <Radio className="w-5 h-5 text-primary animate-pulse" />
                    LIVE GARAGE FEED
                </h3>
                <div className="px-3 py-1 bg-primary/10 rounded-full flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                    <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">Real-time Connection</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {MONITOR_ZONES.map((zone) => (
                    <Card key={zone.id} className="bg-black/5 border-primary/10 overflow-hidden relative group">
                        <div className="p-4 relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">{zone.name}</span>
                                {zone.status === 'critical' && (
                                    <AlertTriangle className="w-4 h-4 text-warning animate-bounce" />
                                )}
                            </div>

                            <div className="flex items-end justify-between mb-2">
                                <span className="text-3xl font-black">{zone.occupancy}%</span>
                                <span className="text-[10px] text-muted-foreground font-mono">OCCUPANCY</span>
                            </div>

                            {/* Progress Bar Container */}
                            <div className="h-1.5 w-full bg-primary/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${zone.occupancy}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className={cn(
                                        "h-full rounded-full shadow-[0_0_8px_rgba(0,0,0,0.2)]",
                                        zone.status === 'critical' ? 'bg-warning' : 'bg-primary'
                                    )}
                                />
                            </div>
                        </div>

                        {/* Background Grid Pattern */}
                        <div className="absolute inset-0 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity"
                            style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
                    </Card>
                ))}
            </div>

            {/* Interactive Visualization Area */}
            <Card className="bg-black/5 border-primary/10 p-4 h-[300px] relative overflow-hidden flex items-center justify-center">
                <div className="text-center z-10">
                    <Activity className="w-12 h-12 text-primary/20 mx-auto mb-4" />
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Initializing Spatial Grid...</p>
                </div>

                {/* Mock Visualization Elements */}
                <div className="absolute inset-0 z-0">
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                opacity: [0.1, 0.3, 0.1],
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, 0]
                            }}
                            transition={{ duration: 5, repeat: Infinity, delay: i * 0.5 }}
                            className="absolute border border-primary/5 rounded-2xl"
                            style={{
                                top: `${20 + i * 10}%`,
                                left: `${10 + i * 15}%`,
                                width: '100px',
                                height: '60px',
                            }}
                        />
                    ))}
                </div>
            </Card>
        </div>
    );
}
