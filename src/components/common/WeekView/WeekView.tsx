'use client';

import { motion, AnimatePresence } from 'framer-motion';
import dayjs, { Dayjs } from 'dayjs';
import React, { useState } from 'react';
import { CircleChevronLeft, CircleChevronRight, RefreshCcw } from 'lucide-react';
import Button from '@/components/core/Button';
import { useIsMobile } from '@/hooks/useIsMobile';
import useWeekDays from '@/hooks/useWeekDays';

interface WeekViewProps {
  selectedDate: Dayjs;
  onDateSelect: (date: Dayjs) => void;
}

const transitionConfig = {
  type: 'tween',
  ease: 'linear',
  duration: 0.3,
};

const btnTransitionConfig = {
  type: 'spring',
  stiffness: 300,
  damping: 20,
};

const WeekView = ({ selectedDate, onDateSelect }: WeekViewProps) => {
  const [localSelectedDate, setLocalSelectedDate] = React.useState<Dayjs>(selectedDate);
  const [direction, setDirection] = useState(0);

  const { isMobile, isTouchDevice } = useIsMobile();

  const isKanbanView = !isMobile;

  const isTodaySelected = React.useMemo(() => {
    return dayjs(localSelectedDate).isSame(dayjs(), 'day');
  }, [localSelectedDate]);

  const [currentDate, setCurrentDate] = useState(localSelectedDate);

  const { getCurrentDays } = useWeekDays();
  const weekDays = getCurrentDays(currentDate);

  const handleSwipe = React.useCallback(
    (newDate: Dayjs, refreshOnly?: boolean) => {
      const dayDiff = dayjs(newDate).diff(localSelectedDate, 'day');
      setDirection(dayDiff > 10 || dayDiff < -10 ? 1 : dayDiff);
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
    <div className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 py-4 sm:py-5 md:py-6 rounded-b-3xl sticky top-0 z-10">
      <div className=" w-full flex justify-between items-center mb-3 h-9 px-4 sm:px-5 md:px-6">
        <h1 className="text-2xl font-semibold text-white mb-0">Your Schedule</h1>
        {!isTodaySelected && (
          <Button
            title="Today"
            onClick={() => handleSwipe(dayjs())}
            startIcon={<RefreshCcw size={16} />}
          />
        )}
      </div>
      <div
        className={`relative w-full flex items-center ${isKanbanView ? '' : 'max-w-2xl'} mx-auto`}
      >
        {(!isMobile || isKanbanView) && (
          <motion.div
            onClick={() => handleSwipe(dayjs(selectedDate).subtract(7, 'day'))}
            className="cursor-pointer text-white"
          >
            <CircleChevronLeft size={32} className="p-1" />
          </motion.div>
        )}
        <div className="relative h-[80px] w-full flex items-center justify-center overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={currentDate.toISOString()}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transitionConfig}
              className={`flex justify-center items-center ${isKanbanView ? 'gap-2 sm:gap-3' : 'gap-1 sm:gap-4'} touch-pan-x max-w-full overflow-hidden`}
              drag={isMobile || isTouchDevice ? 'x' : undefined}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, info) => {
                if (info.offset.x > 80) {
                  handleSwipe(dayjs(selectedDate).subtract(5, 'day'));
                } else if (info.offset.x < -80) {
                  handleSwipe(dayjs(selectedDate).add(5, 'day'));
                }
              }}
              style={{
                background: 'linear-gradient(to left, rgba(0,0,0,0.4), transparent 25%)',
                backgroundSize: '200% 100%',
                transition: 'background 0.3s ease-out',
              }}
            >
              {weekDays.map((date) => {
                const isSelected = isKanbanView
                  ? false
                  : dayjs(date).isSame(localSelectedDate, 'day');
                const dayNumber = dayjs(date).format('D');
                const dayName = dayjs(date).format('ddd');
                return (
                  <motion.button
                    key={date.toISOString()}
                    onClick={() => (isKanbanView ? null : handleSwipe(date))}
                    className={`flex flex-col items-center flex-shrink-1  ${isKanbanView ? 'w-70' : 'min-w-[50px] sm:min-w-[60px] md:min-w-[80px] cursor-pointer '} p-1.5 xs:p-2 sm:p-2.5 md:p-3 my-2 rounded-xl transition-all   ${
                      isSelected
                        ? 'bg-gradient-to-br from-indigo-900 to-purple-600 text-white'
                        : 'text-white/90 hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      scale: isSelected ? 1.1 : 1,
                    }}
                    transition={btnTransitionConfig}
                  >
                    <span className="text-sm font-medium">{dayName}</span>
                    <span className="text-xl font-bold mt-1">{dayNumber}</span>
                  </motion.button>
                );
              })}
            </motion.div>
          </AnimatePresence>
          {(!isMobile || isKanbanView) && (
            <motion.div
              onClick={() => handleSwipe(dayjs(selectedDate).add(7, 'day'))}
              className="cursor-pointer relative text-white px-1"
            >
              <CircleChevronRight size={32} className="p-1" />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(WeekView);
