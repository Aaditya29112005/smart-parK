import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, ChevronRight, Smartphone, ShieldCheck } from 'lucide-react';

interface UPIPaymentProps {
    amount: number;
    onSuccess: () => void;
}

const UPI_APPS = [
    { id: 'gpay', name: 'GPay', color: '#4285F4' },
    { id: 'phonepe', name: 'PhonePe', color: '#5f259f' },
    { id: 'paytm', name: 'Paytm', color: '#00baf2' },
];

export function UPIPayment({ amount, onSuccess }: UPIPaymentProps) {
    const [step, setStep] = useState<'scan' | 'processing' | 'success'>('scan');

    const handleSimulateScan = () => {
        setStep('processing');
        setTimeout(() => {
            setStep('success');
            setTimeout(onSuccess, 1500);
        }, 2500);
    };

    return (
        <Card className="overflow-hidden border-2 border-primary/20 shadow-glow-sm">
            <div className="p-6 space-y-6">
                <AnimatePresence mode="wait">
                    {step === 'scan' && (
                        <motion.div
                            key="scan"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6 text-center"
                        >
                            <div className="flex flex-col items-center gap-2 mb-2">
                                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-primary text-[10px] font-bold uppercase tracking-widest">
                                    <ShieldCheck className="w-3 h-3" />
                                    Secure BHIM UPI
                                </div>
                                <h3 className="text-lg font-bold">Scan QR to Pay</h3>
                            </div>

                            {/* Mock QR Code */}
                            <div
                                className="relative group cursor-pointer mx-auto"
                                onClick={handleSimulateScan}
                            >
                                <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-xl group-hover:bg-primary/20 transition-colors" />
                                <div className="relative bg-white p-4 rounded-3xl border-2 border-primary/10 shadow-xl">
                                    <svg viewBox="0 0 100 100" className="w-48 h-48 text-black">
                                        <rect width="100" height="100" fill="white" />
                                        <path
                                            d="M10,10 h30 v30 h-30 z M15,15 v20 h20 v-20 z M22,22 h6 v6 h-6 z"
                                            fill="currentColor"
                                        />
                                        <path
                                            d="M60,10 h30 v30 h-30 z M65,15 v20 h20 v-20 z M72,22 h6 v6 h-6 z"
                                            fill="currentColor"
                                        />
                                        <path
                                            d="M10,60 h30 v30 h-30 z M15,65 v20 h20 v-20 z M22,72 h6 v6 h-6 z"
                                            fill="currentColor"
                                        />
                                        <path
                                            d="M45,10 h10 v10 h-10 z M10,45 h10 v10 h-10 z M45,45 h10 v10 h-10 z M60,60 h10 v10 h-10 z M80,60 h10 v10 h-10 z M60,80 h10 v10 h-10 z M80,80 h10 v10 h-10 z"
                                            fill="currentColor"
                                        />
                                        <path d="M45,60 h5 v5 h-5 z M55,70 h5 v5 h-5 z M45,80 h5 v5 h-5 z" fill="currentColor" />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-white/80 backdrop-blur-sm transition-opacity rounded-3xl">
                                        <p className="text-primary font-bold text-sm">Simulate Scan</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground">Or pay using installed apps</p>
                                <div className="grid grid-cols-3 gap-3">
                                    {UPI_APPS.map((app) => (
                                        <button
                                            key={app.id}
                                            onClick={handleSimulateScan}
                                            className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
                                        >
                                            <div
                                                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-black"
                                                style={{ backgroundColor: app.color }}
                                            >
                                                {app.name[0]}
                                            </div>
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase">{app.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 'processing' && (
                        <motion.div
                            key="processing"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="py-12 flex flex-col items-center text-center gap-6"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                                <Loader2 className="w-16 h-16 text-primary animate-spin relative" strokeWidth={3} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Waiting for payment</h3>
                                <p className="text-muted-foreground mt-1">Please approve the request in your UPI app</p>
                            </div>
                        </motion.div>
                    )}

                    {step === 'success' && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="py-12 flex flex-col items-center text-center gap-4"
                        >
                            <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center">
                                <CheckCircle2 className="w-12 h-12 text-success" strokeWidth={3} />
                            </div>
                            <h3 className="text-xl font-bold">Digital Payment Recieved!</h3>
                            <p className="text-muted-foreground">Transaction ID: UPI_{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="bg-muted/50 p-4 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Mobile Payment Enabled</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
        </Card>
    );
}
