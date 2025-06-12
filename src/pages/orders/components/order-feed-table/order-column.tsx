import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { Order } from '@/types';

// type Order = {
//   client_id: string;
//   loading_date: string;
//   day_in: string;
//   client_name: string;
//   supplier_phone_number: string;
//   goods_type: string;
//   packages: string;
// };

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
    header: 'ID'
  },
  {
    accessorKey: 'loading_date',
    header: 'Loading'
  },
  {
    accessorKey: 'day_in',
    header: 'Day In'
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
    header: 'Pckgs'
  }
];
