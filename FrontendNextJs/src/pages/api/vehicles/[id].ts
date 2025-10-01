import type { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@/lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid vehicle ID' });
  }

  try {
    if (req.method === 'GET') {
      // Get vehicle by ID with its reservations
      const vehicleResult = await sql(
        'SELECT * FROM vehicles WHERE id = $1',
        [id]
      );

      if (vehicleResult.length === 0) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }

      const vehicle = vehicleResult[0];

      // Get all reservations for this vehicle
      const reservationsResult = await sql(
        'SELECT * FROM reservations WHERE vehicle_id = $1 ORDER BY start_date ASC',
        [id]
      );

      const vehicleWithReservations = {
        ...vehicle,
        reservations: reservationsResult
      };

      return res.status(200).json(vehicleWithReservations);
    }

    if (req.method === 'PUT') {
      // Update vehicle
      const { name, description, retail_price, mileage, vehicle_type, make, images } = req.body;

      const rows = await sql(
        `UPDATE vehicles
        SET
          name = COALESCE($1, name),
          description = COALESCE($2, description),
          retail_price = COALESCE($3, retail_price),
          mileage = COALESCE($4, mileage),
          vehicle_type = COALESCE($5, vehicle_type),
          make = COALESCE($6, make),
          images = COALESCE($7, images)
        WHERE id = $8
        RETURNING *`,
        [name, description, retail_price, mileage, vehicle_type, make, images, id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }

      return res.status(200).json(rows[0]);
    }

    if (req.method === 'DELETE') {
      // Delete vehicle
      const rows = await sql(
        'DELETE FROM vehicles WHERE id = $1 RETURNING *',
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }

      return res.status(200).json({ message: 'Vehicle deleted successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Vehicle API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
