import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMemo } from 'react';

interface Order {
  client_id: string | null;
  supplier_phone_number: string | null;
  supplier_name: string | null;
  loading_date: string | null; // Expected format: "dd/mm/yyyy"
}

interface ClientSuppliersTableProps {
  orders: Order[];
  clientId: string;
  onViewSupplier?: (supplierPhone: string) => void; // Optional action callback
}

export default function ClientSuppliersTable({
  orders,
  clientId,
  onViewSupplier
}: ClientSuppliersTableProps) {
  const data = useMemo(() => {
    const supplierMap: Record<
      string,
      {
        supplier_name: string;
        total_orders: number;
        loading_dates: string[];
      }
    > = {};

    orders
      .filter(
        (order) => order.client_id === clientId && order.supplier_phone_number
      )
      .forEach((order) => {
        const phone = order.supplier_phone_number!;
        const name = order.supplier_name ?? 'Unknown';

        if (!supplierMap[phone]) {
          supplierMap[phone] = {
            supplier_name: name,
            total_orders: 0,
            loading_dates: []
          };
        }

        supplierMap[phone].total_orders += 1;
        if (order.loading_date) {
          supplierMap[phone].loading_dates.push(order.loading_date);
        }
      });

    return Object.entries(supplierMap).map(([phone, info]) => {
      const sortedDates = info.loading_dates.sort((a, b) => {
        const [da, ma, ya] = a.split('/').map(Number);
        const [db, mb, yb] = b.split('/').map(Number);
        return (
          new Date(ya, ma - 1, da).getTime() -
          new Date(yb, mb - 1, db).getTime()
        );
      });

      return {
        supplier_phone_number: phone,
        supplier_name: info.supplier_name,
        total_orders: info.total_orders,
        oldest_order: sortedDates[0] ?? 'N/A',
        latest_order: sortedDates[sortedDates.length - 1] ?? 'N/A'
      };
    });
  }, [orders, clientId]);

  if (!clientId || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Suppliers Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            NO ORDERS found for this client.
          </p>
          <p className="text-sm text-muted-foreground">
            Note that some orders might be found but they are from anonymous
            supplier they cant appear in this table
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Suppliers that received orders from this Client</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="px-4 py-2">Supplier Phone</th>
              <th className="px-4 py-2">Supplier Name</th>
              <th className="px-4 py-2">Total Orders</th>
              <th className="px-4 py-2">Oldest Order</th>
              <th className="px-4 py-2">Latest Order</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((supplier) => (
              <tr key={supplier.supplier_phone_number} className="border-b">
                <td className="px-4 py-2">{supplier.supplier_phone_number}</td>
                <td className="px-4 py-2">{supplier.supplier_name}</td>
                <td className="px-4 py-2">{supplier.total_orders}</td>
                <td className="px-4 py-2">{supplier.oldest_order}</td>
                <td className="px-4 py-2">{supplier.latest_order}</td>
                <td className="px-4 py-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      onViewSupplier?.(supplier.supplier_phone_number)
                    }
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
