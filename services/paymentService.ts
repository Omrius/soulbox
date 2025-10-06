// services/paymentService.ts

/**
 * Simulates creating a Stripe checkout session.
 * In a real application, this would make an API call to your backend.
 * @param priceId The ID of the price plan to purchase.
 */

// Each priceId is now mapped to a unique, valid Stripe test payment link.
// This makes the simulation realistic, as selecting a specific plan
// will now redirect to the correct checkout page for that plan.
const stripeTestPaymentLinks: { [key: string]: string } = {
    'price_standard_monthly': 'https://buy.stripe.com/test_7sI5lf8UPdDb5Pi144',       // Corresponds to a ~€9.99 product
    'price_premium_monthly': 'https://buy.stripe.com/test_bIYg0lg5gfLjdQAaEE',      // Corresponds to a ~€19.99 product
    'price_premium_plus_monthly': 'https://buy.stripe.com/test_dR6eWd5IDdDb4Le000', // Corresponds to a ~€29.99 product
};


export const createCheckoutSession = async (priceId: string): Promise<{ url: string | null }> => {
    console.log(`Creating checkout session for price ID: ${priceId}`);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const url = stripeTestPaymentLinks[priceId];

    // Simulate a successful response if a link is found for the given priceId
    if (url) {
        return { url: url };
    } else {
        // Simulate an error if the priceId is not found
        console.error(`No payment link found for priceId: ${priceId}`);
        return { url: null };
    }
};