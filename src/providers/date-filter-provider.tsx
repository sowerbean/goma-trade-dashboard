'use client';
import { createContext, useContext, useState } from 'react';

type DateFilterContextType = {
  startDate: string;
  endDate: string;
  setStartDate: (value: string) => void;
  setEndDate: (value: string) => void;
};

const DateFilterContext = createContext<DateFilterContextType | undefined>(
  undefined
);

export const DateFilterProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  return (
    <DateFilterContext.Provider
      value={{ startDate, endDate, setStartDate, setEndDate }}
    >
      {children}
    </DateFilterContext.Provider>
  );
};

export const useDateFilter = () => {
  const context = useContext(DateFilterContext);
  if (!context) {
    throw new Error('useDateFilter must be used within a DateFilterProvider');
  }
  return context;
};
