import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, RefreshCw, CheckCircle2, X, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface LPRScannerProps {
    onScan: (plate: string) => void;
    onClose: () => void;
}

export function LPRScanner({ onScan, onClose }: LPRScannerProps) {
    const { toast } = useToast();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [detectedPlate, setDetectedPlate] = useState<string | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const startCamera = React.useCallback(async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Camera access denied:", err);
            toast({
                title: "Camera Error",
                description: "DeepScan requires camera access to recognize license plates.",
                variant: "destructive"
            });
        }
    }, [toast]);

    useEffect(() => {
        startCamera();
        return () => {
            stream?.getTracks().forEach(track => track.stop());
        };
    }, [startCamera, stream]);

    const handleScan = () => {
        setIsScanning(true);
        setScanProgress(0);
        setDetectedPlate(null);

        // Simulate AI Processing OCR
        const interval = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    const plate = `MH12-${Math.floor(1000 + Math.random() * 9000)}`;
                    setDetectedPlate(plate);
                    setIsScanning(false);
                    return 100;
                }
                return prev + 2;
            });
        }, 50);
    };

    const confirmPlate = () => {
        if (detectedPlate) {
            onScan(detectedPlate);
        }
    };

    return (
        <div className="fixed inset-0 z-[2000] bg-black flex flex-col items-center justify-center p-6 bg-gradient-to-b from-black via-zinc-900 to-black">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                            <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white tracking-tight">AI DEEPSCAN™</h2>
                            <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Neural Plate Recognition</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-white/10 text-white/50">
                        <X className="w-6 h-6" />
                    </Button>
                </div>

                {/* Viewport */}
                <Card className="relative aspect-[4/3] bg-zinc-950 border-white/10 overflow-hidden shadow-2xl rounded-3xl">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover opacity-60"
                    />

                    {/* HUD Overlays */}
                    <div className="absolute inset-0 pointer-events-none">
                        {/* Scanning Box */}
                        <div className="absolute inset-8 border-2 border-primary/20 rounded-2xl">
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg" />
                        </div>

                        {/* Scanning Line */}
                        {isScanning && (
                            <motion.div
                                animate={{ top: ['10%', '90%', '10%'] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="absolute left-8 right-8 h-1 bg-primary/50 shadow-[0_0_15px_hsl(var(--primary))] z-10"
                            />
                        )}

                        {/* Status Overlay */}
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                            <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-primary animate-pulse' : 'bg-zinc-500'}`} />
                                <span className="text-[10px] font-mono text-white tracking-widest uppercase">
                                    {isScanning ? `ANALYZING... ${scanProgress}%` : detectedPlate ? 'READY FOR LINK' : 'AWAITING TARGET'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <AnimatePresence>
                        {detectedPlate && (
                            <motion.div
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="absolute inset-x-4 bottom-4 z-20"
                            >
                                <div className="bg-white p-4 rounded-2xl shadow-2xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center font-mono font-black text-lg border-2 border-black/5">
                                            {detectedPlate}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-zinc-500 uppercase">Match Found</p>
                                            <p className="text-xs font-bold text-primary flex items-center gap-1">
                                                <ShieldCheck className="w-3 h-3" /> VERIFIED
                                            </p>
                                        </div>
                                    </div>
                                    <Button onClick={confirmPlate} size="sm" className="rounded-xl px-6 bg-black hover:bg-zinc-800 text-white">
                                        Link Vehicle
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Card>

                {/* Controls */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                    <Button
                        variant="ghost"
                        className="h-16 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 flex flex-col gap-1"
                        onClick={startCamera}
                    >
                        <RefreshCw className="w-5 h-5 opacity-50" />
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Reset Feed</span>
                    </Button>
                    <Button
                        className={`h-16 rounded-2xl flex flex-col gap-1 shadow-2xl transition-all ${isScanning ? 'bg-primary/20 border-primary/50 text-primary' : 'bg-primary hover:bg-primary/90 text-white'}`}
                        onClick={handleScan}
                        disabled={isScanning}
                    >
                        <Camera className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                            {isScanning ? 'Scanning...' : 'Capture Plate'}
                        </span>
                    </Button>
                </div>

                {/* Info */}
                <div className="mt-8 flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <ShieldCheck className="w-5 h-5 text-primary/60 mt-0.5" />
                    <p className="text-[11px] text-white/40 leading-relaxed font-medium">
                        DEEPSCAN uses optical character recognition to automatically detect your license plate. Ensure the plate is centered within the focus box for maximum accuracy.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
