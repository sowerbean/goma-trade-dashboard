import { useOrderData } from '@/hooks/use-order-data';
import { useMemo } from 'react';
import { Order } from '@/types';

interface GroupedSupplierOrdersTable {
  startDate: Date;
  endDate: Date;
  minClients: number;
}

export default function OrdersTableExpandable({
  startDate,
  endDate,
  minClients
}: GroupedSupplierOrdersTable) {
  const { data, isLoading } = useOrderData();

  const filteredSuppliers = useMemo(() => {
    if (!data) return new Map();

    const suppliers = new Map<string, Order[]>();

    data.forEach((order) => {
      const date = new Date(order.loading_date || '');
      if (date < startDate || date > endDate) return;

      const supplier = order.supplier_phone_number;
      if (!suppliers.has(supplier)) {
        suppliers.set(supplier, []);
      }
      suppliers.get(supplier)?.push(order);
    });

    // Only keep suppliers with at least `minClients` distinct clients
    const result = new Map<string, Order[]>();
    for (const [supplier, orders] of suppliers.entries()) {
      const uniqueClients = new Set(orders.map((o) => o.client_id));
      if (uniqueClients.size >= minClients) {
        result.set(supplier, orders);
      }
    }

    return result;
  }, [data, startDate, endDate, minClients]);

  if (isLoading) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Loading table...
      </div>
    );
  }

  if (!filteredSuppliers.size) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No data matches your filters.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Array.from(filteredSuppliers.entries()).map(([supplier, orders]) => (
        <details
          key={supplier}
          className="rounded-md border border-gray-200 px-4 py-2 shadow-sm dark:border-gray-700"
        >
          <summary className="cursor-pointer font-medium text-primary">
            Supplier: <span className="font-semibold">{supplier}</span> (
            {orders.length} orders)
          </summary>
          <ul className="ml-4 mt-2 space-y-1 text-sm text-muted-foreground">
            {orders.map((order) => (
              <li key={order.id}>
                • Client:{' '}
                <span className="font-medium">{order.client_name}</span> (
                {order.client_id}) on {order.loading_date}
              </li>
            ))}
          </ul>
        </details>
      ))}
    </div>
  );
}
