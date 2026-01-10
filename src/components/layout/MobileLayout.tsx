import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Home, History, Settings, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

const navItems = [
  { icon: Home, label: 'Home', path: '/home' },
  { icon: History, label: 'History', path: '/history' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function MobileLayout({ children, showNav = true }: MobileLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      {showNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
          <div className="flex justify-around items-center h-16 max-w-md mx-auto px-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className="relative"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute -inset-2 bg-primary/10 rounded-xl"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                    <item.icon className="w-5 h-5 relative z-10" />
                  </motion.div>
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
