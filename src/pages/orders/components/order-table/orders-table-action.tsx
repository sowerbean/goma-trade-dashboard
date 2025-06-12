// import PopupModal from '@/components/shared/popup-modal';
import TableSearchInput from '@/components/shared/table-search-input';
// import StudentCreateForm from '../student-forms/student-create-form';

export default function OrderTableActions() {
  return (
    <div className="flex items-center justify-between gap-2 py-5">
      <div className="flex flex-1 gap-4">
        <TableSearchInput placeholder="Search People Here" />
      </div>

      {/* 
      // Pop up modal form for inserting data
      // this functionality is not implemented yet, 
      // because all our app does right now is just 
      // visualizing data from the API
      */}

      {/* <div className="flex gap-3">
        <PopupModal
          renderModal={(onClose) => <StudentCreateForm modalClose={onClose} />}
        />
      </div> */}
    </div>
  );
}
