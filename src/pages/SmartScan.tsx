import { useNavigate } from 'react-router-dom';
import { LPRScanner } from '@/components/parking/LPRScanner';
import { useParking } from '@/contexts/ParkingContext';
import { useToast } from '@/hooks/use-toast';

export default function SmartScan() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { setVehicles, vehicles } = useParking();

    const handleScan = (plateNumber: string) => {
        // Create new vehicle object
        const newVehicle = {
            id: Math.random().toString(36).substr(2, 9),
            user_id: 'demo',
            number: plateNumber,
            type: 'car' as const,
            created_at: new Date().toISOString()
        };

        // Add to global state
        const updatedVehicles = [newVehicle, ...vehicles];
        setVehicles(updatedVehicles);
        localStorage.setItem('parking_vehicles', JSON.stringify(updatedVehicles));

        toast({
            title: "Vehicle Link Successful",
            description: `${plateNumber} has been added to your profile.`,
        });

        // Navigate to Find Parking so they can book immediately
        navigate('/find-parking');
    };

    return (
        <LPRScanner
            onScan={handleScan}
            onClose={() => navigate(-1)}
        />
    );
}
