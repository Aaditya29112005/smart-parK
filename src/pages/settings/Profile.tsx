import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Camera, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useParking } from '@/contexts/ParkingContext';

export default function ProfilePage() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user, setUser } = useParking();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.email?.split('@')[0] || '',
                email: user.email || '',
                phone: '+91 98765 43210', // Mock data
            });
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            // Update local context/storage
            const updatedUser = { ...user, email: formData.email, id: user?.id || '' };
            setUser(updatedUser);
            localStorage.setItem('parking_user', JSON.stringify(updatedUser)); // Basic update

            toast({
                title: "Profile Updated",
                description: "Your changes have been saved successfully.",
            });
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-primary/5 px-6 pt-8 pb-6">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(-1)}
                    className="mb-4"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-2xl font-bold">Edit Profile</h1>
            </div>

            <div className="px-6 -mt-6">
                <Card className="p-6">
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-4xl font-bold text-primary mb-2 overflow-hidden border-4 border-background shadow-xl">
                                {formData.name.charAt(0).toUpperCase()}
                            </div>
                            <button className="absolute bottom-2 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">Tap to change photo</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Save Changes
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
}
