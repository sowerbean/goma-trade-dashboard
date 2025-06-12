// import DataTable from '@/components/shared/data-table';
// import { columns } from './columns';
// import StudentTableActions from './student-table-action';

// type TStudentsTableProps = {
//   users: any;
//   page: number;
//   totalUsers: number;
//   pageCount: number;
// };

// export default function StudentFeedTable({
//   users,
//   pageCount
// }: TStudentsTableProps) {
//   return (
//     <>
//       <StudentTableActions />
//       {users && (
//         <DataTable columns={columns} data={users} pageCount={pageCount} />
//       )}
//     </>
//   );
// }

'use client';

import DataTable from '@/components/shared/data-table';
import { columns } from './order-column';
import OrderTableActions from './order-table-action';
import { Order } from '@/types';

type TOrderFeedTableProps = {
  orders: Order[];
  page: number;
  totalOrders: number;
  pageCount: number;
};

export default function OrderFeedTable({
  orders,
  pageCount
}: TOrderFeedTableProps) {
  return (
    <>
      <OrderTableActions />
      {orders && (
        <DataTable columns={columns} data={orders} pageCount={pageCount} />
      )}
    </>
  );
}
