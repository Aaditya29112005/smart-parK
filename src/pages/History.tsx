import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, History as HistoryIcon, Car, Calendar, XCircle } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HistoryCard } from '@/components/parking/HistoryCard';
import { useParking } from '@/contexts/ParkingContext';
import { format } from 'date-fns';

export default function HistoryPage() {
  const navigate = useNavigate();
  const { history, setHistory, bookings, cancelBooking } = useParking();

  useEffect(() => {
    // Load history
    const savedHistory = localStorage.getItem('parking_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, [setHistory]);

  const upcomingBookings = bookings.filter(b => b.status === 'upcoming');

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

      {/* Tabs & Content */}
      <div className="px-4 pb-20">
        <Tabs defaultValue="history" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="history">Past Sessions</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-3">
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
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-3">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-4 border-l-4 border-l-primary relative overflow-hidden">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg">{booking.location_name}</h3>
                        <p className="text-xs text-muted-foreground">{booking.location_address}</p>
                      </div>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        Upcoming
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 my-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-foreground font-medium">{format(new Date(booking.start_time), 'MMM d, p')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Car className="w-4 h-4 text-primary" />
                        <span className="text-foreground font-medium">{booking.vehicle_number}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border/50">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Total: </span>
                        <span className="font-bold">₹{booking.total_price}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 px-2"
                        onClick={() => cancelBooking(booking.id)}
                      >
                        <XCircle className="w-4 h-4 mr-1" /> Cancel
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))
            ) : (
              <Card className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">No Upcoming Bookings</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Schedule a parking spot in advance to save time!
                </p>
                <Button variant="outline" onClick={() => navigate('/find-parking')}>
                  Find Parking
                </Button>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
}
