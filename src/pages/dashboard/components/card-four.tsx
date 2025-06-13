import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useOrderData } from '@/hooks/use-order-data';
import { parseDate } from '@/lib/date-parsing-sorting';

function getSupplierStats(data: any[]) {
  const today = new Date();
  const thisYear = today.getFullYear();

  const suppliersOrders: Record<string, Set<number>> = {}; // supplier_phone_number => set of years

  data.forEach((order) => {
    const supplierPhone = order.supplier_phone_number;
    if (!supplierPhone) return;

    const dateStr = order.loading_date || order.date_in;
    const parsed = parseDate(dateStr);
    if (!parsed) return;

    const year = parsed.getFullYear();

    if (!suppliersOrders[supplierPhone]) {
      suppliersOrders[supplierPhone] = new Set();
    }
    suppliersOrders[supplierPhone].add(year);
  });

  const totalSuppliers = Object.keys(suppliersOrders).length;

  // Suppliers with orders only this year
  const newSuppliersThisYear = Object.values(suppliersOrders).filter(
    (yearsSet) => yearsSet.size === 1 && yearsSet.has(thisYear)
  ).length;

  return { totalSuppliers, newSuppliersThisYear };
}

export default function CardFour() {
  const { data, isLoading, error } = useOrderData();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading suppliers data</div>;

  const { totalSuppliers, newSuppliersThisYear } = getSupplierStats(data);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Suppliers</CardTitle>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-muted-foreground"
        >
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalSuppliers}</div>
        <p className="text-xs text-muted-foreground">
          {newSuppliersThisYear} new this year
        </p>
      </CardContent>
    </Card>
  );
}
