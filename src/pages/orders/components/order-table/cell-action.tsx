// JUST DISPLAYING THE ORDER DATA (no input forms)
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Eye } from 'lucide-react';
import { Order } from '@/types';

interface CellActionProps {
  data: Order;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* View Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1"
      >
        <Eye className="h-4 w-4" />
        View
      </Button>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Order #{data.invoice_number}
            </DialogTitle>
          </DialogHeader>

          <table className="w-full border-separate text-sm text-muted-foreground [border-spacing:0.5rem]">
            <tbody>
              <tr>
                <td>Client</td>
                <td className="font-semibold">{data.client_name}</td>
              </tr>
              <tr>
                <td>Client Phone</td>
                <td className="font-semibold">{data.client_phone_number}</td>
              </tr>
              <tr>
                <td>Invoice Number</td>
                <td className="font-semibold">{data.invoice_number}</td>
              </tr>
              <tr>
                <td>Origin Warehouse</td>
                <td className="font-semibold">{data.origin_warehouse}</td>
              </tr>
              <tr>
                <td>Destination</td>
                <td className="font-semibold">{data.destination}</td>
              </tr>
              <tr>
                <td>Date In</td>
                <td className="font-semibold">{data.date_in}</td>
              </tr>
              <tr>
                <td>Goods Type</td>
                <td className="font-semibold">{data.goods_type}</td>
              </tr>
              <tr>
                <td>Packages</td>
                <td className="font-semibold">{data.packages}</td>
              </tr>
              <tr>
                <td>CBM</td>
                <td className="font-semibold">{data.CBM}</td>
              </tr>
              <tr>
                <td>Weight</td>
                <td className="font-semibold">{data.weight} kg</td>
              </tr>
              <tr>
                <td>Supplier</td>
                <td className="font-semibold">{data.supplier_name}</td>
              </tr>
              <tr>
                <td>Supplier Phone</td>
                <td className="font-semibold">{data.supplier_phone_number}</td>
              </tr>
              <tr>
                <td>Brand</td>
                <td className="font-semibold">{data.brand}</td>
              </tr>
              <tr>
                <td>Ready to Load</td>
                <td className="font-semibold">{data.ready_to_load}</td>
              </tr>
              <tr>
                <td>Loading Date</td>
                <td className="font-semibold">{data.loading_date || '-'}</td>
              </tr>
              <tr>
                <td>Container Number</td>
                <td className="font-semibold">
                  {data.container_number || '-'}
                </td>
              </tr>
              <tr>
                <td>Sales Person</td>
                <td className="font-semibold">{data.sales_person || '-'}</td>
              </tr>
              <tr>
                <td>LCL / FCL</td>
                <td className="font-semibold">{data.LCL_FCL || '-'}</td>
              </tr>
              <tr>
                <td>Marks</td>
                <td className="font-semibold">{data.marks || '-'}</td>
              </tr>
              <tr>
                <td>Off-loading Fee</td>
                <td className="font-semibold">{data.off_loading_fee || '-'}</td>
              </tr>
              <tr>
                <td>Mark</td>
                <td className="font-semibold">{data.mark}</td>
              </tr>
            </tbody>
          </table>
        </DialogContent>
      </Dialog>
    </>
  );
};
