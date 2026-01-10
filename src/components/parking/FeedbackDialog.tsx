import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Smile, Frown, Meh, Heart, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface FeedbackDialogProps {
    onClose: () => void;
    onSubmit: (rating: number, comment: string) => void;
}

export function FeedbackDialog({ onClose, onSubmit }: FeedbackDialogProps) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const getSentiment = () => {
        if (rating === 5) return { icon: Heart, color: 'text-red-500', label: 'Loved it!' };
        if (rating >= 4) return { icon: Smile, color: 'text-success', label: 'Great experience' };
        if (rating >= 3) return { icon: Meh, color: 'text-warning', label: 'It was okay' };
        if (rating > 0) return { icon: Frown, color: 'text-destructive', label: 'Needs improvement' };
        return { icon: MessageSquare, color: 'text-muted-foreground', label: 'Rate your stay' };
    };

    const Sentiment = getSentiment();

    const handleSubmit = () => {
        if (rating === 0) return;
        setIsSubmitted(true);
        setTimeout(() => {
            onSubmit(rating, comment);
            onClose();
        }, 2000);
    };

    return (
        <Card className="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-[2rem] border-0 shadow-2xl">
            <div className="p-8 text-center">
                <AnimatePresence mode="wait">
                    {!isSubmitted ? (
                        <motion.div
                            key="feedback-form"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="space-y-6"
                        >
                            <div className="flex flex-col items-center gap-3 mb-4">
                                <div className={cn("w-16 h-16 rounded-3xl bg-muted/30 flex items-center justify-center transition-colors duration-500", Sentiment.color)}>
                                    <Sentiment.icon className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-black tracking-tight">{Sentiment.label}</h3>
                            </div>

                            <div className="flex items-center justify-center gap-2 mb-2">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <motion.button
                                        key={s}
                                        whileHover={{ scale: 1.2 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setRating(s)}
                                        onMouseEnter={() => setHover(s)}
                                        onMouseLeave={() => setHover(0)}
                                        className="relative p-1 focus:outline-none"
                                    >
                                        <Star
                                            className={cn(
                                                "w-10 h-10 transition-colors duration-200 stroke-[1.5px]",
                                                (hover || rating) >= s
                                                    ? "fill-primary text-primary shadow-glow-sm"
                                                    : "text-muted-foreground/30 fill-transparent"
                                            )}
                                        />
                                        {(hover || rating) >= s && (
                                            <motion.div
                                                layoutId="glow"
                                                className="absolute inset-0 bg-primary/20 blur-xl rounded-full -z-10"
                                            />
                                        )}
                                    </motion.button>
                                ))}
                            </div>

                            <div className="space-y-2 text-left">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Tell us more</label>
                                <Textarea
                                    placeholder="Any issues or suggestions?"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="rounded-2xl bg-muted/30 border-0 resize-none h-24 focus:ring-primary/20"
                                />
                            </div>

                            <Button
                                onClick={handleSubmit}
                                disabled={rating === 0}
                                className="w-full h-14 rounded-2xl gradient-primary text-white font-black uppercase tracking-widest shadow-glow-sm disabled:opacity-50"
                            >
                                <Send className="w-5 h-5 mr-3" />
                                Send Feedback
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="py-12 flex flex-col items-center gap-6"
                        >
                            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', damping: 12 }}
                                >
                                    <Heart className="w-12 h-12 text-success fill-success" />
                                </motion.div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black">Thank You!</h3>
                                <p className="text-sm text-muted-foreground font-medium">Your feedback helps us drive better.</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Card>
    );
}
