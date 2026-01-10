import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Car, ArrowRight, Loader2, User, Sparkles, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useParking } from '@/contexts/ParkingContext';
import { signIn, signUp } from '@/services/authService';
import { useMotionValue, useSpring } from 'framer-motion';

// --- Sophisticated UI Utility Components ---

const Noise = () => (
  <div className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none mix-blend-overlay z-50"
    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
);

const Magnetic = ({ children }: { children: React.ReactNode }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const mouseX = useSpring(x, springConfig);
  const mouseY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set(clientX - centerX);
    y.set(clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: mouseX, y: mouseY }}
    >
      {children}
    </motion.div>
  );
};

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser } = useParking();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // Real Supabase sign in
        const { user } = await signIn(email, password);
        setUser({ id: user.id, email: user.email! });
        toast({
          title: 'Welcome back! 👋',
          description: `Logged in as ${email}`,
        });
        navigate('/home');
      } else {
        // Real Supabase sign up
        await signUp(email, password, fullName);
        toast({
          title: 'Account created! 🎉',
          description: 'Please check your email to verify your account',
        });
        // Auto sign in after signup
        const { user } = await signIn(email, password);
        setUser({ id: user.id, email: user.email! });
        navigate('/home');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Authentication failed',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative h-[280px] flex flex-col justify-end px-6 pb-12 overflow-hidden bg-primary">
        {/* Advanced Fluid Mesh Background */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              x: [0, 50, 0],
              y: [0, 30, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[10%] -right-[10%] w-[120%] h-[120%] bg-accent/40 blur-[130px] rounded-full"
          />
          <motion.div
            animate={{
              scale: [1.3, 1, 1.3],
              x: [0, -40, 0],
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[10%] -left-[20%] w-[100%] h-[100%] bg-white/30 blur-[110px] rounded-full"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
        </div>

        <Noise />

        <div className="relative z-10 max-w-lg mx-auto w-full">
          <Magnetic>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-3xl border border-white/20 flex items-center justify-center shadow-2xl relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent group-hover:scale-110 transition-transform duration-500" />
                <Car className="w-7 h-7 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
              </div>
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2 mb-0.5"
                >
                  <Sparkles className="w-3 h-3 text-accent" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Automotive Intelligence</span>
                </motion.div>
                <h1 className="text-3xl font-black text-white tracking-tighter leading-none">Smart Park</h1>
              </div>
            </motion.div>
          </Magnetic>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/80 text-lg font-medium tracking-tight max-w-[280px] leading-tight"
          >
            Digital mobility, <span className="text-white font-black underline decoration-accent/50 underline-offset-4">reimagined</span> for the smart city.
          </motion.p>
        </div>
      </div>

      {/* Form Section */}
      <section className="flex-1 bg-background relative px-6 py-10 md:py-20">
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-stretch justify-center">
          {/* Main User Login Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full max-w-md bg-card/30 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 p-8 shadow-[0_32px_120px_-20px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)] relative overflow-hidden h-full flex flex-col justify-between"
          >
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />

            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-black text-foreground tracking-tighter mb-2">
                  {isLogin ? 'Welcome Back' : 'Join the Network'}
                </h2>
                <p className="text-sm font-bold text-muted-foreground/60 uppercase tracking-widest">
                  {isLogin ? 'Secure Gateway 01' : 'Establish Protocol'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-2"
                  >
                    <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                      Full Name
                    </label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        type="text"
                        placeholder="Identified Passenger"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-12 h-14 bg-white/5 border-white/5 rounded-2xl focus:bg-white/10 focus:border-primary/30 transition-all font-medium"
                        required={!isLogin}
                      />
                    </div>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="space-y-2"
                >
                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                    Secure Email
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      type="email"
                      placeholder="user@smartpark.sys"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-14 bg-white/5 border-white/5 rounded-2xl focus:bg-white/10 focus:border-primary/30 transition-all font-medium"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="space-y-2"
                >
                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                    Access Key
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 h-14 bg-white/5 border-white/5 rounded-2xl focus:bg-white/10 focus:border-primary/30 transition-all font-medium"
                      required
                      minLength={6}
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="pt-2"
                >
                  <Magnetic>
                    <Button
                      type="submit"
                      className="w-full h-14 bg-primary hover:bg-primary/90 rounded-2xl shadow-xl shadow-primary/20 text-white font-black uppercase tracking-[0.2em] group relative overflow-hidden"
                      disabled={isLoading}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      {isLoading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <span className="flex items-center justify-center gap-3">
                          {isLogin ? 'Initiate Link' : 'Register Link'}
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      )}
                    </Button>
                  </Magnetic>
                </motion.div>
              </form>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-xs font-bold text-muted-foreground/60 hover:text-primary uppercase tracking-widest transition-all group"
              >
                {isLogin ? "No session found? " : "Sync already active? "}
                <span className="text-primary font-black group-hover:underline underline-offset-4 decoration-2">
                  {isLogin ? 'Create Profile' : 'Restore Link'}
                </span>
              </button>
            </div>
          </motion.div>

          {/* Admin Login Section - Desktop: Right Side, Mobile: Below */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 }}
            className="w-full max-w-md p-8 md:p-10 rounded-[2.5rem] bg-primary/5 border border-primary/10 text-center relative overflow-hidden group flex flex-col justify-center"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-12 -mt-12" />

            <div className="relative z-10 space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500 shadow-lg border border-primary/20">
                <Shield className="w-7 h-7 text-primary" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-foreground uppercase tracking-tight">
                  Staff Portal
                </h3>
                <div className="w-12 h-1 bg-primary/20 mx-auto rounded-full" />
              </div>

              <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-[240px] mx-auto">
                Exclusive entry for <span className="text-foreground font-bold">Valet Drivers</span>, <span className="text-foreground font-bold">Facility Managers</span>, and <span className="text-foreground font-bold">System Administrators</span>.
              </p>

              <button
                onClick={() => navigate('/admin')}
                className="mt-4 w-full py-4 px-6 rounded-2xl bg-primary/10 border border-primary/20 text-xs font-black text-primary uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center gap-3 group/btn shadow-md"
              >
                Enter Command Center
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </button>

              <div className="pt-4 flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">Secure Admin Network Active</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
