import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, Clock, MapPin, Receipt, Home, CreditCard, Smartphone, HandCoins, Download, Share2, Printer, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ParkingSession, VEHICLE_ICONS, VEHICLE_LABELS } from '@/types/parking';
import { format } from 'date-fns';
import { StripePayment } from '@/components/payments/StripePayment';
import { UPIPayment } from '@/components/payments/UPIPayment';
import { CashPayment } from '@/components/payments/CashPayment';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FeedbackDialog } from '@/components/parking/FeedbackDialog';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

function formatDuration(startTime: string, endTime: string): string {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const diffInSeconds = Math.floor((end - start) / 1000);

  const hours = Math.floor(diffInSeconds / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);
  const seconds = diffInSeconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

export default function BillPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const session = location.state?.session as ParkingSession | undefined;
  const [isPaid, setIsPaid] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cash'>('card');

  useEffect(() => {
    if (!session) {
      navigate('/home');
    }
  }, [session, navigate]);

  const handlePaymentSuccess = () => {
    setIsPaid(true);
    setTimeout(() => {
      setShowFeedback(true);
    }, 2000);
  };

  if (!session) return null;

  const totalAmount = session.amount || 0;
  const gst = totalAmount * 0.18;
  const basePrice = totalAmount - gst;

  // Payment Selection View
  if (!isPaid) {
    return (
      <MobileLayout>
        <div className="min-h-screen bg-background">
          <div className="gradient-hero text-primary-foreground px-6 pt-12 pb-12 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary-foreground"
              />
            </div>
            <div className="relative z-10 text-center space-y-2">
              <p className="text-primary-foreground/70 text-xs font-bold uppercase tracking-widest">Digital Checkout</p>
              <h1 className="text-3xl font-black">Payment Due</h1>
              <div className="py-4">
                <span className="text-5xl font-black tracking-tighter">₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs bg-black/20 backdrop-blur-md w-fit mx-auto px-4 py-2 rounded-full border border-white/10 uppercase font-bold tracking-wider">
                <Clock className="w-3 h-3" />
                Session: {formatDuration(session.start_time, new Date().toISOString())}
              </div>
            </div>
          </div>

          <div className="px-4 -mt-8 pb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-2 px-1">
                  <Receipt className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-black tracking-tight uppercase text-foreground">Select Payment Mode</h2>
                </div>

                {/* --- 1. CARD SECTION --- */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 px-1 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-black text-xs uppercase tracking-widest text-primary">Secure Card Payment</span>
                  </div>

                  {/* Saved Card Preview */}
                  <div
                    className="relative h-44 w-full rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 text-white shadow-2xl overflow-hidden border border-white/10 group cursor-pointer transition-transform active:scale-95"
                    onClick={() => {
                      setPaymentMethod('card');
                      handlePaymentSuccess();
                    }}
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                      <CreditCard className="w-24 h-24" />
                    </div>
                    <div className="relative z-10 h-full flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div className="w-12 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-md shadow-inner" />
                        <span className="font-bold italic text-xl tracking-wider">VISA</span>
                      </div>
                      <div>
                        <p className="text-lg font-mono tracking-[0.2em]">•••• •••• •••• 4242</p>
                        <div className="flex justify-between items-end mt-2">
                          <p className="text-[10px] uppercase font-bold tracking-widest text-white/50">Adam S.</p>
                          <p className="text-[10px] uppercase font-bold tracking-widest text-white/50">12/28</p>
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <span className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold shadow-lg">Pay with Saved Card</span>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-dashed" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground font-bold italic">Or use a new card</span>
                    </div>
                  </div>

                  <StripePayment
                    amount={totalAmount}
                    onSuccess={() => {
                      setPaymentMethod('card');
                      handlePaymentSuccess();
                    }}
                  />
                </div>

                {/* --- 2. UPI SECTION --- */}
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-dashed opacity-50" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 px-1 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Smartphone className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-black text-xs uppercase tracking-widest text-primary">Instant UPI QR</span>
                  </div>
                  <UPIPayment
                    amount={totalAmount}
                    onSuccess={() => {
                      setPaymentMethod('upi');
                      handlePaymentSuccess();
                    }}
                  />
                </div>

                {/* --- 3. CASH SECTION --- */}
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-dashed opacity-50" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 px-1 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <HandCoins className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-black text-xs uppercase tracking-widest text-primary">Pay via Cash</span>
                  </div>
                  <CashPayment
                    amount={totalAmount}
                    onSuccess={() => {
                      setPaymentMethod('cash');
                      handlePaymentSuccess();
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-success" />
                <span className="text-[10px] font-bold uppercase tracking-widest">PCI DSS Compliant · 256-bit SSL</span>
              </div>
            </motion.div>
          </div>
        </div>
      </MobileLayout>
    );
  }

  // Professional Receipt View
  return (
    <MobileLayout>
      <div className="min-h-screen bg-[#F8F9FA]">
        <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
          <DialogContent className="p-0 border-0 bg-transparent shadow-none max-w-sm">
            <FeedbackDialog
              onClose={() => setShowFeedback(false)}
              onSubmit={(rating, comment) => {
                console.log('Feedback submitted:', { rating, comment });
              }}
            />
          </DialogContent>
        </Dialog>

        <div className="px-4 py-12 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="relative overflow-hidden border-none shadow-2xl bg-white max-w-md mx-auto">
              {/* Receipt Decoration */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-primary" />
              <div className="absolute top-12 -right-8 w-32 h-32 bg-success/10 rounded-full blur-3xl" />
              <div className="absolute top-1/2 -left-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />

              {/* PAID STAMP */}
              <motion.div
                initial={{ opacity: 0, scale: 2, rotate: -20 }}
                animate={{ opacity: 0.15, scale: 1, rotate: -25 }}
                transition={{ delay: 0.5, duration: 0.5, type: 'spring' }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
              >
                <div className="border-8 border-success px-8 py-4 rounded-3xl">
                  <span className="text-8xl font-black text-success uppercase tracking-widest">PAID</span>
                </div>
              </motion.div>

              <div className="p-8 space-y-8 relative">
                {/* Header */}
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                    <Check className="w-10 h-10 text-white" strokeWidth={3} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-foreground uppercase">Smart Park Receipt</h2>
                    <p className="text-[10px] font-bold text-muted-foreground tracking-[0.2em] uppercase">Enterprise Mobility Solutions</p>
                  </div>
                </div>

                {/* Session Details Grid */}
                <div className="grid grid-cols-2 gap-y-6 gap-x-8 py-6 border-y border-dashed border-border/50">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Receipt ID</p>
                    <p className="text-sm font-black text-foreground">#{session.id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Date</p>
                    <p className="text-sm font-black text-foreground">{format(new Date(), 'dd MMM yyyy')}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Vehicle</p>
                    <p className="text-sm font-black text-foreground flex items-center gap-2">
                      {VEHICLE_ICONS[session.vehicle?.type || 'car']} {session.vehicle?.number}
                    </p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Selected Slot</p>
                    <p className="text-sm font-black text-foreground">{session.slot?.name}</p>
                  </div>
                </div>

                {/* Time Breakdown */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-muted/30 p-4 rounded-2xl">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Duration</p>
                      <p className="text-lg font-black text-foreground">{session.end_time ? formatDuration(session.start_time, session.end_time) : 'N/A'}</p>
                    </div>
                    <div className="text-right space-y-0.5">
                      <p className="text-xs font-bold text-foreground">Entry: {format(new Date(session.start_time), 'h:mm a')}</p>
                      <p className="text-xs font-bold text-foreground">Exit: {session.end_time ? format(new Date(session.end_time), 'h:mm a') : 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Base Parking Fee</span>
                    <span className="font-bold">₹{basePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">CGST (9%)</span>
                    <span className="font-bold">₹{(gst / 2).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">SGST (9%)</span>
                    <span className="font-bold">₹{(gst / 2).toFixed(2)}</span>
                  </div>
                  <div className="h-px w-full border-t border-dashed border-border my-4" />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-black text-foreground">GRAND TOTAL</span>
                    <span className="text-3xl font-black text-primary tracking-tighter">₹{totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Footer with QR */}
                <div className="flex items-center gap-6 pt-6">
                  <div className="bg-muted p-2 rounded-xl">
                    {/* Mock QR for verification */}
                    <svg viewBox="0 0 100 100" className="w-16 h-16 opacity-50">
                      <path d="M10,10 h30 v30 h-30 z M60,10 h30 v30 h-30 z M10,60 h30 v30 h-30 z" fill="currentColor" />
                      <rect x="50" y="50" width="10" height="10" fill="currentColor" />
                      <rect x="70" y="70" width="10" height="10" fill="currentColor" />
                    </svg>
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-[10px] font-bold text-success uppercase tracking-widest">Successfully Paid via {paymentMethod.toUpperCase()}</p>
                    <p className="text-[10px] text-muted-foreground uppercase leading-relaxed font-bold">This is a system generated e-receipt. No physical signature required.</p>
                  </div>
                </div>
              </div>

              {/* Perforated edge at bottom */}
              <div className="flex justify-between px-2 pb-1">
                {[...Array(15)].map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-[#F8F9FA] rounded-full -mb-2" />
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Post-Payment Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-2 gap-4 max-w-md mx-auto"
          >
            <Button variant="outline" className="h-14 rounded-2xl border-2 font-bold hover:bg-muted/50">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" className="h-14 rounded-2xl border-2 font-bold hover:bg-muted/50">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button
              variant="gradient"
              size="xl"
              className="col-span-2 h-16 rounded-2xl text-lg font-black"
              onClick={() => navigate('/home')}
            >
              <Home className="w-5 h-5 mr-2" />
              RETURN TO DASHBOARD
            </Button>
            <Button variant="ghost" className="col-span-2 text-xs font-bold text-muted-foreground uppercase tracking-widest hover:bg-transparent">
              <Printer className="w-3 h-3 mr-2" />
              Print Physical Copy
            </Button>
          </motion.div>
        </div>
      </div>
    </MobileLayout>
  );
}
