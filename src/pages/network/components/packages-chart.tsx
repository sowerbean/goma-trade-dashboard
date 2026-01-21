import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

type MonthlyPackageData = {
  label: string;
  monthDate: Date;
  packages: number;
};

type PackagesChartProps = {
  data: MonthlyPackageData[];
};

export function PackagesChart({ data }: PackagesChartProps) {
  return (
    <Card className="mt-8 border-muted/40 shadow-sm">
      <CardHeader>
        <CardTitle>Packages Sold Over Time</CardTitle>
        <CardDescription>
          Monthly total number of packages handled by the top supplier
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No package data available.
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip
                  labelStyle={{ color: '#808080' }}
                  formatter={(value: number) => [`${value}`, 'Packages']}
                />
                <Line
                  type="monotone"
                  dataKey="packages"
                  name="Packages"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
