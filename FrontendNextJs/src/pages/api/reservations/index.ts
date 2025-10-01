import type { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
      // Get all reservations (admin) or filter by customer
      const { userId } = auth(req);

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { customerId } = req.query;

      if (customerId && typeof customerId === 'string') {
        // Get reservations for specific customer
        const rows = await sql(
          `SELECT r.*, v.name as vehicle_name, v.images as vehicle_images
          FROM reservations r
          LEFT JOIN vehicles v ON r.vehicle_id = v.id
          WHERE r.customer_id = $1
          ORDER BY r.start_date DESC`,
          [customerId]
        );
        return res.status(200).json(rows);
      }

      // Get all reservations (admin view)
      const rows = await sql`
        SELECT r.*, v.name as vehicle_name, v.images as vehicle_images
        FROM reservations r
        LEFT JOIN vehicles v ON r.vehicle_id = v.id
        ORDER BY r.created_at DESC
      `;
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      // Create new reservation
      const { userId } = auth(req);

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { vehicle_id, start_date, end_date, customer_id } = req.body;

      if (!vehicle_id || !start_date || !end_date) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Use authenticated user ID if customer_id not provided
      const customerId = customer_id || userId;

      // Check if vehicle exists
      const vehicleCheck = await sql(
        'SELECT id FROM vehicles WHERE id = $1',
        [vehicle_id]
      );

      if (vehicleCheck.length === 0) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }

      // Check for overlapping reservations
      const overlapCheck = await sql(
        `SELECT id FROM reservations
        WHERE vehicle_id = $1
        AND (
          (start_date <= $2 AND end_date >= $3)
        )`,
        [vehicle_id, end_date, start_date]
      );

      if (overlapCheck.length > 0) {
        return res.status(409).json({ error: 'Vehicle is not available for selected dates' });
      }

      const rows = await sql(
        'INSERT INTO reservations (customer_id, vehicle_id, start_date, end_date, payed) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [customerId, vehicle_id, start_date, end_date, false]
      );

      return res.status(201).json(rows[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Reservation API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
