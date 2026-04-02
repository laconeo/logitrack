export type PackageStatus = 'Pickup Solicitado' | 'En Camino a Recolección' | 'Recogido' | 'En Depósito' | 'En Distribución' | 'Entregado' | 'Intento Fallido' | 'Reprogramado' | 'Devuelto';

export interface Package {
  id: string;
  tracking_number: string;
  status: PackageStatus;
  address: string;
  recipient: string;
  created_at: string;
  updated_at: string;
}

export type PickupStatus = 'Pendiente' | 'Asignado' | 'Completado';

export interface Pickup {
  id: string;
  date: string;
  time_range: string;
  address: string;
  packages_count: number;
  status: PickupStatus;
  created_at: string;
}

export interface Invoice {
  id: string;
  period: string;
  amount: number;
  status: 'Pendiente de Pago' | 'Pagada';
  due_date: string;
}
