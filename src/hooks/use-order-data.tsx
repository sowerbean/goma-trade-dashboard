// this is ahook for fetching order data from a local JSON file or remote URL
import { useQuery } from '@tanstack/react-query';

// Replace with your local path or remote URL
const DATA_URL = '../../data/json_bukavu_trade_data.json';

// Use environment variables
// const DATA_URL = import.meta.env.VITE_DATA_URL;
// const SUPPLIERS_VALID_WHATSAPP_URL = import.meta.env.VITE_SUPPLIERS_VALID_WHATSAPP_URL;

export const useOrderData = () => {
  return useQuery({
    queryKey: ['order-data'],
    queryFn: async () => {
      const res = await fetch(DATA_URL);
      if (!res.ok) throw new Error('Failed to fetch order data');
      return res.json();
    }
  });
};
