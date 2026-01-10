import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Wallet as WalletIcon, Plus, ArrowUpRight, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function WalletPage() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [balance, setBalance] = useState(250.00);

    const handleAddMoney = () => {
        // Simulate payment gateway
        toast({
            title: "Processing...",
            description: "Redirecting to payment gateway",
        });
        setTimeout(() => {
            setBalance(prev => prev + 500);
            toast({
                title: "Success! 💰",
                description: "₹500 added to your wallet",
            });
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="bg-primary px-6 pt-8 pb-12 text-primary-foreground rounded-b-[2rem]">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(-1)}
                    className="mb-4 text-primary-foreground hover:bg-primary-foreground/20"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">My Wallet</h1>
                    <div className="p-2 bg-primary-foreground/10 rounded-full">
                        <WalletIcon className="w-6 h-6" />
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-primary-foreground/70 mb-1">Total Balance</p>
                    <h2 className="text-4xl font-bold">₹{balance.toFixed(2)}</h2>
                </div>
            </div>

            <div className="px-6 -mt-6">
                <div className="flex gap-4 mb-8">
                    <Button
                        size="lg"
                        className="flex-1 shadow-lg bg-background text-foreground hover:bg-accent"
                        onClick={handleAddMoney}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Money
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        className="flex-1 shadow-lg bg-background hover:bg-accent"
                        onClick={() => toast({ title: "Withdrawals disabled", description: "Minimum balance ₹1000 required" })}
                    >
                        <ArrowUpRight className="w-4 h-4 mr-2" />
                        Withdraw
                    </Button>
                </div>

                <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <History className="w-4 h-4" />
                    Recent Transactions
                </h3>

                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                                    <Car className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="font-medium">Parking Fee</p>
                                    <p className="text-xs text-muted-foreground">Today, 2:30 PM</p>
                                </div>
                            </div>
                            <p className="font-bold text-red-500">- ₹40.00</p>
                        </Card>
                    ))}
                    <Card className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                <Plus className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="font-medium">Wallet Top-up</p>
                                <p className="text-xs text-muted-foreground">Yesterday</p>
                            </div>
                        </div>
                        <p className="font-bold text-green-500">+ ₹500.00</p>
                    </Card>
                </div>
            </div>
        </div>
    );
}

// Helper component import fix
import { Car } from 'lucide-react';
