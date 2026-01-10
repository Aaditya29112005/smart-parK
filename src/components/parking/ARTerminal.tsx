import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Navigation2, X, Info, LocateFixed } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ARTerminalProps {
    targetCoords: { lat: number; lng: number };
    userCoords: { lat: number; lng: number } | null;
    onClose: () => void;
}

export function ARTerminal({ targetCoords, userCoords, onClose }: ARTerminalProps) {
    const [heading, setHeading] = useState(0);
    const [distance, setDistance] = useState(0);
    const [bearing, setBearing] = useState(0);
    const [isPermissionGranted, setIsPermissionGranted] = useState(false);

    // Calculate distance and bearing
    useEffect(() => {
        if (userCoords) {
            const R = 6371e3; // Earth radius in meters
            const φ1 = userCoords.lat * Math.PI / 180;
            const φ2 = targetCoords.lat * Math.PI / 180;
            const Δφ = (targetCoords.lat - userCoords.lat) * Math.PI / 180;
            const Δλ = (targetCoords.lng - userCoords.lng) * Math.PI / 180;

            const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const d = R * c;
            setDistance(d);

            // Bearing
            const y = Math.sin(Δλ) * Math.cos(φ2);
            const x = Math.cos(φ1) * Math.sin(φ2) -
                Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
            const θ = Math.atan2(y, x);
            const brng = (θ * 180 / Math.PI + 360) % 360;
            setBearing(brng);
        }
    }, [userCoords, targetCoords]);

    // Handle Device Orientation
    const requestPermission = async () => {
        // iOS requires permission for DeviceOrientation
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            try {
                const response = await (DeviceOrientationEvent as any).requestPermission();
                if (response === 'granted') {
                    window.addEventListener('deviceorientation', handleOrientation);
                    setIsPermissionGranted(true);
                }
            } catch (e) {
                console.error("Permission request failed", e);
            }
        } else {
            window.addEventListener('deviceorientation', handleOrientation);
            setIsPermissionGranted(true);
        }
    };

    const handleOrientation = (e: any) => {
        if (e.webkitCompassHeading) {
            // iOS
            setHeading(e.webkitCompassHeading);
        } else if (e.alpha !== null) {
            // Android/Standard
            setHeading(360 - e.alpha);
        }
    };

    useEffect(() => {
        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, []);

    // Arrow relative rotation
    const arrowRotation = (bearing - heading + 360) % 360;

    return (
        <div className="fixed inset-0 z-[3000] bg-black text-white flex flex-col overflow-hidden font-sans">
            {/* HUD Header */}
            <div className="p-6 flex items-start justify-between absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Compass className="w-5 h-5 text-primary animate-pulse" />
                        <h2 className="text-xl font-black tracking-tighter uppercase italic">AR HUD v2.0</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                        <p className="text-[10px] font-mono opacity-60 tracking-widest uppercase">GPS Multi-Link Active</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full bg-white/10 backdrop-blur-md">
                    <X className="w-6 h-6" />
                </Button>
            </div>

            {/* Camera View Simulation / Real Camera */}
            <div className="flex-1 relative flex items-center justify-center bg-zinc-900 border-x-4 border-zinc-950">
                {/* Background Grid for depth */}
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

                {/* Perspective Lines */}
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-primary/10 to-transparent skew-y-12 transform-gpu" />

                {!isPermissionGranted ? (
                    <div className="z-20 text-center p-8 max-w-xs">
                        <div className="w-20 h-20 rounded-3xl bg-primary/20 flex items-center justify-center mx-auto mb-6 border border-primary/30 rotate-12">
                            <Navigation2 className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="text-lg font-bold mb-2 uppercase italic tracking-wider">Spatial Calibration</h3>
                        <p className="text-xs opacity-60 mb-8 leading-relaxed">Please grant orientation permission to enable 1:1 spatial mapping to your vehicle.</p>
                        <Button onClick={requestPermission} size="lg" className="w-full bg-primary hover:bg-primary/90 rounded-2xl font-black italic uppercase tracking-tighter">
                            Initiate AR Link
                        </Button>
                    </div>
                ) : (
                    <div className="relative flex flex-col items-center">
                        {/* 3D Arrow Container */}
                        <div className="relative w-64 h-64 flex items-center justify-center perspective-[1000px]">
                            <motion.div
                                animate={{ rotate: arrowRotation }}
                                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                                className="relative w-48 h-48"
                            >
                                {/* Glowing Base */}
                                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />

                                {/* The Pointer */}
                                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]">
                                    <defs>
                                        <linearGradient id="arrowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
                                            <stop offset="100%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 0.3 }} />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        d="M50 5 L85 85 L50 70 L15 85 Z"
                                        fill="url(#arrowGrad)"
                                        className="stroke-primary stroke-[1px]"
                                    />
                                </svg>
                            </motion.div>
                        </div>

                        {/* Distance HUD */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="mt-12 text-center"
                        >
                            <h2 className="text-6xl font-black italic tracking-tighter tabular-nums flex items-baseline gap-2">
                                {distance.toFixed(1)} <span className="text-2xl opacity-50 not-italic">MTRS</span>
                            </h2>
                            <p className="text-xs font-mono uppercase tracking-[0.3em] opacity-40 mt-2">Target Proximity Delta</p>
                        </motion.div>
                    </div>
                )}
            </div>

            {/* Bottom HUD Analytics */}
            <div className="p-8 bg-zinc-950 border-t border-white/10">
                <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-1">
                        <p className="text-[9px] font-mono opacity-40 uppercase tracking-widest">Azimuth</p>
                        <p className="text-sm font-black tabular-nums">{heading.toFixed(1)}°</p>
                    </div>
                    <div className="space-y-1 border-x border-white/5 px-4">
                        <p className="text-[9px] font-mono opacity-40 uppercase tracking-widest">Bearing</p>
                        <p className="text-sm font-black tabular-nums text-primary">{bearing.toFixed(1)}°</p>
                    </div>
                    <div className="space-y-1 text-right">
                        <p className="text-[9px] font-mono opacity-40 uppercase tracking-widest">Altitude</p>
                        <p className="text-sm font-black tabular-nums">12.5m</p>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                            <LocateFixed className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-tight">Slot B-42 Located</p>
                            <p className="text-[10px] opacity-40">2nd Floor, Left Wing</p>
                        </div>
                    </div>
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-zinc-950 bg-primary/40" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
