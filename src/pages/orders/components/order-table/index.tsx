import DataTable from '@/components/shared/data-table';
import { columns } from './columns';
import { Order } from '@/types';
import OrderTableActions from './orders-table-action';

type TStudentsTableProps = {
  orders: Order[];
  page: number;
  totalUsers: number;
  pageCount: number;
};

export default function OrdersTable({
  orders,
  pageCount
}: TStudentsTableProps) {
  return (
    <>
      <OrderTableActions />
      {orders && (
        <DataTable columns={columns} data={orders} pageCount={pageCount} />
      )}
    </>
  );
}
