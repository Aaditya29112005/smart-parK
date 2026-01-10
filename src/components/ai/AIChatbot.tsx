import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';

interface Message {
    id: string;
    type: 'bot' | 'user';
    text: string;
    timestamp: Date;
}

const INITIAL_MESSAGE: Message = {
    id: '1',
    type: 'bot',
    text: "Hello! I'm your AI Parking Assistant. How can I help you today?",
    timestamp: new Date(),
};

const KNOWLEDGE_BASE = {
    default: "I'm not sure about that, but I can help you find a parking spot, check rates, or view your history.",
    rates: "Our rates are dynamically calculated based on demand. Currently: Cars ₹40/hr, Bikes ₹20/hr.",
    park: "To park, simply click 'Add Vehicle' on the home screen, select your vehicle, and choose a slot. Or use our new 'Smart Scan' feature!",
    history: "You can view your past parking sessions in the 'History' tab found in the bottom menu.",
    lost: "If you can't find your vehicle, check the 'Active Parking' section for the slot number. I can also trigger the 'Find My Car' alarm if needed.",
    scan: "Our Smart Scan feature uses AI to recognize your vehicle details automatically. Give it a try from the Home screen!",
};

export function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            type: 'user',
            text: inputValue,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI processing
        setTimeout(() => {
            let botResponse = KNOWLEDGE_BASE.default;
            const lowerInput = userMsg.text.toLowerCase();

            if (lowerInput.includes('price') || lowerInput.includes('rate') || lowerInput.includes('cost')) {
                botResponse = KNOWLEDGE_BASE.rates;
            } else if (lowerInput.includes('park') || lowerInput.includes('book')) {
                botResponse = KNOWLEDGE_BASE.park;
            } else if (lowerInput.includes('history') || lowerInput.includes('past')) {
                botResponse = KNOWLEDGE_BASE.history;
            } else if (lowerInput.includes('find') || lowerInput.includes('lost') || lowerInput.includes('where')) {
                botResponse = KNOWLEDGE_BASE.lost;
            } else if (lowerInput.includes('scan') || lowerInput.includes('camera')) {
                botResponse = KNOWLEDGE_BASE.scan;
            }

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                type: 'bot',
                text: botResponse,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, botMsg]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-4 z-50 w-[350px] max-w-[calc(100vw-32px)] shadow-2xl"
                    >
                        <Card className="overflow-hidden border-primary/20 flex flex-col h-[500px] backdrop-blur-xl bg-background/95 supports-[backdrop-filter]:bg-background/80">
                            {/* Header */}
                            <div className="p-4 bg-primary text-primary-foreground flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-primary-foreground/10 rounded-full">
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm">Parking Assistant</h3>
                                        <p className="text-xs text-primary-foreground/70 flex items-center gap-1">
                                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                            Online
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-primary-foreground hover:bg-primary-foreground/20 h-8 w-8"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Messages */}
                            <ScrollArea className="flex-1 p-4">
                                <div className="space-y-4">
                                    {messages.map((msg) => (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : ''
                                                }`}
                                        >
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.type === 'user'
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-accent text-accent-foreground'
                                                    }`}
                                            >
                                                {msg.type === 'user' ? (
                                                    <User className="w-4 h-4" />
                                                ) : (
                                                    <Bot className="w-4 h-4" />
                                                )}
                                            </div>
                                            <div
                                                className={`p-3 rounded-2xl text-sm max-w-[80%] ${msg.type === 'user'
                                                        ? 'bg-primary text-primary-foreground rounded-tr-sm'
                                                        : 'bg-accent/50 text-foreground rounded-tl-sm'
                                                    }`}
                                            >
                                                {msg.text}
                                            </div>
                                        </motion.div>
                                    ))}
                                    {isTyping && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex gap-3"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center shrink-0">
                                                <Bot className="w-4 h-4" />
                                            </div>
                                            <div className="bg-accent/50 p-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
                                                <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" />
                                            </div>
                                        </motion.div>
                                    )}
                                    <div ref={scrollRef} />
                                </div>
                            </ScrollArea>

                            {/* Input */}
                            <div className="p-4 border-t bg-background/50">
                                <form
                                    onSubmit={handleSendMessage}
                                    className="flex items-center gap-2"
                                >
                                    <Input
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="Ask anything..."
                                        className="flex-1"
                                    />
                                    <Button
                                        type="submit"
                                        size="icon"
                                        disabled={!inputValue.trim() || isTyping}
                                    >
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </form>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
            >
                <MessageSquare className="w-6 h-6" />
            </motion.button>
        </>
    );
}
