import { useFilters } from '@/providers/supplier-network-filter';

export default function FilterBar() {
  const {
    startDate,
    endDate,
    minClients,
    setStartDate,
    setEndDate,
    setMinClients
  } = useFilters();

  return (
    <div className="mb-4 flex flex-wrap gap-4 rounded-md bg-muted/40 p-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-48 rounded border p-2"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-48 rounded border p-2"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">
          Minimum Clients/Supplier
        </label>
        <input
          type="number"
          value={minClients}
          min={1}
          onChange={(e) => setMinClients(parseInt(e.target.value))}
          className="w-48 rounded border p-2"
        />
      </div>
    </div>
  );
}
