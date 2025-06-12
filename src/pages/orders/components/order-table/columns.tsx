import { Checkbox } from '@/components/ui/checkbox';
import { Order } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { dateSort } from '@/lib/date-parsing-sorting';

export const columns: ColumnDef<Order>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'client_id',
    header: 'Client ID'
  },
  {
    accessorKey: 'loading_date',
    header: 'Loading Date',
    sortingFn: dateSort
  },
  {
    accessorKey: 'day_in',
    header: 'Day In',
    sortingFn: dateSort
  },
  {
    accessorKey: 'client_name',
    header: 'Client Name'
  },
  {
    accessorKey: 'supplier_phone_number',
    header: 'Supplier Phone'
  },
  {
    accessorKey: 'goods_type',
    header: 'Goods Type'
  },
  {
    accessorKey: 'packages',
    header: 'Packages'
  },
  // {
  //   id: 'actions',
  //   cell: ({ row }) => <CellAction data={row.original} />
  // },

  //VIEW the whole order data
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      const order = row.original;
      return <CellAction data={order} />;
    }
  }
];
