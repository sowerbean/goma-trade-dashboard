import Plot from 'react-plotly.js';
import { useOrderData } from '@/hooks/use-order-data';
import { useMemo } from 'react';

interface OrdersSankeyProps {
  startDate: Date;
  endDate: Date;
  minClientCount: number;
}

function parseDate(dateStr: string | null): Date | null {
  if (!dateStr || !dateStr.includes('/')) return null;
  const [day, month, year] = dateStr.split('/');
  return new Date(`${year}-${month}-${day}`);
}

export default function OrdersSankey({
  startDate,
  endDate,
  minClientCount
}: OrdersSankeyProps) {
  const { data, isLoading } = useOrderData();

  const { nodes, links } = useMemo(() => {
    const suppliersMap = new Map<string, Set<string>>();
    const filteredOrders = (data ?? []).filter((order) => {
      const orderDate = parseDate(order.loading_date);
      return (
        orderDate &&
        orderDate >= startDate &&
        orderDate <= endDate &&
        order.supplier_phone_number &&
        order.client_id
      );
    });

    filteredOrders.forEach((order) => {
      const supplier = order.supplier_phone_number!;
      const client = order.client_id!;
      if (!suppliersMap.has(supplier)) {
        suppliersMap.set(supplier, new Set());
      }
      suppliersMap.get(supplier)!.add(client);
    });

    // Filter suppliers who serve fewer than `minClientCount` clients
    const validSuppliers = [...suppliersMap.entries()]
      .filter(([_, clients]) => clients.size >= minClientCount)
      .map(([supplier]) => supplier);

    const clients = new Set<string>();
    const linksRaw: { source: string; target: string; value: number }[] = [];

    filteredOrders.forEach((order) => {
      const supplier = order.supplier_phone_number!;
      const client = order.client_id!;
      if (!validSuppliers.includes(supplier)) return;

      clients.add(client);
      linksRaw.push({ source: supplier, target: client, value: 1 });
    });

    const supplierArray = validSuppliers;
    const clientArray = Array.from(clients);
    const labels = [...supplierArray, ...clientArray];

    const source = linksRaw.map((link) => labels.indexOf(link.source));
    const target = linksRaw.map((link) => labels.indexOf(link.target));
    const value = linksRaw.map((link) => link.value);

    return {
      nodes: labels,
      links: { source, target, value }
    };
  }, [data, startDate, endDate, minClientCount]);

  if (isLoading) return <p>Loading sankey diagram...</p>;
  if (!nodes.length || !links.source.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No data available in this time frame or for this threshold.
      </p>
    );
  }

  return (
    <Plot
      data={[
        {
          type: 'sankey',
          orientation: 'h',
          node: {
            pad: 15,
            thickness: 20,
            line: { color: 'black', width: 0.5 },
            label: nodes
          },
          link: links
        }
      ]}
      layout={{
        width: 1000,
        height: 500,
        title: 'Supplier → Client Flow',
        font: { size: 12 }
      }}
    />
  );
}
