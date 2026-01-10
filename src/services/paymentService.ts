import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
    if (!stripePromise) {
        const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
        stripePromise = loadStripe(key || '');
    }
    return stripePromise;
};

export interface PaymentIntent {
    clientSecret: string;
    amount: number;
}

// Create payment intent (this would call your backend API)
export async function createPaymentIntent(amount: number): Promise<PaymentIntent> {
    // In production, this would call your backend API
    // For now, returning mock data
    return {
        clientSecret: 'mock_client_secret',
        amount,
    };
}

// Process payment
export async function processPayment(
    amount: number,
    bookingId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const stripe = await getStripe();
        if (!stripe) {
            throw new Error('Stripe failed to load');
        }

        // In production, you would:
        // 1. Call your backend to create payment intent
        // 2. Confirm the payment with Stripe
        // 3. Update booking status

        // Mock successful payment for now
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Payment failed',
        };
    }
}
