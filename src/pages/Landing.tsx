import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Car, Shield, Smartphone, Clock, ArrowRight, Star, ChevronDown, Check, Activity, Zap, Users, Globe, MapPin, Search as SearchIcon, QrCode, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';

export default function LandingPage() {
    const navigate = useNavigate();
    const heroRef = useRef(null);
    const { scrollY } = useScroll();

    // Parallax effects
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);
    const scale = useTransform(scrollY, [0, 300], [1, 0.9]);

    const [stats, setStats] = useState({ users: 12400, spots: 850, saving: 15 });

    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => ({
                users: prev.users + Math.floor(Math.random() * 3),
                spots: prev.spots + (Math.random() > 0.8 ? 1 : 0),
                saving: prev.saving + (Math.random() > 0.9 ? 0.1 : 0)
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-white">
            {/* Global Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-primary z-[100] origin-left"
                style={{ scaleX: useSpring(useTransform(scrollY, [0, 2000], [0, 1]), { stiffness: 100, damping: 30 }) }}
            />

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-[60] transition-all duration-300">
                <div className="absolute inset-0 bg-background/60 backdrop-blur-xl border-b border-white/5" />
                <div className="container mx-auto px-6 h-20 flex items-center justify-between relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 group cursor-pointer"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform duration-500">
                            <Car className="w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-primary via-purple-500 to-indigo-600 bg-clip-text text-transparent">
                            SMART PARK
                        </span>
                    </motion.div>

                    <div className="hidden lg:flex items-center gap-10">
                        {['Features', 'How it Works', 'Pricing', 'Fleet'].map((item) => (
                            <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
                                {item}
                            </a>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" className="hidden sm:flex font-bold text-sm uppercase tracking-widest" onClick={() => navigate('/auth')}>
                            Operator Login
                        </Button>
                        <Button
                            className="bg-primary hover:bg-primary/90 text-white font-black px-8 h-12 rounded-2xl shadow-xl shadow-primary/25 active:scale-95 transition-all text-xs uppercase tracking-[0.2em]"
                            onClick={() => navigate('/auth')}
                        >
                            Get Started
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section ref={heroRef} className="relative pt-40 pb-32 px-6">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.08),transparent_50%)]" />

                {/* Animated Background Gradients */}
                <motion.div
                    style={{ y: y1 }}
                    className="absolute top-20 right-[10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse"
                />
                <motion.div
                    style={{ y: y2 }}
                    className="absolute bottom-0 left-[5%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] -z-10"
                />

                <div className="container mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-20">
                        <motion.div
                            style={{ opacity, scale }}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex-[1.2] space-y-10"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] animate-bounce">
                                <Zap className="w-3 h-3 fill-current" />
                                Next-Gen Mobility OS
                            </div>

                            <h1 className="text-6xl md:text-8xl font-black leading-[0.95] tracking-tight text-slate-900">
                                Parking Made <br />
                                <span className="relative">
                                    <span className="relative z-10 bg-gradient-to-r from-primary via-purple-600 to-indigo-600 bg-clip-text text-transparent italic">Effortless</span>
                                    <motion.span
                                        initial={{ width: 0 }}
                                        animate={{ width: '100%' }}
                                        transition={{ delay: 0.8, duration: 1 }}
                                        className="absolute bottom-4 left-0 h-4 bg-primary/10 -rotate-1 z-0"
                                    />
                                </span>
                            </h1>

                            <p className="text-xl text-slate-500 leading-relaxed max-w-xl font-medium">
                                Transform your urban journey with AI-driven spot recognition,
                                real-time data visualizers, and seamless autonomous booking.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6">
                                <Button
                                    size="xl"
                                    className="h-20 px-10 rounded-[2rem] bg-slate-900 hover:bg-slate-800 text-white shadow-2xl group overflow-hidden relative"
                                    onClick={() => navigate('/auth')}
                                >
                                    <div className="relative z-10 flex items-center gap-3">
                                        <span className="text-lg font-black uppercase tracking-widest">Identify Spots</span>
                                        <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                </Button>

                                <Button
                                    size="xl"
                                    variant="outline"
                                    className="h-20 px-10 rounded-[2rem] border-2 border-slate-200 hover:border-primary/30 transition-all bg-white shadow-xl hover:shadow-primary/5 text-slate-600 hover:text-primary"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center">
                                            <Activity className="w-5 h-5" />
                                        </div>
                                        <span className="text-lg font-bold uppercase tracking-tighter">Watch System Demo</span>
                                    </div>
                                </Button>
                            </div>

                            {/* Trust Badge */}
                            <div className="flex items-center gap-8 pt-8">
                                <div className="space-y-1">
                                    <p className="text-2xl font-black text-slate-900">{stats.users.toLocaleString()}+</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Deployments</p>
                                </div>
                                <div className="w-px h-10 bg-slate-100" />
                                <div className="space-y-1">
                                    <p className="text-2xl font-black text-slate-900">{stats.spots}+</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI Active Nodes</p>
                                </div>
                                <div className="w-px h-10 bg-slate-100" />
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-sm">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="User" />
                                        </div>
                                    ))}
                                    <div className="w-10 h-10 rounded-full border-4 border-white bg-primary text-[10px] font-black text-white flex items-center justify-center shadow-md">
                                        4.9⭐
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50, rotate: 10 }}
                            animate={{ opacity: 1, x: 0, rotate: 0 }}
                            transition={{ delay: 0.4, type: "spring", damping: 20 }}
                            className="flex-1 relative perspective-1000"
                        >
                            {/* Premium Phone Frame */}
                            <div className="relative w-[320px] h-[660px] bg-slate-950 rounded-[3.5rem] p-3 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] border border-slate-800">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-950 rounded-b-3xl z-30" />

                                <div className="w-full h-full bg-slate-50 rounded-[3rem] overflow-hidden relative border border-slate-200">
                                    {/* Mock App Interface - High Fidelity */}
                                    <div className="p-5 pt-12 space-y-6">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Active Location</p>
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3 text-primary" />
                                                    <span className="text-xs font-bold text-slate-900 underline underline-offset-4 decoration-primary/30">Cyber Hub, Gurgaon</span>
                                                </div>
                                            </div>
                                            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
                                                <Activity className="w-4 h-4 text-slate-400" />
                                            </div>
                                        </div>

                                        <div className="h-44 rounded-3xl bg-gradient-to-br from-primary via-purple-600 to-indigo-700 p-5 text-white flex flex-col justify-between shadow-lg shadow-primary/20">
                                            <div className="flex justify-between items-start">
                                                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                                                    <Zap className="w-5 h-5 text-white" />
                                                </div>
                                                <span className="text-[8px] font-black uppercase tracking-[0.2em] bg-white/10 px-2 py-1 rounded-full backdrop-blur-sm">Real-time Sync</span>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] uppercase font-black tracking-widest opacity-70">Estimated Cost</p>
                                                <p className="text-3xl font-black">₹45.00<span className="text-sm opacity-50 font-bold">/hr</span></p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="h-32 rounded-3xl bg-white border border-slate-100 shadow-sm p-4 flex flex-col justify-between">
                                                <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                    <Clock className="w-4 h-4" />
                                                </div>
                                                <p className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">Fastest Entry</p>
                                            </div>
                                            <div className="h-32 rounded-3xl bg-white border border-slate-100 shadow-sm p-4 flex flex-col justify-between">
                                                <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                                                    <Shield className="w-4 h-4" />
                                                </div>
                                                <p className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">Secure Zone</p>
                                            </div>
                                        </div>

                                        <div className="h-16 rounded-2xl bg-slate-900 flex items-center justify-center gap-3">
                                            <QrCode className="w-4 h-4 text-white" />
                                            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Initiate Scan</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating High-Tech Cards */}
                            <motion.div
                                animate={{ y: [0, -15, 0], rotate: [0, 2, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-10 -right-10 bg-white/80 backdrop-blur-xl p-5 rounded-3xl shadow-2xl border border-white/50 w-64"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-600 shadow-inner">
                                        <Check className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900 tracking-tight">Mission Secured</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entry Confirmed</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 15, 0], rotate: [0, -2, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute bottom-20 -left-20 bg-primary p-6 rounded-[2.5rem] shadow-2xl shadow-primary/30 w-56 text-white"
                            >
                                <Users className="w-8 h-8 mb-4 opacity-50" />
                                <p className="text-xl font-black italic">"Game changer for urbanites."</p>
                                <p className="text-[9px] font-black uppercase tracking-widest mt-2 opacity-60">Tech Daily Review</p>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Live Operations Pulse */}
            <div id="features" className="bg-slate-950 py-4 overflow-hidden relative border-y border-white/5 scroll-mt-24">
                <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                <div className="flex items-center gap-20 animate-[marquee_40s_linear_infinite] whitespace-nowrap px-10">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] text-white/40">
                            <Activity className="w-4 h-4 text-primary" />
                            <span>Node {i * 123} Online</span>
                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                            <span className="text-white/20">|</span>
                            <span>Transaction Secured in {i * 10}ms</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Interactive Journey Section */}
            <section id="how-it-works" className="py-32 bg-slate-50 relative overflow-hidden scroll-mt-20">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-24">
                        <div className="w-16 h-1 bg-primary mx-auto mb-8 rounded-full" />
                        <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900 tracking-tight uppercase">Operational Journey</h2>
                        <p className="text-lg text-slate-500 font-medium">
                            Experience the frictionless transition from city chaos to curated parking.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-12 relative">
                        {/* Connecting Line */}
                        <div className="absolute top-1/4 left-0 w-full h-px bg-slate-200 hidden md:block" />

                        {[
                            {
                                icon: SearchIcon,
                                step: "01",
                                title: "Discovery",
                                desc: "Our AI engine scans thousands of local nodes to find the optimal spot for your vehicle dimensions."
                            },
                            {
                                icon: QrCode,
                                step: "02",
                                title: "Authentication",
                                desc: "No tickets needed. A simple 0.5s camera scan verifies your identity and initiates the session."
                            },
                            {
                                icon: Zap,
                                step: "03",
                                title: "Deployment",
                                desc: "Real-time navigation takes you directly to your reserved slot with zero wait time."
                            },
                            {
                                icon: CreditCard,
                                step: "04",
                                title: "Extraction",
                                desc: "Drive out anytime. Our invisible payment rail handles the delta automatically."
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="relative group"
                            >
                                <div className="relative z-10 space-y-8 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl group-hover:border-primary/20 transition-all group-hover:-translate-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="w-16 h-16 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-900 group-hover:bg-primary group-hover:text-white transition-all">
                                            <feature.icon className="w-7 h-7" />
                                        </div>
                                        <span className="text-4xl font-black text-slate-100 group-hover:text-primary/10 transition-colors uppercase italic">{feature.step}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black mb-4 text-slate-900 tracking-tight">{feature.title}</h3>
                                        <p className="text-sm text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Smart Statistics Grid */}
            <section id="pricing" className="py-24 bg-white scroll-mt-20">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-10">
                        <div className="p-12 rounded-[4rem] bg-slate-900 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -rotate-45" />
                            <h2 className="text-4xl font-black mb-10 tracking-tighter leading-none">Environmental <br />Savings Protocol</h2>
                            <div className="grid grid-cols-2 gap-8 relative z-10">
                                <div className="space-y-2">
                                    <p className="text-5xl font-black text-primary italic">-{stats.saving.toFixed(1)}%</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Carbon Emission Delta</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-5xl font-black text-white">4.2M</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fuel Liters Retained</p>
                                </div>
                            </div>
                        </div>

                        <div id="fleet" className="p-12 rounded-[4rem] bg-primary text-white flex flex-col justify-between scroll-mt-20">
                            <div className="flex items-center gap-6">
                                <Globe className="w-12 h-12 opacity-50" />
                                <h2 className="text-3xl font-black tracking-tighter italic">Global Scalability</h2>
                            </div>
                            <p className="text-xl font-bold opacity-80 leading-relaxed max-w-sm">
                                Deploying 150+ new nodes weekly across major Asian and European hubs.
                            </p>
                            <Button variant="secondary" className="w-fit h-14 px-8 rounded-2xl font-black text-primary uppercase tracking-widest mt-8">
                                Partner with us
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Final Protocol */}
            <section className="py-40 relative">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="bg-slate-950 rounded-[5rem] p-16 md:p-24 text-center text-white relative overflow-hidden shadow-[0_80px_100px_-20px_rgba(0,0,0,0.5)] border border-white/5"
                    >
                        {/* High-Tech Grid Pattern */}
                        <div className="absolute inset-0 opacity-10"
                            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}
                        />

                        <div className="relative z-10 max-w-3xl mx-auto space-y-12">
                            <div className="inline-block px-6 py-2 rounded-full border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                                System Status: Operational
                            </div>

                            <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9] italic">
                                SECURE YOUR <br />SPACE IN THE FUTURE
                            </h2>

                            <p className="text-lg text-white/50 font-medium max-w-xl mx-auto leading-relaxed">
                                Join the network and experience the absolute apex of smart city infrastructure.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                                <Button
                                    size="xl"
                                    className="h-20 px-12 rounded-3xl bg-primary hover:bg-primary/90 text-white font-black text-lg uppercase tracking-widest shadow-2xl shadow-primary/20 active:scale-95 transition-all"
                                    onClick={() => navigate('/auth')}
                                >
                                    Initiate Deployment
                                </Button>
                                <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-white/40">
                                    <Shield className="w-5 h-5 text-primary" />
                                    No Subscription Required
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer Advanced */}
            <footer className="bg-white border-t border-slate-100 py-20 relative z-10">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-16 mb-20">
                        <div className="col-span-2 space-y-8">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
                                    <Car className="w-7 h-7" />
                                </div>
                                <span className="text-2xl font-black tracking-tighter text-slate-900">SMART PARK™</span>
                            </div>
                            <p className="text-slate-500 font-medium max-w-sm leading-relaxed">
                                Redefining the intersection of urban mobility and spatial intelligence.
                                Built for the cities of 2030, today.
                            </p>
                        </div>

                        {['Platform', 'Company'].map(title => (
                            <div key={title} className="space-y-6">
                                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">{title}</h4>
                                <ul className="space-y-4">
                                    {['System Logs', 'Nodes', 'Security', 'Privacy'].map(link => (
                                        <li key={link}>
                                            <a href="#" className="text-sm font-bold text-slate-400 hover:text-primary transition-colors underline-offset-4 hover:underline">{link}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">© 2024 SMART PARK SOLUTIONS LTD. ALL RIGHTS SECURED.</p>
                        <div className="flex gap-10">
                            {['X', 'INSTAGRAM', 'LINKEDIN'].map(social => (
                                <a key={social} href="#" className="text-[10px] font-black text-slate-900 hover:text-primary transition-colors tracking-widest">{social}</a>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>

            <style>{`
                html {
                    scroll-behavior: smooth;
                }
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .perspective-1000 {
                    perspective: 1000px;
                }
            `}</style>
        </div>
    );
}
