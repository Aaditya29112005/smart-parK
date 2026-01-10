import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCircle2, HandCoins, BellRing, CheckCircle2, Loader2, Info } from 'lucide-react';

interface CashPaymentProps {
    amount: number;
    onSuccess: () => void;
}

export function CashPayment({ amount, onSuccess }: CashPaymentProps) {
    const [isCalling, setIsCalling] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);

    const handleCallAttendant = () => {
        setIsCalling(true);
        setTimeout(() => {
            setIsCalling(false);
            // In a real app, the attendant would confirm on their device
            // We simulate this with a small delay
        }, 3000);
    };

    const handleSimulateAttendantConfirm = () => {
        setIsConfirmed(true);
        setTimeout(onSuccess, 1500);
    };

    return (
        <Card className="overflow-hidden border-2 border-orange-500/20 shadow-glow-sm">
            <div className="p-6 space-y-6">
                <AnimatePresence mode="wait">
                    {!isConfirmed ? (
                        <motion.div
                            key="awaiting"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                                    <HandCoins className="w-8 h-8 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">Pay at Counter</h3>
                                    <p className="text-sm text-muted-foreground">Please pay ₹{amount.toFixed(2)} to the attendant</p>
                                </div>
                            </div>

                            <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex gap-3">
                                <Info className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                                <p className="text-xs text-orange-800 leading-relaxed font-medium">
                                    Please head to the exit counter. The attendant will verify your vehicle number and accept the payment.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <Button
                                    variant="outline"
                                    className="w-full h-12 border-orange-200 hover:bg-orange-50 text-orange-700 font-bold"
                                    onClick={handleCallAttendant}
                                    disabled={isCalling}
                                >
                                    {isCalling ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                            Calling Attendant...
                                        </>
                                    ) : (
                                        <>
                                            <BellRing className="w-5 h-5 mr-2" />
                                            Call Attendant to Spot
                                        </>
                                    )}
                                </Button>

                                <Button
                                    variant="default"
                                    className="w-full h-12 bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-600/20"
                                    onClick={handleSimulateAttendantConfirm}
                                >
                                    <UserCircle2 className="w-5 h-5 mr-2" />
                                    Attendant: Confirm Payment
                                </Button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="confirmed"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="py-8 flex flex-col items-center text-center gap-4"
                        >
                            <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center">
                                <CheckCircle2 className="w-12 h-12 text-success" strokeWidth={3} />
                            </div>
                            <h3 className="text-xl font-bold">Payment Verified by Attendant</h3>
                            <p className="text-muted-foreground">Receipt is being generated...</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="bg-muted/50 p-4 border-t border-border flex items-center gap-2">
                <UserCircle2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Attendant ID: PK_ATT_942</span>
            </div>
        </Card>
    );
}
