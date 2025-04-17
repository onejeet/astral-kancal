'use client';

import React from 'react';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { EventCardProps } from './EventCard.types';
import { useDraggable } from '@dnd-kit/core';

const EventCard: React.FC<EventCardProps> = ({ event, onClick, disableLayoutId, currentDate }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: event.id,
    data: {
      eventId: event.id,
      date: currentDate,
    },
  });

  // Simple touch tracking to prevent click after drag
  const touchMoved = React.useRef(false);

  // Set opacity to 0.5 for better visibility during dragging
  const style = React.useMemo(
    () =>
      disableLayoutId
        ? {
            touchAction: isDragging ? 'none' : 'auto',
          }
        : {
            transform: CSS.Transform.toString(transform),
            opacity: isDragging ? 0 : 1,
            touchAction: isDragging ? 'none' : 'auto',
          },
    [isDragging, transform, disableLayoutId]
  );

  // Simple handlers for touch events
  const handleTouchStart = React.useCallback(() => {
    touchMoved.current = false;
  }, []);

  const handleTouchMove = React.useCallback(() => {
    touchMoved.current = true;
  }, []);

  const handleClick = React.useCallback(
    (e: React.MouseEvent) => {
      // Only trigger click if we haven't moved during touch
      if (touchMoved.current || isDragging) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      onClick?.();
    },
    [isDragging, onClick]
  );

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onClick={handleClick}
      style={style}
      data-draggable-event-card
      className="no-touch-callout"
    >
      <motion.div
        className={`bg-white rounded-2xl shadow-sm cursor-pointer overflow-hidden group ${isDragging ? 'touch-none' : ''}`}
        layoutId={disableLayoutId ? undefined : `card-${event.id}`}
      >
        <motion.div
          className="relative aspect-[14/5]"
          layoutId={disableLayoutId ? undefined : `image-container-${event.id}`}
        >
          <motion.img
            src={event.imageUrl}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover"
            layoutId={disableLayoutId ? undefined : `image-${event.id}`}
          />
        </motion.div>

        <motion.div className="p-4" layoutId={disableLayoutId ? undefined : `content-${event.id}`}>
          <motion.div
            className="flex justify-between items-center mb-2"
            layoutId={disableLayoutId ? undefined : `header-${event.id}`}
          >
            <motion.h3
              className="text-lg font-semibold text-gray-900"
              layoutId={disableLayoutId ? undefined : `title-${event.id}`}
            >
              {event.title}
            </motion.h3>
            <motion.span
              className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm font-medium"
              layoutId={disableLayoutId ? undefined : `time-${event.id}`}
            >
              {event.time}
            </motion.span>
          </motion.div>
          <motion.p
            className="text-gray-600 text-sm line-clamp-2"
            layoutId={disableLayoutId ? undefined : `description-${event.id}`}
          >
            {event.description}
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default React.memo(EventCard);
