/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useDroppable,
  DragOverEvent,
} from '@dnd-kit/core';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import dayjs from 'dayjs';
import mockEvents from '@/lib/mockData';
import { Event, EventsByDate } from '@/types';
import EventCard from '@/components/common/EventCard';

const DroppableDay = React.memo(function DroppableDay({
  children,
  date,
  isActive,
}: {
  children: React.ReactNode;
  date: string;
  isActive: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: date,
  });

  const backgroundStyle = useMemo(
    () => ({
      background: isOver
        ? 'linear-gradient(to right, #f5f3ff, #ede9fe, #f5f3ff)'
        : isActive
          ? 'linear-gradient(to right, #f9fafb, #f3f4f6, #f9fafb)'
          : 'transparent',
    }),
    [isOver, isActive]
  );

  return (
    <motion.div
      ref={setNodeRef}
      className={`relative space-y-4 min-h-[200px] rounded-2xl p-4 transition-colors ${
        isOver ? 'bg-indigo-50/80' : isActive ? 'bg-gray-50/50' : ''
      }`}
      style={backgroundStyle}
    >
      {children}
    </motion.div>
  );
});

const KanCal = () => {
  const [events, setEvents] = useState<EventsByDate>(mockEvents);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [draggedEvent, setDraggedEvent] = useState<Event | null>(null);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    if (!event?.over) return;
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    if (!event.over) return;
  }, []);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const eventId = event.active.id as string;

    console.log('~~ handleDragStart eventId ', eventId);
  }, []);

  const currentDate = useMemo(() => dayjs(selectedDate).format('YYYY-MM-DD'), [selectedDate]);

  const currentDateEvents = useMemo(() => events[currentDate] || [], [events, currentDate]);

  const formattedDate = useMemo(() => dayjs(selectedDate).format('ddd MMM D YYYY'), [selectedDate]);

  const dndContextProps = useMemo(
    () => ({
      onDragStart: handleDragStart,
      onDragEnd: handleDragEnd,
      onDragOver: handleDragOver,
    }),
    [handleDragEnd, handleDragOver, handleDragStart]
  );

  return (
    <LayoutGroup>
      <div className="min-h-screen bg-gray-50">
        <motion.h2
          className="text-2xl font-bold text-gray-900 mb-4"
          key={selectedDate.toISOString()}
        >
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold">{formattedDate}</h2>
          </div>
        </motion.h2>

        <DndContext {...dndContextProps}>
          <motion.div layout key={currentDate}>
            <DroppableDay date={currentDate} isActive={!!draggedEvent}>
              <AnimatePresence mode="wait">
                {currentDateEvents.map((event) => (
                  <motion.div key={event.id}>
                    <EventCard event={event} />
                  </motion.div>
                ))}
                {currentDateEvents.length === 0 && (
                  <motion.p className="text-center text-gray-500 py-8">
                    No events scheduled for this day
                  </motion.p>
                )}
              </AnimatePresence>
            </DroppableDay>
          </motion.div>
        </DndContext>
      </div>
    </LayoutGroup>
  );
};

export default KanCal;
