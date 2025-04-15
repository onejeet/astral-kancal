'use client';

import { motion, AnimatePresence } from 'framer-motion';
import dayjs, { Dayjs } from 'dayjs';
import React, { useState } from 'react';
import { RefreshCcw } from 'lucide-react';
import Button from '@/components/core/Button';

interface WeekViewProps {
  selectedDate: Dayjs;
  onDateSelect: (date: Dayjs) => void;
}

const transitionConfig = {
  // type: 'spring',
  // stiffness: 300,
  // damping: 20,
  // duration: 0.3,
  type: 'tween',
  ease: 'linear',
  duration: 0.3,
};

const WeekView = ({ selectedDate, onDateSelect }: WeekViewProps) => {
  const [localSelectedDate, setLocalSelectedDate] = React.useState<Dayjs>(selectedDate);
  const [direction, setDirection] = useState(0);

  const isTodaySelected = React.useMemo(() => {
    return dayjs(localSelectedDate).isSame(dayjs(), 'day');
  }, [localSelectedDate]);

  const [currentDate, setCurrentDate] = useState(localSelectedDate);

  const weekDays = React.useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      return dayjs(currentDate).add(i - 3, 'day');
    });
  }, [currentDate]);

  const handleSwipe = React.useCallback(
    (newDate: Dayjs, refreshOnly?: boolean) => {
      const newDirection = dayjs(newDate).isAfter(localSelectedDate) ? 1 : -1;
      setDirection(newDirection);
      setCurrentDate(newDate);
      setLocalSelectedDate(newDate);
      if (!refreshOnly) {
        onDateSelect(newDate);
      }
    },
    [onDateSelect, localSelectedDate]
  );

  React.useEffect(() => {
    if (!dayjs(selectedDate)?.isSame(localSelectedDate)) {
      handleSwipe(selectedDate, true);
    }
  }, [selectedDate]);

  const variants = {
    enter: (direction: number) => ({
      x: 100 * direction,
      opacity: 0,
      position: 'absolute' as const,
    }),
    center: {
      x: 0,
      opacity: 1,
      position: 'relative' as const,
    },
    exit: (direction: number) => ({
      x: -100 * direction,
      opacity: 0,
      position: 'absolute' as const,
    }),
  };

  return (
    <div className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-b-3xl sticky top-0 z-10">
      <div className="flex justify-between items-center mb-3 h-9">
        <h1 className="text-2xl font-semibold text-white mb-0">Your Schedule</h1>
        {!isTodaySelected && (
          <Button
            title="Today"
            onClick={() => handleSwipe(dayjs())}
            startIcon={<RefreshCcw size={16} />}
          />
        )}
      </div>
      <div className="relative w-full max-w-2xl mx-auto ">
        <div className="flex justify-center items-center overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={currentDate.toISOString()}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transitionConfig}
              className="flex justify-center items-center gap-4"
            >
              {weekDays.map((date) => {
                const isSelected = dayjs(date).isSame(localSelectedDate, 'day');
                const dayNumber = dayjs(date).format('D');
                const dayName = dayjs(date).format('ddd');
                return (
                  <motion.button
                    key={date.toISOString()}
                    onClick={() => handleSwipe(date)}
                    className={`flex flex-col items-center p-3 my-2 rounded-xl transition-all cursor-pointer flex-1 min-w-[60px] sm:min-w-[70px] md:min-w-[80px] ${
                      isSelected
                        ? 'bg-gradient-to-br from-indigo-900 to-purple-600 text-white'
                        : 'text-white/90 hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      scale: isSelected ? 1.1 : 1,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 20,
                    }}
                  >
                    <span className="text-sm font-medium">{dayName}</span>
                    <span className="text-xl font-bold mt-1">{dayNumber}</span>
                  </motion.button>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default React.memo(WeekView);
