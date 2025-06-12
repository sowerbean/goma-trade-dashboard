import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { parseDate } from '@/lib/date-parsing-sorting';
import { Order } from '@/types';

export default function ClientSummaryCards({
  clientId,
  orders
}: {
  clientId: string | null;
  orders: Order[];
}) {
  const clientOrders = clientId
    ? orders.filter((order) => order.client_id === clientId)
    : [];
  // If needed, handle empty or invalid state
  if (!clientOrders.length) {
    return <p>No data available for client ID: {clientId}</p>;
  }

  //card 1
  const totalOrders = clientOrders.length;
  //card 2
  const uniqueSuppliers = Array.from(
    new Set(clientOrders.map((o) => o.supplier_phone_number).filter(Boolean))
  );

  const supplierStats = clientOrders.reduce(
    (acc, order) => {
      const phone = order.supplier_phone_number;
      if (!phone) return acc;

      if (!acc[phone]) {
        acc[phone] = {
          clients: new Set<string>(),
          dates: [] as (Date | null)[]
        };
      }

      acc[phone].clients.add(order.client_phone_number);
      acc[phone].dates.push(parseDate(order.loading_date));

      return acc;
    },
    {} as Record<string, { clients: Set<string>; dates: (Date | null)[] }>
  );

  const topSupplier = Object.entries(supplierStats).sort(
    (a, b) => b[1].clients.size - a[1].clients.size
  )[0];

  const topSupplierPhone = topSupplier?.[0] ?? 'N/A';
  const topSupplierClientCount = topSupplier?.[1].clients.size ?? 0;

  const topDates =
    topSupplier?.[1].dates
      .filter(Boolean)
      .sort((a, b) => (a && b ? a.getTime() - b.getTime() : 0)) ?? [];

  const oldest = topDates[0]?.toLocaleDateString?.() ?? 'N/A';
  const latest = topDates[topDates.length - 1]?.toLocaleDateString?.() ?? 'N/A';

  return (
    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Orders</CardTitle>
          <CardDescription>{totalOrders}</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Unique Suppliers</CardTitle>
          <CardDescription>{uniqueSuppliers.length}</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Supplier</CardTitle>
          <CardDescription>{topSupplierPhone}</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {topSupplierClientCount} clients
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Supplier Dates</CardTitle>
          <CardDescription>
            {oldest} → {latest}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
