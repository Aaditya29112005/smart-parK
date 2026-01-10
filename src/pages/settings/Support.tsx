import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, ChevronDown, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { useToast } from '@/hooks/use-toast';

export default function SupportPage() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [message, setMessage] = useState('');

    const handleSendMessage = () => {
        if (!message.trim()) return;
        toast({
            title: "Message Sent",
            description: "Our support team will get back to you within 24 hours.",
        });
        setMessage('');
    };

    return (
        <div className="min-h-screen bg-background pb-10">
            <div className="bg-primary/5 px-6 pt-8 pb-6">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mb-4">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-2xl font-bold">Help & Support</h1>
            </div>

            <div className="px-6 space-y-6">
                <section>
                    <h2 className="text-lg font-semibold mb-3">Frequently Asked Questions</h2>
                    <Card className="px-2">
                        <Accordion type="single" collapsible>
                            <AccordionItem value="item-1">
                                <AccordionTrigger className="text-sm">How are parking rates calculated?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-sm">
                                    Rates are calculated hourly based on the vehicle type (Car: ₹40/hr, Bike: ₹20/hr, Truck: ₹60/hr). Billing happens in 30-minute increments.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger className="text-sm">Is my vehicle safe?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-sm">
                                    Yes, all our partner lots are monitored 24/7 with CCTV and on-ground security personnel.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger className="text-sm">How do I request a refund?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-sm">
                                    If you were charged incorrectly, please contact support below with your Receipt # ID.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </Card>
                </section>

                <section>
                    <h2 className="text-lg font-semibold mb-3">Contact Us</h2>
                    <Card className="p-4 space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Topic</label>
                            <Input placeholder="General Inquiry" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Message</label>
                            <Textarea
                                placeholder="Describe your issue..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="min-h-[100px]"
                            />
                        </div>
                        <Button className="w-full" onClick={handleSendMessage}>
                            <Send className="w-4 h-4 mr-2" />
                            Send Message
                        </Button>
                    </Card>
                </section>
            </div>
        </div>
    );
}
