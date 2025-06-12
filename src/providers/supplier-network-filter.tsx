// src/contexts/FilterContext.tsx
import React, { createContext, useContext, useState } from 'react';

type FilterContextType = {
  startDate: string;
  endDate: string;
  minClients: number;
  setStartDate: (value: string) => void;
  setEndDate: (value: string) => void;
  setMinClients: (value: number) => void;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [minClients, setMinClients] = useState<number>(25);

  return (
    <FilterContext.Provider
      value={{
        startDate,
        endDate,
        minClients,
        setStartDate,
        setEndDate,
        setMinClients
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context)
    throw new Error('useFilters must be used within FilterProvider');
  return context;
};
