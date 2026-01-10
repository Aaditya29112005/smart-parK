import { Navigate } from 'react-router-dom';
import { useParking } from '@/contexts/ParkingContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useParking();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    return <>{children}</>;
}
