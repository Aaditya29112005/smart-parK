import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface ParkingTimerProps {
  startTime: string;
}

export function ParkingTimer({ startTime }: ParkingTimerProps) {
  const [elapsed, setElapsed] = useState('00:00:00');
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const updateTimer = () => {
      const start = new Date(startTime).getTime();
      const now = Date.now();
      const diffInSeconds = Math.floor((now - start) / 1000);
      setSeconds(diffInSeconds);

      const hours = Math.floor(diffInSeconds / 3600);
      const minutes = Math.floor((diffInSeconds % 3600) / 60);
      const secs = diffInSeconds % 60;

      setElapsed(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative"
    >
      {/* Pulse rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-48 h-48 rounded-full bg-primary/20"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-40 h-40 rounded-full bg-primary/30"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
      </div>

      {/* Timer display */}
      <div className="relative w-48 h-48 rounded-full gradient-primary flex flex-col items-center justify-center shadow-glow">
        <Clock className="w-6 h-6 text-primary-foreground/80 mb-2" />
        <span className="text-4xl font-bold text-primary-foreground font-mono tracking-wider">
          {elapsed}
        </span>
        <span className="text-sm text-primary-foreground/80 mt-1">Duration</span>
      </div>
    </motion.div>
  );
}
