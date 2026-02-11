import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'stream/consumers';
import Stripe from 'stripe';
import { sql } from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16',
});

const handleSuccessfulPayment = async (reservation: any, sessionId: string) => {
  try {
    // Update reservation in Neon database
    await sql(
      'UPDATE reservations SET payed = $1, stripe_session_id = $2 WHERE id = $3',
      [true, sessionId, reservation.id]
    );

    console.log(`Reservation ${reservation.id} marked as paid`);
  } catch (error) {
    console.error('Error updating reservation:', error);
    throw error;
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
}

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = await buffer(req);
  const signature = req.headers['stripe-signature']!;

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body.toString(),
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    res.status(400).send(`Webhook Error: ${err.message}`)
    return
  }

  if (event.type === "checkout.session.completed") {
    // Retrieve the reservation details from Stripe metadata
    const session = event.data.object as Stripe.Checkout.Session;
    const reservationString = session.metadata?.reservation;

    if (!reservationString) {
      console.error('No reservation data in Stripe session metadata');
      res.status(400).json({ error: 'No reservation data' });
      return;
    }

    const reservation = JSON.parse(reservationString);

    await handleSuccessfulPayment(reservation, session.id);
    res.status(200).json({ message: `Reservation ${reservation.id} processed` })
  }
  else {
    res.status(200).json({ message: `Event type ${event.type} received` })
  }
}

export default webhookHandler;
