/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useCallback, useMemo, RefObject } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  useDroppable,
  useSensors,
  useSensor,
  PointerSensor,
  TouchSensor,
  DragMoveEvent,
  useDraggable,
} from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs, { Dayjs } from 'dayjs';
import mockEvents from '@/lib/mockData';
import { Event, EventsByDate } from '@/types';
import EventCard from '@/components/common/EventCard';
import EventDetailModal from '@/components/common/EventDetailDialog';
import { useIsMobile } from '@/hooks/useIsMobile';
import { SortableContext, useSortable } from '@dnd-kit/sortable';

interface DayColumnProps {
  selectedDate: Dayjs;
  setSelectedDate: React.Dispatch<React.SetStateAction<Dayjs>>;
}

const eventCardInitialConfig = {
  opacity: 0,
  y: 20,
};

const eventCardAnimateConfig = {
  opacity: 1,
  y: 0,
};

const eventCardExitConfig = {
  opacity: 0,
  y: -20,
};

const eventCardTransitionConfig = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.6,
  //duration: 0.2,
};

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
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const { setNodeRef, isOver } = useDroppable({ id: date });

  // Make the item draggable
  const {
    setNodeRef: setDragRef,
    listeners,
    isDragging,
    transform, // The position of the dragged item
  } = useDraggable({
    id: date,
  });

  // Track if the item is inside the container
  const [isInsideContainer, setIsInsideContainer] = useState(false);
  const [cardsOffset, setCardsOffset] = useState<{ top: number; left: number } | null>(null);

  React.useEffect(() => {
    if (transform && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();

      // Compare the draggable item's position with container's bounds
      const itemX = transform.x;
      const itemY = transform.y;

      // const isInside =
      //   itemX >= 0 && itemX <= containerRect.width && itemY >= 0 && itemY <= containerRect.height;
      const isInside = itemX <= containerRect.left + 10 && itemY >= containerRect.top + 10;
      setIsInsideContainer(isInside);

      // Calculate how other cards should shift if the draggable item is inside the container
      if (isInside) {
        // Calculate droppable offset dynamically
        const droppableOffset = {
          top: itemY + 20, // Example offset for where the card is positioned
          left: itemX,
        };
        setCardsOffset(droppableOffset);
      }
    }
  }, [transform]);

  const backgroundStyle = useMemo(
    () => ({
      background: isOver
        ? 'linear-gradient(white, white), linear-gradient(to right, #6366f1, #8b5cf6, #6366f1)'
        : isActive
          ? 'linear-gradient(white, white), linear-gradient(to right, #e5e7eb, #d1d5db, #e5e7eb)'
          : 'none',
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
      ref={(node) => {
        setNodeRef(node); // Droppable reference
        setDragRef(node); // Draggable reference
        containerRef.current = node; // Store the container reference
      }}
      className="relative min-h-[200px] rounded-2xl p-4 transition-colors"
      style={{
        ...backgroundStyle,
      }}
      animate={animateConfig}
      transition={transitionConfig}
    >
      {/* Droppable hit area */}
      <div {...listeners} className="absolute inset-0 z-0" />

      {/* Optional: drop space indicator */}
      {isOver && (
        <div className="inset-x-0 top-0 h-100 bg-indigo-100/60 rounded-t-2xl pointer-events-none z-0" />
      )}

      {/* Actual content */}
      <div className="relative z-1 space-y-4">
        {/* Dynamically shifting the cards below */}
        {cardsOffset && isInsideContainer && (
          <motion.div
            style={{
              position: 'relative',
              top: `${cardsOffset.top}px`,
              left: `${cardsOffset.left}px`,
              zIndex: 2,
            }}
            className="bg-indigo-300 rounded-xl p-4"
          >
            Drop here
          </motion.div>
        )}

        {children}
      </div>
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

  const containerRef = React.useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
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
      console.log('startDateScroll: ', direction);

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

      // If there's no drop target, just clean up and return
      console.log('ZZ: updatedEvents 1', over);
      if (!over) return;

      const fromDate = Object.keys(events).find((date) =>
        events[date]?.some((e) => e.id === active.id)
      );

      // Check if the drop target is a valid day
      const toDateId = over.id as string;

      // Extract the date from the droppable ID
      const toDate = toDateId.replace('droppable-day-', '');

      // If source and destination are the same, no need to update
      if (!fromDate || fromDate === toDate || !dayjs(toDate)?.isValid()) return;

      // Find the event being dragged
      const draggedEvent = events[fromDate]?.find((e) => e.id === active.id);

      if (!draggedEvent) return;

      // Update the events object with the new event position
      const updatedEvents = {
        ...events,
        [fromDate]: events[fromDate].filter((e) => e.id !== active.id),
        [toDate]: [draggedEvent, ...(events[toDate] || [])],
        // ?.sort((a, b) => {
        //   const timeA = dayjs(a.time, 'h:mm A').valueOf();
        //   const timeB = dayjs(b.time, 'h:mm A').valueOf();
        //   return timeA - timeB;
        // }),
      };

      // Clean up empty dates
      if (updatedEvents[fromDate].length === 0) {
        delete updatedEvents[fromDate];
      }

      console.log('ZZ: updatedEvents', updatedEvents, toDate, fromDate);

      // Update the state
      setEvents(updatedEvents);
    },
    [events, stopDateScroll, setEvents, setDraggedEvent]
  );

  const [isContainerDragging, setIsContainerDragging] = useState(false);

  const handleDragMove = useCallback(
    (event: DragMoveEvent) => {
      // Skip edge detection if we're dragging the container
      if (isContainerDragging) return;

      const container = containerRef?.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const activeRect = event.active.rect.current?.translated;

      if (!activeRect) return;

      // Use the left side of the dragged item for more accurate edge detection
      const edge = isMobile ? 5 : 20;

      console.log('handleDragMove Item center:', activeRect, rect.left, rect.right);

      // Check if the center of the dragged item is in the edge zones
      if (activeRect.left + edge < rect.left) {
        console.log('Starting prev scroll');
        startDateScroll('prev');
      } else if (activeRect.right - edge > rect.right) {
        console.log('Starting next scroll');
        startDateScroll('next');
      } else {
        stopDateScroll();
      }
    },
    [startDateScroll, stopDateScroll, isContainerDragging, isMobile]
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
      const currentDate = dayjs(selectedDate);
      const nextDate = dayjs(newDate);

      setSelectedDate(newDate);
    },
    [selectedDate, setSelectedDate]
  );

  const currentDate = useMemo(() => dayjs(selectedDate).format('YYYY-MM-DD'), [selectedDate]);

  const currentDateEvents = useMemo(() => events[currentDate] || [], [events, currentDate]);

  const formattedDate = useMemo(() => dayjs(selectedDate).format('ddd MMM D YYYY'), [selectedDate]);

  // Use the original dndContextProps directly
  const dndContextPropsSimplified = useMemo(
    () => ({
      onDragStart: handleDragStart,
      onDragEnd: handleDragEnd,
      onDragMove: handleDragMove,
    }),
    [handleDragStart, handleDragEnd, handleDragMove]
  );

  return (
    <div>
      <DndContext sensors={sensors} {...dndContextPropsSimplified}>
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
            //   key={currentDate}
            // initial={headerInitialConfig}
            // animate={headerAnimateConfig}
            // exit={headerExitConfig}
            transition={transitionConfig}
          >
            <DroppableDay date={currentDate} isActive={!!draggedEvent}>
              {/* <AnimatePresence mode="sync"> */}
              <SortableContext
                items={currentDateEvents.map((e) => e.id)}
                // strategy={horizontalListSortingStrategy}
              >
                {currentDateEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={eventCardInitialConfig}
                    animate={eventCardAnimateConfig}
                    exit={eventCardExitConfig}
                    transition={eventCardTransitionConfig}
                  >
                    <EventCard event={event} onClick={() => handleCardClick(event)} />
                  </motion.div>
                ))}
              </SortableContext>
              {currentDateEvents.length === 0 && (
                <motion.p
                  initial={eventCardInitialConfig}
                  animate={eventCardAnimateConfig}
                  exit={eventCardExitConfig}
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
                <EventCard event={draggedEvent} onClick={() => {}} disableLayoutId />
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
