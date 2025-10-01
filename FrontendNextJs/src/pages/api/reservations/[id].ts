import type { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid reservation ID' });
  }

  try {
    if (req.method === 'GET') {
      // Get reservation by ID
      const rows = await sql(
        `SELECT r.*, v.name as vehicle_name, v.images as vehicle_images
        FROM reservations r
        LEFT JOIN vehicles v ON r.vehicle_id = v.id
        WHERE r.id = $1`,
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Reservation not found' });
      }

      return res.status(200).json(rows[0]);
    }

    if (req.method === 'PUT') {
      // Update reservation
      const { userId } = auth(req);

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // First, check if reservation exists and if it's already paid
      const checkResult = await sql(
        'SELECT customer_id, payed, vehicle_id, start_date, end_date FROM reservations WHERE id = $1',
        [id]
      );

      if (checkResult.length === 0) {
        return res.status(404).json({ error: 'Reservation not found' });
      }

      const reservation = checkResult[0];

      // Customers cannot modify paid reservations
      if (reservation.payed && reservation.customer_id === userId) {
        return res.status(403).json({ error: 'Cannot modify paid reservation' });
      }

      const { vehicle_id, start_date, end_date, payed, stripe_session_id } = req.body;

      // Check for overlapping reservations if dates or vehicle changed
      if (vehicle_id || start_date || end_date) {
        const vehicleIdToCheck = vehicle_id || reservation.vehicle_id;
        const startDateToCheck = start_date || reservation.start_date;
        const endDateToCheck = end_date || reservation.end_date;

        const overlapCheck = await sql(
          `SELECT id FROM reservations
          WHERE vehicle_id = $1
          AND id != $2
          AND (
            (start_date <= $3 AND end_date >= $4)
          )`,
          [vehicleIdToCheck, id, endDateToCheck, startDateToCheck]
        );

        if (overlapCheck.length > 0) {
          return res.status(409).json({ error: 'Vehicle is not available for selected dates' });
        }
      }

      const rows = await sql(
        `UPDATE reservations
        SET
          vehicle_id = COALESCE($1, vehicle_id),
          start_date = COALESCE($2, start_date),
          end_date = COALESCE($3, end_date),
          payed = COALESCE($4, payed),
          stripe_session_id = COALESCE($5, stripe_session_id)
        WHERE id = $6
        RETURNING *`,
        [vehicle_id, start_date, end_date, payed, stripe_session_id, id]
      );

      return res.status(200).json(rows[0]);
    }

    if (req.method === 'DELETE') {
      // Delete reservation
      const { userId } = auth(req);

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const rows = await sql(
        'DELETE FROM reservations WHERE id = $1 RETURNING *',
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Reservation not found' });
      }

      return res.status(200).json({ message: 'Reservation deleted successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Reservation API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
