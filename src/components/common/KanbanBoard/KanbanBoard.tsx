'use client';

import React from 'react';

import { motion } from 'framer-motion';
import { Dayjs } from 'dayjs';
import { formatDate } from '@/lib/mockData';

import DroppableDay from '../DayDroppable';
import useWeekDays from '@/hooks/useWeekDays';
import EventCard from '../EventCard';
import { EventsByDate, Event } from '@/types';

interface KanbanBoardProps {
  events: EventsByDate;
  selectedDate: Dayjs;
  onDateSelect?: (date: Dayjs) => void;
  draggedEvent: Event | null;
  handleCardClick: (e: Event) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  events,
  selectedDate,
  // onDateSelect,
  handleCardClick,
  draggedEvent,
}) => {
  const { getCurrentDays } = useWeekDays();
  const weekDays = getCurrentDays(selectedDate);
  return (
    <div className="kanban-columns flex min-h-[calc(100vh-192px)] space-x-2 overflow-x-auto px-8 mt-4">
      {weekDays.map((d: Dayjs) => {
        const date = formatDate(d);
        const currentDateEvents = events[date] || [];
        return (
          <motion.div
            layout={!draggedEvent}
            transition={{ duration: 0.3 }}
            key={date}
            className="kanban-column flex-shrink-1 w-70 bg-white p-1 rounded-lg shadow-md"
          >
            <DroppableDay date={date} isKanbanView>
              {currentDateEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <EventCard
                    event={event}
                    currentDate={date}
                    onClick={() => handleCardClick(event)}
                    isMinimal
                  />
                </motion.div>
              ))}

              {currentDateEvents.length === 0 && (
                <motion.p className="text-center text-gray-500 py-8 text-xs">
                  No events scheduled
                </motion.p>
              )}
            </DroppableDay>
          </motion.div>
        );
      })}
    </div>
  );
};

export default React.memo(KanbanBoard);
