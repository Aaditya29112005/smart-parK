import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, History as HistoryIcon, Car } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { HistoryCard } from '@/components/parking/HistoryCard';
import { useParking } from '@/contexts/ParkingContext';

export default function HistoryPage() {
  const navigate = useNavigate();
  const { history, setHistory, user, setUser } = useParking();

  useEffect(() => {
    // Load history
    const savedHistory = localStorage.getItem('parking_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, [setHistory]);

  const totalSpent = history.reduce((acc, s) => acc + (s.amount || 0), 0);
  const totalSessions = history.length;

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
            <h1 className="text-2xl font-bold">Parking History</h1>
            <p className="text-primary-foreground/80 text-sm mt-1">
              View all your past parking sessions
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{totalSessions}</p>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
              </div>
              <div className="text-center border-l border-border">
                <p className="text-2xl font-bold text-success">₹{totalSpent.toFixed(0)}</p>
                <p className="text-sm text-muted-foreground">Total Spent</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* History List */}
      <div className="px-4 space-y-3 pb-6">
        {history.length > 0 ? (
          history.map((session, index) => (
            <HistoryCard key={session.id} session={session} index={index} />
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <HistoryIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">No History Yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start parking to see your history here
              </p>
              <Button variant="default" onClick={() => navigate('/home')}>
                <Car className="w-4 h-4 mr-2" />
                Start Parking
              </Button>
            </Card>
          </motion.div>
        )}
      </div>
    </MobileLayout>
  );
}
