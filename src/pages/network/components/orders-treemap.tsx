import { Treemap, Tooltip, ResponsiveContainer } from 'recharts';
import { useOrderData } from '@/hooks/use-order-data';
import { useMemo } from 'react';

interface OrdersTreemapProps {
  startDate: Date;
  endDate: Date;
  minClientCount: number;
}

function parseDate(dateStr: string | null): Date | null {
  if (!dateStr || !dateStr.includes('/')) return null;
  const [day, month, year] = dateStr.split('/');
  return new Date(`${year}-${month}-${day}`);
}

export default function OrdersTreemap({
  startDate,
  endDate,
  minClientCount
}: OrdersTreemapProps) {
  const { data, isLoading } = useOrderData();

  const treeData = useMemo(() => {
    const supplierMap = new Map<string, Map<string, number>>();

    (data ?? []).forEach((order) => {
      const orderDate = parseDate(order.loading_date);
      if (
        !orderDate ||
        orderDate < startDate ||
        orderDate > endDate ||
        !order.supplier_phone_number ||
        !order.client_id
      ) {
        return;
      }

      const supplier = order.supplier_phone_number;
      const client = order.client_name || order.client_id;

      if (!supplierMap.has(supplier)) {
        supplierMap.set(supplier, new Map());
      }

      const clientMap = supplierMap.get(supplier)!;
      clientMap.set(client, (clientMap.get(client) ?? 0) + 1);
    });

    const filteredSuppliers = Array.from(supplierMap.entries())
      .filter(([_, clients]) => clients.size >= minClientCount)
      .map(([supplier, clients]) => ({
        name: supplier,
        children: Array.from(clients.entries()).map(([client, count]) => ({
          name: client,
          size: count
        }))
      }));

    return filteredSuppliers;
  }, [data, startDate, endDate, minClientCount]);

  if (isLoading) return <p>Loading treemap...</p>;

  if (treeData.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No data for this timeframe or threshold.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={500}>
      <Treemap
        data={treeData}
        dataKey="size"
        stroke="#fff"
        fill="#2196F3"
        aspectRatio={4 / 3}
      >
        <Tooltip />
      </Treemap>
    </ResponsiveContainer>
  );
}
