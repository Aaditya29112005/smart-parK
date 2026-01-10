import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function AdminAuth() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Mock Admin Login Logic
        setTimeout(() => {
            if (email === 'super@smartpark.com' && password === 'super123') {
                const superUser = {
                    id: 'super-1',
                    email: 'super@smartpark.com',
                    name: 'Super Admin',
                    role: 'super-admin' as const,
                    is_admin: true
                };
                localStorage.setItem('user', JSON.stringify(superUser));
                localStorage.setItem('is_admin', 'true');
                localStorage.setItem('is_super_admin', 'true');
                toast({
                    title: "Access Granted 💠",
                    description: "Welcome, Super Administrator. Global Domain active.",
                });
                navigate('/super-admin');
            } else if (email === 'admin@smartpark.com' && password === 'admin123') {
                const adminUser = {
                    id: 'admin-1',
                    email: 'admin@smartpark.com',
                    name: 'Main Admin',
                    role: 'admin' as const,
                    is_admin: true,
                    managedLocationId: '1' // Phoenix Market City
                };
                localStorage.setItem('user', JSON.stringify(adminUser));
                localStorage.setItem('is_admin', 'true');
                localStorage.removeItem('is_super_admin');
                toast({
                    title: "Access Granted 🔐",
                    description: "Welcome to the Command Center, Administrator.",
                });
                navigate('/admin');
            } else if (email === 'driver@smartpark.com' && password === 'driver123') {
                const driverUser = {
                    id: 'd1',
                    email: 'driver@smartpark.com',
                    name: 'Rajesh Kumar',
                    role: 'driver' as const,
                };
                localStorage.setItem('user', JSON.stringify(driverUser));
                toast({
                    title: "Driver Link Established 🏎️",
                    description: "Welcome back. Accessing Mission Control...",
                });
                navigate('/driver/dashboard');
            } else {
                toast({
                    title: "Access Denied",
                    description: "Invalid credentials. Please verify your security clearance.",
                    variant: "destructive",
                });
            }
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* HUD Background Decorations */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px]" />

                {/* Scanning Line */}
                <motion.div
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-[1px] bg-primary/20 z-10"
                />

                {/* Grid */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/20 border border-primary/30 mb-6 relative"
                    >
                        <Shield className="w-10 h-10 text-primary" />
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border-2 border-primary/20 border-t-primary rounded-2xl"
                        />
                    </motion.div>
                    <h1 className="text-3xl font-black tracking-tighter mb-2">COMMAND CENTER</h1>
                    <p className="text-muted-foreground text-sm uppercase tracking-[0.2em]">Authorized Personnel Only</p>
                </div>

                <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-8 shadow-2xl relative overflow-hidden">
                    {/* Status Light */}
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                        <span className="text-[10px] text-primary/70 font-mono tracking-tighter">SECURE CHANNEL</span>
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_hsl(var(--primary))]" />
                    </div>

                    <form onSubmit={handleAdminLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Admin ID</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                                <Input
                                    type="email"
                                    placeholder="admin@smartpark.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-black/50 border-white/10 h-12 pl-11 focus:border-primary/50 text-white placeholder:text-white/20"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Access Code</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-black/50 border-white/10 h-12 pl-11 focus:border-primary/50 text-white placeholder:text-white/20"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            size="xl"
                            className="w-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest group"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    Initiate Link <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </form>

                    {/* AI Hint */}
                    <div className="mt-8 flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20 shadow-inner">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 border border-primary/30">
                            <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                        <div className="space-y-1.5 pt-0.5">
                            <p className="text-xs text-muted-foreground leading-snug">
                                <span className="text-primary font-black uppercase tracking-wider mr-2">Admin:</span>
                                <code className="text-primary font-bold bg-primary/5 px-1.5 py-0.5 rounded">super@smartpark.com / super123</code>
                            </p>
                            <p className="text-xs text-muted-foreground leading-snug">
                                <span className="text-primary font-black uppercase tracking-wider mr-2">Valet:</span>
                                <code className="text-primary font-bold bg-primary/5 px-1.5 py-0.5 rounded">driver@smartpark.com / driver123</code>
                            </p>
                            <p className="text-xs text-muted-foreground leading-snug">
                                <span className="text-primary font-black uppercase tracking-wider mr-2">Manager:</span>
                                <code className="text-primary font-bold bg-primary/5 px-1.5 py-0.5 rounded">admin@smartpark.com / admin123</code>
                            </p>
                        </div>
                    </div>
                </Card>

                {/* System Logs Mock */}
                <div className="mt-8 font-mono text-[11px] text-muted-foreground/50 space-y-1.5 tracking-tighter">
                    <p className="flex items-center gap-2"><span className="text-primary/40 opacity-50">&gt;</span> BOOTING CORE_UI_V4.2.0...</p>
                    <p className="flex items-center gap-2"><span className="text-primary/40 opacity-50">&gt;</span> ENCRYPTING SESSION PROTOCOLS...</p>
                    <p className="flex items-center gap-2"><span className="text-primary/40 opacity-50">&gt;</span> AWAITING SECURE CREDENTIALS_</p>
                </div>
            </motion.div>
        </div>
    );
}
