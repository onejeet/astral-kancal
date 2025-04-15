'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  useDroppable,
  useSensors,
  useSensor,
  TouchSensor,
} from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs, { Dayjs } from 'dayjs';
import mockEvents from '@/lib/mockData';
import { Event, EventsByDate } from '@/types';
import EventCard from '@/components/common/EventCard';
import EventDetailModal from '@/components/common/EventDetailDialog';
import { useIsMobile } from '@/hooks/useIsMobile';

interface DayColumnProps {
  selectedDate: Dayjs;
  setSelectedDate: React.Dispatch<React.SetStateAction<Dayjs>>;
}

const dragOverlayInitialConfig = {
  scale: 1,
  rotate: 0,
};

const dragOverlayAnimateConfig = {
  scale: 1.05,
  rotate: 2,
};

const transitionConfig = {
  duration: 0.3,
  ease: 'easeOut',
};

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
      } ${isOver ? 'pt-200' : ''}`}
      style={backgroundStyle}
      animate={animateConfig}
      transition={transitionConfig}
    >
      {children}
    </motion.div>
  );
});

const DayColumn: React.FC<DayColumnProps> = ({ selectedDate, setSelectedDate }) => {
  const [events, setEvents] = React.useState<EventsByDate>(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedEvent, setDraggedEvent] = useState<Event | null>(null);
  const [dateScrollInterval, setDateScrollInterval] = useState<ReturnType<
    typeof setInterval
  > | null>(null);

  // const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null);
  // const [dateTransitionDirection, setDateTransitionDirection] = useState<'left' | 'right' | null>(
  //   null
  // );

  const containerRef = React.useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    // useSensor(PointerSensor, {
    //   activationConstraint: {
    //     distance: 30,
    //   },
    // }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const isMobile = useIsMobile();

  const startDateScroll = useCallback(
    (direction: 'prev' | 'next') => {
      if (dateScrollInterval) return;

      // setDragDirection(direction === 'prev' ? 'left' : 'right');

      const interval = setInterval(() => {
        setSelectedDate((current) => {
          const newDate = dayjs(current).add(direction === 'next' ? 1 : -1, 'day');

          return newDate;
        });
      }, 1500);

      setDateScrollInterval(interval);
    },
    [dateScrollInterval, setSelectedDate]
  );

  const stopDateScroll = useCallback(() => {
    if (dateScrollInterval) {
      clearInterval(dateScrollInterval);
      setDateScrollInterval(null);
    }
    // setDragDirection(null);
  }, [dateScrollInterval]);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const eventId = event.active.id as string;
      const foundEvent = Object.values(events)
        .flat()
        .find((e) => e.id === eventId);
      console.log('ZZ: handleDragStart', foundEvent);
      if (foundEvent) {
        setDraggedEvent(foundEvent);
      }
    },
    [events]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      // Always stop date scrolling when drag ends
      stopDateScroll();

      const { active, over } = event;

      // Reset drag state
      setDraggedEvent(null);
      // setDragDirection(null);

      if (!over) return;

      const fromDate = Object.keys(events).find((date) =>
        events[date]?.some((e) => e.id === active.id)
      );

      const toDateId = over.id as string;
      if (!toDateId.includes('droppable-day')) return;

      const toDate = toDateId.replace('droppable-day-', '');

      if (!fromDate || fromDate === toDate) return;

      const draggedEvent = events[fromDate]?.find((e) => e.id === active.id);
      if (!draggedEvent) return;

      const updatedEvents = {
        ...events,
        [fromDate]: events[fromDate].filter((e) => e.id !== active.id),
        [toDate]: [draggedEvent, ...(events[toDate] || [])]?.sort((a, b) => {
          const timeA = dayjs(a.time, 'h:mm A').valueOf();
          const timeB = dayjs(b.time, 'h:mm A').valueOf();
          return timeA - timeB;
        }),
      };

      // Clean up empty dates
      if (updatedEvents[fromDate].length === 0) {
        delete updatedEvents[fromDate];
      }

      // Update the state
      setEvents(updatedEvents);
    },
    [events, stopDateScroll, setEvents, setDraggedEvent]
  );

  // Track if we're dragging the container vs dragging a card
  const [isContainerDragging, setIsContainerDragging] = useState(false);

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      if (!event.over || isContainerDragging) return;

      const container = containerRef?.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const activeRect = event.active.rect.current?.translated;

      if (!activeRect) return;

      // Use the center of the dragged item for more accurate edge detection
      // const itemCenterX = activeRect.left + activeRect.width / 2;
      const itemCenterX = activeRect.left;

      // Log positions for debugging
      console.log(
        'Item center:',
        itemCenterX,
        'Container left:',
        rect.left,
        'Container right:',
        rect.right
      );

      const edgeSize = rect.width * 0.2;

      if (itemCenterX < rect.left + edgeSize) {
        console.log('Starting prev scroll');
        startDateScroll('prev');
      } else if (itemCenterX > rect.right - edgeSize) {
        console.log('Starting next scroll');
        startDateScroll('next');
      } else {
        stopDateScroll();
      }
    },
    [startDateScroll, stopDateScroll, isContainerDragging]
  );

  const handleCardClick = useCallback(
    (event: Event) => {
      if (draggedEvent) return;
      setSelectedEvent(event);
      setIsModalOpen(true);
    },
    [draggedEvent]
  );

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedEvent(null);
    }, 200);
  }, []);

  const handleDateChange = useCallback(
    (newDate: Dayjs) => {
      // const currentDate = dayjs(selectedDate);
      // const nextDate = dayjs(newDate);

      //  setDateTransitionDirection(nextDate.isAfter(currentDate) ? 'right' : 'left');
      setSelectedDate(newDate);
    },
    [selectedDate, setSelectedDate]
  );

  const currentDate = useMemo(() => dayjs(selectedDate).format('YYYY-MM-DD'), [selectedDate]);

  const currentDateEvents = useMemo(() => events[currentDate] || [], [events, currentDate]);

  const formattedDate = useMemo(() => dayjs(selectedDate).format('ddd MMM D YYYY'), [selectedDate]);

  // Use the original dndContextProps directly
  const dndContextProps = useMemo(
    () => ({
      onDragStart: handleDragStart,
      onDragEnd: handleDragEnd,
      onDragOver: handleDragOver,
    }),
    [handleDragStart, handleDragEnd, handleDragOver]
  );

  return (
    <div>
      <DndContext sensors={sensors} {...dndContextProps}>
        <motion.div
          ref={containerRef}
          className="calendar-container relative max-w-2xl mx-auto px-4 py-6"
          drag={isMobile ? 'x' : undefined}
          dragConstraints={{ left: 0, right: 0 }}
          onDragStart={() => {
            // Mark that we're dragging the container
            setIsContainerDragging(true);
            // Stop any ongoing date scrolling
            stopDateScroll();
          }}
          onDragEnd={(event, info) => {
            // Reset container dragging state
            setIsContainerDragging(false);

            if (info.offset.x > 100) {
              handleDateChange(dayjs(selectedDate).subtract(1, 'day'));
            } else if (info.offset.x < -100) {
              handleDateChange(dayjs(selectedDate).add(1, 'day'));
            }
          }}
        >
          <motion.h2
            className="text-2xl font-bold text-gray-900 mb-4"
            //  key={selectedDate.toISOString()}
            // initial={headerInitialConfig}
            // animate={headerAnimateConfig}
            // //  exit={headerExitConfig}
            // transition={transitionConfig}
          >
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-semibold">{formattedDate}</h2>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"></div>
            </div>
          </motion.h2>

          <motion.div
            layout
            key={currentDate}
            // initial={headerInitialConfig}
            // animate={headerAnimateConfig}
            // exit={headerExitConfig}
            // transition={transitionConfig}
          >
            <DroppableDay date={currentDate} isActive={!!draggedEvent}>
              {/* <AnimatePresence mode="wait"> */}
              {currentDateEvents.map((event) => (
                <div
                  key={event.id}

                  // initial={eventCardInitialConfig}
                  // animate={eventCardAnimateConfig}
                  // exit={eventCardExitConfig}
                  // transition={eventCardTransitionConfig}
                >
                  <EventCard event={event} onClick={() => handleCardClick(event)} />
                </div>
              ))}
              {currentDateEvents.length === 0 && (
                <motion.p
                  // initial={arrowInitialConfig}
                  // animate={calendarAnimateConfig}
                  // exit={arrowInitialConfig}
                  className="text-center text-gray-500 py-8 min-h-200"
                >
                  No events scheduled for this day
                </motion.p>
              )}
              {/* </AnimatePresence> */}
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
        </motion.div>
      </DndContext>

      <AnimatePresence>
        {selectedEvent && (
          <EventDetailModal isOpen={isModalOpen} event={selectedEvent} onClose={closeModal} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(DayColumn);
