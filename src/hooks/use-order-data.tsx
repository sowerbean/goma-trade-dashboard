// this is ahook for fetching order data from a local JSON file or remote URL
import { useQuery } from '@tanstack/react-query';
import { useDataSource } from '@/contexts/data-source-context';

// Data source URLs
const DATA_URLS = {
  bukavu: '../../data/json_bukavu_trade_data.json',
  goma: '../../data/json_goma_trade_data.json'
};

// Use environment variables
// const DATA_URL = import.meta.env.VITE_DATA_URL;
// const SUPPLIERS_VALID_WHATSAPP_URL = import.meta.env.VITE_SUPPLIERS_VALID_WHATSAPP_URL;

export const useOrderData = () => {
  const { dataSource } = useDataSource();
  const DATA_URL = DATA_URLS[dataSource];

  return useQuery({
    queryKey: ['order-data', dataSource],
    queryFn: async () => {
      const res = await fetch(DATA_URL);
      if (!res.ok) throw new Error('Failed to fetch order data');
      return res.json();
    }
  });
};
