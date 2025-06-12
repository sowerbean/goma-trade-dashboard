// CHART ALL ORDERS
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// interface Order {
//   loading_date: string | null; // Expected format: "dd/mm/yyyy"
// }

// interface SupplierEvolutionChartProps {
//   orders: Order[];
// }

// function groupOrdersByMonth(orders: Order[]) {
//   const ordersPerMonth: Record<string, number> = {};

//   orders.forEach(order => {
//     const dateStr = order.loading_date;
//     let key = '0000-00';

//     if (dateStr && dateStr.includes('/')) {
//       const [day, month, year] = dateStr.split('/');
//       if (year && month) {
//         key = `${year}-${month.padStart(2, '0')}`;
//       }
//     }

//     ordersPerMonth[key] = (ordersPerMonth[key] || 0) + 1;
//   });

//   const sortedEntries = Object.entries(ordersPerMonth).sort(([a], [b]) => a.localeCompare(b));
//   return sortedEntries.map(([month, count]) => ({ month, count }));
// }

// export default function SupplierEvolutionChart({ orders }: SupplierEvolutionChartProps) {
//   const data = groupOrdersByMonth(orders);

//   const last = data[data.length - 1]?.count ?? 0;
//   const secondLast = data[data.length - 2]?.count ?? 0;
//   const trendColor = last > secondLast ? "#22c55e" : "#ef4444"; // green or red from Tailwind

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>ORDERS TREND</CardTitle>
//       </CardHeader>
//       <CardContent className="h-80">
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart data={data}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="month" />
//             <YAxis allowDecimals={false} />
//             <Tooltip />
//             <Line
//               type="monotone"
//               dataKey="count"
//               stroke={trendColor}
//               strokeWidth={2}
//               dot={{ r: 4 }}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </CardContent>
//     </Card>
//   );
// }

// JUST THE CURRENT SUPPLIER
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
  supplier_phone_number: string | null;
}

interface SupplierEvolutionChartProps {
  orders: Order[];
  supplierId: string;
}

export default function SupplierEvolutionChart({
  orders,
  supplierId
}: SupplierEvolutionChartProps) {
  const filteredOrders = useMemo(
    () => orders.filter((order) => order.supplier_phone_number === supplierId),
    [orders, supplierId]
  );

  const data = useMemo(() => {
    const ordersPerMonth: Record<string, number> = {};

    filteredOrders.forEach((order) => {
      const dateStr = order.loading_date;
      let key = '0000-00';

      if (dateStr && dateStr.includes('/')) {
        const [day, month, year] = dateStr.split('/');
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
  const trendColor = last > secondLast ? '#22c55e' : '#ef4444'; // green or red

  if (!supplierId || filteredOrders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Orders trend</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No orders found for the selected supplier.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ORDERS TREND</CardTitle>
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
