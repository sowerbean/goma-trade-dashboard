// this is ahook for fetching order data from a local JSON file or remote URL
import { useQuery } from '@tanstack/react-query';

// Replace with your local path or remote URL
// const DATA_URL = import.meta.env.VITE_DATA_URL;
const WHATSAPP_DATA_URL = '../../data/whatsapp.json';

export const useWhatsappValidationData = () => {
  return useQuery({
    queryKey: ['order-data'],
    queryFn: async () => {
      const res = await fetch(WHATSAPP_DATA_URL);
      if (!res.ok) throw new Error('Failed to fetch order data');
      return res.json();
    }
  });
};
