import { useDataSource } from '@/contexts/data-source-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

export default function DataSourceSelector() {
  const { dataSource, setDataSource } = useDataSource();

  return (
    <div className="mb-4 flex items-center justify-center gap-2">
      {/* <Database className="h-4 w-4 text-muted-foreground" /> */}
      <Select
        value={dataSource}
        onValueChange={(value: 'bukavu' | 'goma') => setDataSource(value)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Select city" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="bukavu">Bukavu</SelectItem>
          <SelectItem value="goma">Goma</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
