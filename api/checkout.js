// api/checkout.js — Chundra
// Vercel serverless function (compatible with static/Other preset).
// Creates a Stripe Checkout session and returns the redirect URL.
//
// Setup in Vercel dashboard:
//   Settings → Environment Variables → add STRIPE_SECRET_KEY = sk_live_xxxx (or sk_test_ for testing)

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const BASE_URL = process.env.BASE_URL || 'https://www.chundra.site';

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Parse body — Vercel may pass it as string or object depending on config
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'Invalid JSON' }); }
  }

  const { items, shippingCost, zone, shippingLabel, deliveryMethod } = body || {};

  console.log('Checkout request:', { zone, deliveryMethod, shippingCost, shippingLabel });

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'No items in cart' });
  }

  try {
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
          metadata: { chundra_id: item.id },
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: 1,
    }));

    // Add shipping as line item if cost is known
    if (shippingCost && shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: shippingLabel || `Shipping to ${zone}`,
          },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    const isInpost = deliveryMethod === 'inpost';
    console.log('isInpost:', isInpost);

    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${BASE_URL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${BASE_URL}/index.html`,
      phone_number_collection: { enabled: true },
      metadata: {
        zone: zone || '',
        delivery_method: deliveryMethod || 'correos',
        items: items.map(i => i.id).join(','),
        shipping_needs_confirmation: shippingCost === null ? 'true' : 'false',
      },
    };

    if (isInpost) {
      // Inpost: collect pickup point address via custom fields, skip standard shipping address
      sessionConfig.custom_fields = [
        {
          key: 'inpost_pickup_point',
          label: { type: 'custom', custom: 'Inpost pickup point address' },
          type: 'text',
          optional: false,
        },
        {
          key: 'inpost_pickup_city',
          label: { type: 'custom', custom: 'City of pickup point' },
          type: 'text',
          optional: false,
        },
      ];
      sessionConfig.custom_text = {
        submit: {
          message: 'Find your nearest Inpost point at inpost.es (Spain) or inpost.eu (other countries). Enter the full address of your chosen pickup point above.',
        },
      };
      // Still need a billing address for the card — but not full shipping form
      sessionConfig.billing_address_collection = 'required';
    } else {
      // Home delivery: standard shipping address collection
      sessionConfig.shipping_address_collection = {
        allowed_countries: [
          'ES','FR','DE','IT','PT','GB','NL','BE','AT','SE','NO','DK','FI','PL',
          'CH','IE','CZ','HU','RO','GR','HR','SK','SI','BG','EE','LV','LT',
          'US','CA','AU','NZ','JP','MX','BR','AR','CL','CO',
        ],
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return res.status(200).json({ url: session.url });

  } catch (err) {
    console.error('Stripe error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};