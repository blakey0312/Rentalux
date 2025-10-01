import { neon } from '@neondatabase/serverless';

// Initialize Neon connection
export const sql = neon(process.env.DATABASE_URL!);

// Vehicle type definition matching the schema
export type Vehicle = {
  id: string;
  name: string;
  description: string | null;
  retail_price: number;
  mileage: number;
  vehicle_type: string;
  make: string;
  images: string[];
  created_at: Date;
  updated_at: Date;
};

// Reservation type definition matching the schema
export type Reservation = {
  id: string;
  customer_id: string;
  vehicle_id: string;
  start_date: string;
  end_date: string;
  payed: boolean;
  stripe_session_id: string | null;
  created_at: Date;
  updated_at: Date;
};

// Vehicle with associated reservations
export type VehicleWithReservations = Vehicle & {
  reservations: Reservation[];
};
