// api/checkout.js — Chundra
// Vercel serverless function.
// Creates a Stripe Checkout session and returns the redirect URL.
//
// Setup:
// 1. In Vercel dashboard → Settings → Environment Variables:
//    STRIPE_SECRET_KEY = sk_live_xxxx  (or sk_test_xxxx for testing)
// 2. Deploy to Vercel — this file at /api/checkout.js is picked up automatically.
// 3. In your Stripe dashboard, set your success/cancel URLs.

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.chundra.site';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { items, shippingCost, zone, shippingLabel } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'No items in cart' });
  }

  try {
    // Build line items for Stripe
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
          metadata: { chundra_id: item.id },
        },
        unit_amount: Math.round(item.price * 100), // cents
      },
      quantity: 1,
    }));

    // Add shipping as a separate line item if cost is known
    if (shippingCost && shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: shippingLabel || `Shipping (${zone})`,
          },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${BASE_URL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${BASE_URL}/index.html`,
      // Collect shipping address from buyer
      shipping_address_collection: {
        allowed_countries: [
          'ES','FR','DE','IT','PT','GB','NL','BE','AT','SE','NO','DK','FI','PL',
          'CH','IE','CZ','HU','RO','GR','HR','SK','SI','BG','EE','LV','LT',
          'US','CA','AU','NZ','JP','MX','BR','AR','CL','CO',
        ],
      },
      metadata: {
        zone,
        items: items.map(i => i.id).join(','),
        shipping_needs_confirmation: shippingCost === null ? 'true' : 'false',
      },
      // Optional: collect phone number
      phone_number_collection: { enabled: true },
    });

    return res.status(200).json({ url: session.url });

  } catch (err) {
    console.error('Stripe error:', err);
    return res.status(500).json({ error: err.message });
  }
}
