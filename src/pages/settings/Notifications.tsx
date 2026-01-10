import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Calendar, Percent, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function NotificationsPage() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [settings, setSettings] = useState({
        parkingReminders: true,
        paymentAlerts: true,
        promotions: false,
        securityAlerts: true,
    });

    const handleToggle = (key: keyof typeof settings) => {
        setSettings(prev => {
            const newState = { ...prev, [key]: !prev[key] };
            toast({
                title: "Preferences Saved",
                description: "Notification settings updated.",
                duration: 1500,
            });
            return newState;
        });
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="bg-primary/5 px-6 pt-8 pb-6">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mb-4">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-2xl font-bold">Notifications</h1>
            </div>

            <div className="px-6 space-y-4">
                <Card className="p-0 overflow-hidden divide-y">
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-medium">Parking Reminders</h3>
                                <p className="text-xs text-muted-foreground">Alert 15 mins before expiry</p>
                            </div>
                        </div>
                        <Switch
                            checked={settings.parkingReminders}
                            onCheckedChange={() => handleToggle('parkingReminders')}
                        />
                    </div>

                    <div className="p-4 flex items-center justify-between">
                        <div className="flex gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600">
                                <Bell className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-medium">Payment Alerts</h3>
                                <p className="text-xs text-muted-foreground">Receipts and confirmation</p>
                            </div>
                        </div>
                        <Switch
                            checked={settings.paymentAlerts}
                            onCheckedChange={() => handleToggle('paymentAlerts')}
                        />
                    </div>

                    <div className="p-4 flex items-center justify-between">
                        <div className="flex gap-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600">
                                <Percent className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-medium">Promotions</h3>
                                <p className="text-xs text-muted-foreground">Deals and discounts</p>
                            </div>
                        </div>
                        <Switch
                            checked={settings.promotions}
                            onCheckedChange={() => handleToggle('promotions')}
                        />
                    </div>

                    <div className="p-4 flex items-center justify-between">
                        <div className="flex gap-3">
                            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-medium">Security Alerts</h3>
                                <p className="text-xs text-muted-foreground">Account activity & logins</p>
                            </div>
                        </div>
                        <Switch
                            checked={settings.securityAlerts}
                            onCheckedChange={() => handleToggle('securityAlerts')}
                        />
                    </div>
                </Card>
            </div>
        </div>
    );
}
