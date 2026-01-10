import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Car,
    ShieldCheck,
    Lock,
    User,
    Mail,
    ArrowRight,
    Loader2,
    Sparkles,
    Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function DriverAuth() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Mock Auth Logic
        setTimeout(() => {
            const mockDriver = {
                id: "d1",
                email: email || "driver@smartpark.com",
                name: "Rajesh Kumar",
                role: "driver" as const,
                is_valet: true
            };

            localStorage.setItem("user", JSON.stringify(mockDriver));
            toast({
                title: isLogin ? "Welcome Back, Chief! 🏎️" : "Account Created! 🚀",
                description: isLogin ? "Link established. Fetching active assignments..." : "Your driver profile is ready for deployment.",
            });

            navigate("/driver/dashboard");
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Dynamic Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] -ml-32 -mb-32" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-10">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary shadow-[0_0_30px_rgba(var(--primary),0.3)] mb-6"
                    >
                        <Car className="w-10 h-10 text-white" />
                    </motion.div>
                    <h1 className="text-4xl font-black tracking-tighter mb-2 italic">VALET PRO</h1>
                    <p className="text-slate-400 text-sm font-medium tracking-wide uppercase">Elite Driver Assignment Hub</p>
                </div>

                <Card className="bg-white/5 backdrop-blur-2xl border-white/10 p-8 shadow-2xl rounded-[32px] relative overflow-hidden">
                    <div className="flex bg-black/40 p-1 rounded-2xl mb-8">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${isLogin ? "bg-primary text-white" : "text-slate-400 hover:text-white"
                                }`}
                        >
                            LOG IN
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${!isLogin ? "bg-primary text-white" : "text-slate-400 hover:text-white"
                                }`}
                        >
                            SIGN UP
                        </button>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-5">
                        <div className="space-y-4">
                            {!isLogin && (
                                <div className="relative">
                                    <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                                    <Input
                                        placeholder="Full Name"
                                        className="bg-black/30 border-white/5 h-12 pl-12 rounded-xl focus:border-primary/50"
                                        required
                                    />
                                </div>
                            )}

                            <div className="relative">
                                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                                <Input
                                    type="email"
                                    placeholder="Driver ID / Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-black/30 border-white/5 h-12 pl-12 rounded-xl focus:border-primary/50 text-white"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                                <Input
                                    type="password"
                                    placeholder="Passcode"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-black/30 border-white/5 h-12 pl-12 rounded-xl focus:border-primary/50 text-white"
                                    required
                                />
                            </div>

                            {!isLogin && (
                                <div className="relative">
                                    <Briefcase className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                                    <Input
                                        placeholder="Voucher/Invite Code"
                                        className="bg-black/30 border-white/5 h-12 pl-12 rounded-xl focus:border-primary/50"
                                    />
                                </div>
                            )}
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest rounded-2xl group relative overflow-hidden"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <div className="flex items-center">
                                    {isLogin ? "Establish Link" : "Register Profile"}
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            )}
                        </Button>
                    </form>

                    <AnimatePresence>
                        {isLogin && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-8 p-4 rounded-2xl bg-primary/5 border border-primary/10"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                        <Sparkles className="w-4 h-4 text-primary" />
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-mono tracking-tighter leading-tight">
                                        AUTHORIZED PERSONNEL<br />
                                        <span className="text-primary font-bold">MODE: ELITE VALET ACTIVE</span>
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Card>

                <div className="mt-8 flex justify-center gap-6">
                    <div className="flex items-center gap-2 text-slate-500">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-[10px] uppercase font-bold tracking-widest">Secure Link</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                        <Briefcase className="w-4 h-4" />
                        <span className="text-[10px] uppercase font-bold tracking-widest">Carrier Grade</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
