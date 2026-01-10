import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Bell, Shield, HelpCircle, ChevronRight, Moon, Palette, Wallet } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useParking } from '@/contexts/ParkingContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const settingsItems = [
  { icon: User, label: 'Profile', description: 'Manage your account', action: '/settings/profile' },
  { icon: Wallet, label: 'Wallet', description: 'Balance & Transactions', action: '/wallet' },
  { icon: Bell, label: 'Notifications', description: 'Parking reminders & updates', action: '/settings/notifications' },
  { icon: Shield, label: 'Privacy & Security', description: 'Password & permissions', action: '/settings/notifications' },
  { icon: HelpCircle, label: 'Help & Support', description: 'FAQs & contact us', action: '/settings/support' },
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, setUser } = useParking();

  // Removed local auth check in favor of ProtectedRoute

  const handleLogout = () => {
    localStorage.removeItem('parking_user');
    setUser(null);
    toast({ title: 'Logged out successfully' });
    navigate('/auth');
  };

  const handleSettingClick = (action: string) => {
    navigate(action);
  };

  return (
    <MobileLayout>
      {/* Header */}
      <div className="gradient-hero text-primary-foreground px-6 pt-6 pb-6 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary-foreground"
          />
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-primary-foreground/80 text-sm mt-1">
              Manage your preferences
            </p>
          </motion.div>
        </div>
      </div>

      {/* User Card */}
      <div className="px-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center text-2xl text-primary-foreground font-bold">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <p className="font-bold text-foreground capitalize">
                  {user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              <div className="px-3 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                Premium
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Settings List */}
      <div className="px-4 space-y-3 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="divide-y divide-border">
            {settingsItems.map((item, index) => (
              <motion.button
                key={item.action}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                onClick={() => handleSettingClick(item.action)}
                className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </motion.button>
            ))}
          </Card>
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant="outline"
            size="lg"
            className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-2" />
            Log Out
          </Button>
        </motion.div>

        {/* Version */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-muted-foreground pt-4"
        >
          Smart Parking v1.0.0
        </motion.p>
      </div>
    </MobileLayout>
  );
}
