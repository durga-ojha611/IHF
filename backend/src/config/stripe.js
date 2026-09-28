import Stripe from 'stripe';

let stripeInstance = null;

export const getStripe = () => {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';
    stripeInstance = new Stripe(key, {
      apiVersion: '2023-10-16',
    });
  }
  return stripeInstance;
};

export default { getStripe };
