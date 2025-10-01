import type { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
      // Get all vehicles
      const rows = await sql`
        SELECT * FROM vehicles
        ORDER BY created_at DESC
      `;
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      // Create new vehicle (admin only)
      const { userId } = auth(req);

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { name, description, retail_price, mileage, vehicle_type, make, images } = req.body;

      if (!name || !retail_price || !mileage || !vehicle_type || !make) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const rows = await sql(
        'INSERT INTO vehicles (name, description, retail_price, mileage, vehicle_type, make, images) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [name, description, retail_price, mileage, vehicle_type, make, images || []]
      );

      return res.status(201).json(rows[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Vehicle API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
