'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOrderData } from '@/hooks/use-order-data';

type ClientSelectorProps = {
  value: string;
  onChange?: (clientId: string | null) => void;
};

export default function ClientSelector({
  value,
  onChange
}: ClientSelectorProps) {
  const { data, isLoading } = useOrderData();
  const [input, setInput] = useState(value);
  const [hasAutofilled, setHasAutofilled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!data || hasAutofilled || value) return;

    const uniqueClientIds = Array.from(
      new Set(data.map((order) => order.client_id).filter(Boolean))
    );

    if (uniqueClientIds.length > 0) {
      const randomClient =
        uniqueClientIds[Math.floor(Math.random() * uniqueClientIds.length)];
      setInput(randomClient as string);
      onChange?.(randomClient as string);
      setHasAutofilled(true);
    }
  }, [data, hasAutofilled, onChange, value]);

  const handleInputChange = (value: string) => {
    setInput(value);
    const valid = /^[0-9]+$/.test(value); // simple numeric validation
    if (valid) {
      setError(null);
      onChange?.(value);
    } else {
      setError('Client ID must be numeric');
      onChange?.(null);
    }
  };

  return (
    <div className="w-full md:w-1/3">
      <Label htmlFor="client-id" className="mb-1 block text-sm font-medium">
        Enter Client ID
      </Label>
      <Input
        id="client-id"
        placeholder="e.g. 632"
        value={input}
        onChange={(e) => handleInputChange(e.target.value)}
        disabled={isLoading}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
