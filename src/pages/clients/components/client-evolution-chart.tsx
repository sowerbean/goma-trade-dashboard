import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { useMemo } from 'react';

interface Order {
  loading_date: string | null;
  client_id: string | null;
}

interface ClientOrdersEvolutionChartProps {
  orders: Order[];
  clientId: string;
}

export default function ClientOrdersEvolutionChart({
  orders,
  clientId
}: ClientOrdersEvolutionChartProps) {
  const filteredOrders = useMemo(
    () => orders.filter((order) => order.client_id === clientId),
    [orders, clientId]
  );

  const data = useMemo(() => {
    const ordersPerMonth: Record<string, number> = {};

    filteredOrders.forEach((order) => {
      const dateStr = order.loading_date;
      let key = '0000-00';

      if (dateStr && dateStr.includes('/')) {
        const [, month, year] = dateStr.split('/');
        if (year && month) {
          key = `${year}-${month.padStart(2, '0')}`;
        }
      }

      ordersPerMonth[key] = (ordersPerMonth[key] || 0) + 1;
    });

    return Object.entries(ordersPerMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({ month, count }));
  }, [filteredOrders]);

  const last = data[data.length - 1]?.count ?? 0;
  const secondLast = data[data.length - 2]?.count ?? 0;
  const trendColor = last > secondLast ? '#22c55e' : '#ef4444';

  if (!clientId || filteredOrders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Client Orders Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No orders found for the selected client.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders evolution</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke={trendColor}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
