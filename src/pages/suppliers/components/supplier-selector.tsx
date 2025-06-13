'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validatePhoneNumber } from '@/lib/phone-number-valid';
import { useOrderData } from '@/hooks/use-order-data';
import { Order } from '@/types';

export default function SupplierSelector({
  onChange
}: {
  onChange?: (normalizedPhone: string | null) => void;
}) {
  const { data, isLoading } = useOrderData();
  const [input, setInput] = useState('');
  const [hasAutofilled, setHasAutofilled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Run once on load to pick a random supplier
  useEffect(() => {
    if (!data || hasAutofilled) return;

    const uniquePhones = Array.from(
      new Set(
        data
          .map((order: Order) =>
            validatePhoneNumber(order.supplier_phone_number)
          )
          .filter(Boolean)
      )
    );

    if (uniquePhones.length > 0) {
      const random = uniquePhones[
        Math.floor(Math.random() * uniquePhones.length)
      ] as string;
      setInput(random!);
      onChange?.(random!);
      setHasAutofilled(true); // Prevent future autofills
    }
  }, [data, hasAutofilled, onChange]);

  const handleInputChange = (value: string) => {
    setInput(value);
    const normalized = validatePhoneNumber(value);
    if (normalized) {
      setError(null);
      onChange?.(normalized);
    } else {
      setError('Invalid phone number');
      onChange?.(null);
    }
  };

  return (
    <div className="w-full md:w-1/3">
      <Label
        htmlFor="supplier-phone"
        className="mb-1 block text-sm font-medium"
      >
        Enter Supplier Phone Number
      </Label>
      <Input
        id="supplier-phone"
        placeholder="e.g. +86 138 1234 5678"
        value={input}
        onChange={(e) => handleInputChange(e.target.value)}
        disabled={isLoading}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
