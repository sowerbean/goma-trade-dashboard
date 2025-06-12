import { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { parseDate } from '@/lib/date-parsing-sorting';
import { Order } from '@/types';

interface SupplierClientFidelityTableProps {
  orders: Order[];
  supplierId: string;
}

export default function SupplierClientFidelityTable({
  orders,
  supplierId
}: SupplierClientFidelityTableProps) {
  const [search, setSearch] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const groupedClients = useMemo(() => {
    const filtered = orders.filter(
      (o) => o.supplier_phone_number === supplierId && o.client_id
    );

    const clientsMap: Record<
      string,
      {
        client_id: string;
        client_name: string;
        totalOrders: number;
        oldest: Date;
        latest: Date;
        orders: Order[];
      }
    > = {};

    for (const order of filtered) {
      const date = parseDate(order.loading_date);
      if (!date) continue;

      const id = order.client_id;
      if (!clientsMap[id]) {
        clientsMap[id] = {
          client_id: id,
          client_name: order.client_name,
          totalOrders: 0,
          oldest: date,
          latest: date,
          orders: []
        };
      }
      clientsMap[id].totalOrders++;
      clientsMap[id].orders.push(order);
      if (date < clientsMap[id].oldest) clientsMap[id].oldest = date;
      if (date > clientsMap[id].latest) clientsMap[id].latest = date;
    }

    return Object.values(clientsMap).filter(
      (c) =>
        c.client_name.toLowerCase().includes(search.toLowerCase()) ||
        c.client_id.toLowerCase().includes(search.toLowerCase())
    );
  }, [orders, supplierId, search]);

  const formatDate = (date: Date) =>
    `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clients Fidelity Overview</CardTitle>
        <CardDescription>Grouped by client for this supplier</CardDescription>
        <div className="mt-4">
          <Input
            placeholder="Search by name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-1/2"
          />
        </div>
      </CardHeader>
      <CardContent>
        <table className="min-w-full table-auto text-left text-sm">
          <thead>
            <tr className="border-b font-semibold">
              <th className="px-2 py-1">Client ID</th>
              <th className="px-2 py-1">Client Name</th>
              <th className="px-2 py-1">Total Orders</th>
              <th className="px-2 py-1">Oldest Order</th>
              <th className="px-2 py-1">Latest Order</th>
              <th className="px-2 py-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {groupedClients.map((client, idx) => (
              <tr key={idx} className="border-b">
                <td className="px-2 py-1">{client.client_id}</td>
                <td className="px-2 py-1">{client.client_name}</td>
                <td className="px-2 py-1">{client.totalOrders}</td>
                <td className="px-2 py-1">{formatDate(client.oldest)}</td>
                <td className="px-2 py-1">{formatDate(client.latest)}</td>
                <td className="px-2 py-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedClientId(client.client_id)}
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Modal logic will go here in the next step */}
      </CardContent>
    </Card>
  );
}
