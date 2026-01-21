import { Users, Package, Repeat2 } from 'lucide-react';
import { StatCard } from './stat-card';

type NetworkStatsGridProps = {
  championYear: number;
  mostClientsName: string;
  mostClientsPhone: string | null;
  clientCount: number;
  mostOrdersName: string;
  mostOrdersPhone: string | null;
  ordersCount: number;
  loyaltyName: string;
  loyaltyPhone: string | null;
  loyaltyRatio: string;
  loyaltyReturnClients: number;
};

export function NetworkStatsGrid({
  championYear,
  mostClientsName,
  mostClientsPhone,
  clientCount,
  mostOrdersName,
  mostOrdersPhone,
  ordersCount,
  loyaltyName,
  loyaltyPhone,
  loyaltyRatio,
  loyaltyReturnClients
}: NetworkStatsGridProps) {
  return (
    <div className="mt-8 grid gap-6 md:grid-cols-3">
      <StatCard
        icon={Users}
        title={`Most Unique Clients (${championYear})`}
        primary={mostClientsName ?? 'N/A'}
        secondary={`Clients: ${clientCount ?? 0}`}
        meta={mostClientsPhone ?? 'N/A'}
        className="bg-background"
      />
      <StatCard
        icon={Package}
        title={`Most Orders (${championYear})`}
        primary={mostOrdersName ?? 'N/A'}
        secondary={`Orders: ${ordersCount ?? 0}`}
        meta={mostOrdersPhone ?? 'N/A'}
        className="bg-background"
      />
      <StatCard
        icon={Repeat2}
        title={`Best Loyalty Rate (${championYear})`}
        primary={loyaltyName ?? 'N/A'}
        secondary={`Loyalty: ${loyaltyRatio} • Returning clients: ${loyaltyReturnClients}`}
        meta={loyaltyPhone ?? 'N/A'}
        className="bg-background"
      />
    </div>
  );
}
