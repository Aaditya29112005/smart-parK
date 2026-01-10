import React, { useState, useEffect } from 'react';
import { Mic, MicOff, X, Command } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface VoiceAssistantProps {
    onCommand: (text: string) => void;
}

export function VoiceAssistant({ onCommand }: VoiceAssistantProps) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isSupported, setIsSupported] = useState(true);

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            setIsSupported(false);
        }
    }, []);

    const toggleListening = () => {
        if (!isSupported) {
            toast.error("Voice control not supported in this browser");
            return;
        }

        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    const startListening = () => {
        setIsListening(true);
        // @ts-ignore
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        let finalTranscript = '';

        recognition.onstart = () => {
            setTranscript("Listening...");
        };

        recognition.onresult = (event: any) => {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript = event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            setTranscript(finalTranscript || interimTranscript);
        };

        recognition.onend = () => {
            setIsListening(false);
            if (finalTranscript) {
                setTranscript("Executing: " + finalTranscript);
                onCommand(finalTranscript);
                toast.success(`AI Executing: "${finalTranscript}"`);
                setTimeout(() => setTranscript(''), 2000);
            } else if (transcript && transcript !== "Listening...") {
                // Fallback for some browsers/cases
                onCommand(transcript);
                toast.success(`Recognized: "${transcript}"`);
                setTimeout(() => setTranscript(''), 2000);
            }
        };

        recognition.onerror = (event: any) => {
            console.error(event.error);
            setIsListening(false);
            setTranscript("Error. Try again.");
        };

        recognition.start();
    };

    const stopListening = () => {
        setIsListening(false);
    };

    if (!isSupported) return null;

    return (
        <>
            <AnimatePresence>
                {isListening && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm"
                    >
                        <div className="bg-background/80 backdrop-blur-xl border border-primary/20 p-4 rounded-2xl shadow-glow flex items-center gap-4">
                            <div className="relative">
                                <div className="w-3 h-3 bg-primary rounded-full animate-ping absolute" />
                                <div className="w-3 h-3 bg-primary rounded-full relative" />
                            </div>
                            <span className="font-medium text-lg text-primary">{transcript || "Listening..."}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleListening}
                className={cn(
                    "fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300",
                    isListening
                        ? "bg-destructive text-white shadow-red-500/50"
                        : "bg-primary text-white shadow-primary/30 hover:shadow-glow"
                )}
            >
                {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </motion.button>
        </>
    );
}
