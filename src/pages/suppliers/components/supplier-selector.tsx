'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validatePhoneNumber } from '@/lib/phone-number-valid';
import { useOrderData } from '@/hooks/use-order-data';

export default function SupplierSelector({
  initialValue,
  onChange
}: {
  initialValue?: string | null;
  onChange?: (normalizedPhone: string | null) => void;
}) {
  const { isLoading } = useOrderData();
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Set initial value when provided
  useEffect(() => {
    if (initialValue) {
      setInput(initialValue);
      const normalized = validatePhoneNumber(initialValue);
      if (normalized) {
        setError(null);
      } else {
        setError('Invalid phone number');
      }
    }
  }, [initialValue]);

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
