import { Navigate } from 'react-router-dom';
import { useParking } from '@/contexts/ParkingContext';
import { Loader2 } from 'lucide-react';

export default function AdminProtectedRoute({ children, requireSuperAdmin = false }: { children: React.ReactNode, requireSuperAdmin?: boolean }) {
    const { user, isLoading } = useParking();

    // Check for admin flag in localStorage or context
    const isSuperAdmin = localStorage.getItem('is_super_admin') === 'true' || user?.role === 'super-admin';
    const isAdmin = localStorage.getItem('is_admin') === 'true' || user?.role === 'admin' || isSuperAdmin;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (requireSuperAdmin && !isSuperAdmin) {
        return <Navigate to="/admin" replace />;
    }

    if (!isAdmin) {
        return <Navigate to="/admin/login" replace />;
    }

    return <>{children}</>;
}
