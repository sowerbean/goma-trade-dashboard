// import PopupModal from '@/components/shared/popup-modal';
// import TableSearchInput from '@/components/shared/table-search-input';
// import { Button } from '@/components/ui/button';
// import StudentCreateForm from '../student-forms/student-create-form';
// import { DownloadIcon } from 'lucide-react';

// export default function StudentTableActions() {
//   return (
//     <div className="flex items-center justify-between py-5">
//       <div className="flex flex-1 gap-4">
//         <TableSearchInput placeholder="Search People Here" />
//       </div>
//       <div className="flex gap-3">
//         <Button>
//           <DownloadIcon className="h-6 w-6" />
//           Download CSV
//         </Button>

//         <PopupModal
//           renderModal={(onClose) => <StudentCreateForm modalClose={onClose} />}
//         />
//       </div>
//     </div>
//   );
// }

// import PopupModal from '@/components/shared/popup-modal';
import TableSearchInput from '@/components/shared/table-search-input';
import { Button } from '@/components/ui/button';
import { DownloadIcon, PlusCircle } from 'lucide-react';

export default function OrderTableActions() {
  return (
    <div className="flex items-center justify-between py-5">
      <div className="flex flex-1 gap-4">
        <TableSearchInput placeholder="Search orders…" />
      </div>
      <div className="flex gap-3">
        <Button>
          <DownloadIcon className="mr-2 h-5 w-5" />
          Download CSV
        </Button>

        {/* <PopupModal
          triggerText="New Order"
          icon={<PlusCircle className="h-5 w-5 mr-2" />}
          renderModal={(onClose) => (
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">New Order (Form Placeholder)</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Implement a form here for creating a new order.
              </p>
              <Button onClick={onClose}>Close</Button>
            </div>
          )}
        /> */}
      </div>
    </div>
  );
}
