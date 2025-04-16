'use client';

import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { LayoutGroup } from 'framer-motion';
import dayjs, { Dayjs } from 'dayjs';

import WeekView from '@/components/common/WeekView';

const DayColumn = dynamic(() => import('@/components/common/DayColumn'), {
  ssr: false,
});

export default function KanCal() {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

  const handleDateChange = useCallback((newDate: Dayjs) => {
    setSelectedDate(newDate);
  }, []);

  return (
    <LayoutGroup>
      <div className="min-h-screen bg-gray-50">
        <WeekView selectedDate={selectedDate} onDateSelect={handleDateChange} />
        <DayColumn selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      </div>
    </LayoutGroup>
  );
}
