import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, CreditCard, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Initialize Stripe with the key from env
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface PaymentProps {
    amount: number;
    onSuccess: () => void;
    isProcessing?: boolean;
}

function CheckoutForm({ amount, onSuccess }: PaymentProps) {
    const stripe = useStripe();
    const elements = useElements();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);
        setError(null);

        // In a real app, you would fetch a clientSecret from your backend here
        // const { clientSecret } = await fetch('/create-payment-intent')...

        // For this demo/frontend-only setup, we simulate the backend delay
        // AND use the stripe element validator.

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) return;

        // Use Stripe to create a token/method (even without backend, this validates the card UI)
        const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (stripeError) {
            setError(stripeError.message || 'Payment failed');
            setLoading(false);
            return;
        }

        // Simulate success if Stripe validation passes
        console.log('PaymentMethod created:', paymentMethod);

        setTimeout(() => {
            setLoading(false);
            onSuccess();
        }, 1500);
    };

    const isTestKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY?.includes('pk_test_your-key');

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-background border border-input rounded-lg p-4">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }}
                />
            </div>

            {error && (
                <div className="text-destructive text-sm bg-destructive/10 p-2 rounded">
                    {error}
                </div>
            )}

            {isTestKey && (
                <div className="bg-yellow-100 text-yellow-800 text-xs p-2 rounded flex items-center gap-2">
                    <span className="font-bold">⚠️ Test Mode:</span>
                    Env key is placeholder. Enter any valid-looking card or 4242... to simulate.
                </div>
            )}

            <Button
                type="submit"
                className="w-full h-12 text-lg"
                disabled={!stripe || loading}
                variant="gradient"
            >
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        <Lock className="mr-2 h-4 w-4" />
                        Pay ₹{amount.toFixed(2)}
                    </>
                )}
            </Button>

            <div className="flex justify-center items-center gap-2 text-xs text-muted-foreground">
                <Lock className="w-3 h-3" />
                Secured by Stripe
            </div>
        </form>
    );
}

export function StripePayment(props: PaymentProps) {
    return (
        <Elements stripe={stripePromise}>
            <Card className="p-6">
                <div className="mb-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-primary" />
                        Payment Details
                    </h3>
                    <p className="text-sm text-muted-foreground">Enter your card information</p>
                </div>
                <CheckoutForm {...props} />
            </Card>
        </Elements>
    );
}
