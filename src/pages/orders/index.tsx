import PageHead from '@/components/shared/page-head';
import { useGetOrders } from './queries/client-pagination';
import OrdersTable from './components/order-table';
import { useSearchParams } from 'react-router-dom';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';

export default function OrderPage() {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);
  const pageLimit = Number(searchParams.get('limit') || 20);
  const country = searchParams.get('search') || null;
  const offset = (page - 1) * pageLimit;
  const { data, isLoading } = useGetOrders(offset, pageLimit, country);
  const orders = data?.orders;
  const totalOrders = data?.total_orders; //1000
  const pageCount = Math.ceil(totalOrders / pageLimit);

  if (isLoading) {
    return (
      <div className="p-5">
        <DataTableSkeleton
          columnCount={10}
          filterableColumnCount={2}
          searchableColumnCount={1}
        />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <PageHead title="GRAVITAS | Orders Dashboard " />
      <Breadcrumbs
        items={[
          { title: 'Home', link: '/' },
          { title: 'Orders', link: '/orders' }
        ]}
      />
      <OrdersTable
        orders={orders}
        page={page}
        totalUsers={totalOrders}
        pageCount={pageCount}
      />
    </div>
  );
}
