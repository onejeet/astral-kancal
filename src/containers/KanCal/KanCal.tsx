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
import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import dayjs from 'dayjs';

import mockEvents from '@/lib/mockData';
import { Event, EventsByDate } from '@/types';
import EventCard from '@/components/common/EventCard';
import EventDetailModal from '@/components/common/EventDetailDialog';

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

  const animateConfig = useMemo(
    () => ({
      scale: isOver ? 1.02 : 1,
      border: isOver ? '2px solid transparent' : isActive ? '1px solid transparent' : 'none',
      backgroundImage: isOver
        ? 'linear-gradient(white, white), linear-gradient(to right, #6366f1, #8b5cf6, #6366f1)'
        : isActive
          ? 'linear-gradient(white, white), linear-gradient(to right, #e5e7eb, #d1d5db, #e5e7eb)'
          : 'none',
      backgroundOrigin: 'border-box',
      backgroundClip: isOver || isActive ? 'padding-box, border-box' : 'padding-box',
    }),
    [isOver, isActive]
  );

  const transitionConfig = useMemo(
    () => ({
      duration: 0.3,
      ease: 'easeOut',
    }),
    []
  );

  return (
    <motion.div
      ref={setNodeRef}
      className={`relative space-y-4 min-h-[200px] rounded-2xl p-4 transition-colors ${
        isOver ? 'bg-indigo-50/80' : isActive ? 'bg-gray-50/50' : ''
      }`}
      style={backgroundStyle}
      animate={animateConfig}
      transition={transitionConfig}
    >
      {children}
    </motion.div>
  );
});

const initialMotionConfig = {
  opacity: 0,
};

const calendarAnimateConfig = {
  opacity: 1,
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.6,
};

const calendarTransitionConfig = {
  duration: 0.3,
};

const arrowInitialConfig = {
  opacity: 0,
};

const transitionConfig = {
  // type: 'spring',
  // stiffness: 300,
  // damping: 20,
  // duration: 0.3,
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.6,
};

const dragOverlayInitialConfig = {
  scale: 1,
  rotate: 0,
};

const dragOverlayAnimateConfig = {
  scale: 1.05,
  rotate: 2,
};

const arrowTransitionConfig = {
  duration: 0.2,
};

const headerAnimateConfig = {
  opacity: 1,
  x: 0,
};

export default function KanCal() {
  const [events, setEvents] = useState<EventsByDate>(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedEvent, setDraggedEvent] = useState<Event | null>(null);
  const [dateScrollInterval, setDateScrollInterval] = useState<ReturnType<
    typeof setInterval
  > | null>(null);
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null);
  const [dateTransitionDirection, setDateTransitionDirection] = useState<'left' | 'right' | null>(
    null
  );

  const startDateScroll = useCallback(
    (direction: 'prev' | 'next') => {
      if (dateScrollInterval) return;

      setDragDirection(direction === 'prev' ? 'left' : 'right');

      const interval = setInterval(() => {
        setSelectedDate((current) => {
          const newDate = dayjs(current)
            .add(direction === 'next' ? 1 : -1, 'day')
            .toDate();
          return newDate;
        });
      }, 1500);

      setDateScrollInterval(interval);
    },
    [dateScrollInterval]
  );

  const stopDateScroll = useCallback(() => {
    if (dateScrollInterval) {
      clearInterval(dateScrollInterval);
      setDateScrollInterval(null);
    }
    setDragDirection(null);
  }, [dateScrollInterval]);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const eventId = event.active.id as string;
      const foundEvent = Object.values(events)
        .flat()
        .find((e) => e.id === eventId);
      if (foundEvent) {
        setDraggedEvent(foundEvent);
      }
    },
    [events]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;

      const fromDate = Object.keys(events).find((date) =>
        events[date]?.some((e) => e.id === active.id)
      );
      const toDate = over.id as string;

      if (!fromDate || fromDate === toDate) return;

      const draggedEvent = events[fromDate]?.find((e) => e.id === active.id);
      if (!draggedEvent) return;

      const updatedEvents = {
        ...events,
        [fromDate]: events[fromDate].filter((e) => e.id !== active.id),
        [toDate]: [...(events[toDate] || []), draggedEvent],
      };

      if (updatedEvents[fromDate].length === 0) {
        delete updatedEvents[fromDate];
      }

      setEvents(updatedEvents);
      setDraggedEvent(null);
      setDragDirection(null);

      if (dateScrollInterval) {
        clearInterval(dateScrollInterval);
        setDateScrollInterval(null);
      }
    },
    [events, dateScrollInterval]
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      if (!event.over) return;

      const container = document.querySelector('.calendar-container');
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const mouseX = event.active.rect.current?.translated?.left;

      if (!mouseX) return;

      const edgeSize = rect.width * 0.2;

      if (mouseX - rect.left < edgeSize) {
        startDateScroll('prev');
      } else if (rect.right - mouseX < edgeSize) {
        startDateScroll('next');
      } else {
        stopDateScroll();
      }
    },
    [startDateScroll, stopDateScroll]
  );

  const handleCardClick = useCallback((event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedEvent(null);
    }, 200);
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
    [handleDragStart, handleDragEnd, handleDragOver]
  );

  const leftArrowAnimateConfig = useMemo(
    () => ({
      opacity: dragDirection === 'left' ? 1 : 0,
      scale: dragDirection === 'left' ? 1.2 : 1,
    }),
    [dragDirection]
  );

  const rightArrowAnimateConfig = useMemo(
    () => ({
      opacity: dragDirection === 'right' ? 1 : 0,
      scale: dragDirection === 'right' ? 1.2 : 1,
    }),
    [dragDirection]
  );

  const headerInitialConfig = useMemo(
    () => ({
      opacity: 0,
      x: dateTransitionDirection === 'left' ? -20 : 20,
    }),
    [dateTransitionDirection]
  );

  return (
    <LayoutGroup>
      <div className="min-h-screen bg-gray-50">
        <motion.div
          className="calendar-container relative max-w-2xl mx-auto px-4 py-6"
          initial={initialMotionConfig}
          animate={calendarAnimateConfig}
          transition={calendarTransitionConfig}
        >
          {draggedEvent && (
            <>
              <motion.div
                className="pointer-events-none fixed top-1/2 left-8 z-50"
                initial={arrowInitialConfig}
                animate={leftArrowAnimateConfig}
                transition={arrowTransitionConfig}
              >
                <ArrowLeftCircle className="w-8 h-8 text-indigo-600" />
              </motion.div>
              <motion.div
                className="pointer-events-none fixed top-1/2 right-8 z-50"
                initial={arrowInitialConfig}
                animate={rightArrowAnimateConfig}
                transition={arrowTransitionConfig}
              >
                <ArrowRightCircle className="w-8 h-8 text-indigo-600" />
              </motion.div>
            </>
          )}

          <motion.h2
            className="text-2xl font-bold text-gray-900 mb-4"
            key={selectedDate.toISOString()}
            initial={headerInitialConfig}
            animate={headerAnimateConfig}
            //  exit={headerExitConfig}
            transition={transitionConfig}
          >
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold">{formattedDate}</h2>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"></div>
            </div>
          </motion.h2>

          <DndContext {...dndContextProps}>
            <motion.div layout key={currentDate}>
              <DroppableDay date={currentDate} isActive={!!draggedEvent}>
                <AnimatePresence mode="wait">
                  {currentDateEvents.map((event) => (
                    <motion.div key={event.id}>
                      <EventCard event={event} onClick={() => handleCardClick(event)} />
                    </motion.div>
                  ))}
                  {currentDateEvents.length === 0 && (
                    <motion.p
                      initial={arrowInitialConfig}
                      animate={calendarAnimateConfig}
                      exit={arrowInitialConfig}
                      className="text-center text-gray-500 py-8"
                    >
                      No events scheduled for this day
                    </motion.p>
                  )}
                </AnimatePresence>
              </DroppableDay>
            </motion.div>

            <DragOverlay>
              {draggedEvent ? (
                <motion.div
                  className="opacity-90"
                  initial={dragOverlayInitialConfig}
                  animate={dragOverlayAnimateConfig}
                  transition={transitionConfig}
                >
                  <EventCard event={draggedEvent} onClick={() => {}} />
                </motion.div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </motion.div>

        {selectedEvent && (
          <EventDetailModal isOpen={isModalOpen} event={selectedEvent} onClose={closeModal} />
        )}
      </div>
    </LayoutGroup>
  );
}
