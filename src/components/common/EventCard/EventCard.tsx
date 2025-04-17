'use client';

import React from 'react';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { EventCardProps } from './EventCard.types';
import { useDraggable } from '@dnd-kit/core';

const EventCard: React.FC<EventCardProps> = ({
  event,
  isMinimal,
  onClick,
  disableLayoutId,
  currentDate,
}) => {
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
            transition: 'all 0.2s ease',
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
      className="no-touch-callout relative"
    >
      <motion.div
        className={`bg-white relative ${isMinimal ? 'rounded-xl' : 'rounded-2xl'} shadow-sm cursor-pointer overflow-hidden group ${isDragging ? 'touch-none' : ''}`}
        layoutId={disableLayoutId ? undefined : `card-${event.id}`}
      >
        <motion.div
          className={`relative ${isMinimal ? 'aspect-[12/4]' : 'aspect-[14/5]'}`}
          layoutId={disableLayoutId ? undefined : `image-container-${event.id}`}
        >
          <motion.img
            src={event.imageUrl}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover"
            layoutId={disableLayoutId ? undefined : `image-${event.id}`}
          />
        </motion.div>

        <motion.div
          className={isMinimal ? 'p-2.5' : 'p-4'}
          layoutId={disableLayoutId ? undefined : `content-${event.id}`}
        >
          <motion.div
            className={`flex justify-between items-center ${isMinimal ? '' : 'mb-2'}`}
            layoutId={disableLayoutId ? undefined : `header-${event.id}`}
          >
            <motion.h3
              className={`${isMinimal ? 'text-xs' : 'text-lg'} font-semibold text-gray-900`}
              layoutId={disableLayoutId ? undefined : `title-${event.id}`}
            >
              {event.title}
            </motion.h3>
            <motion.span
              className={`absolute ${isMinimal ? 'top-1 right-1 text-xs py:0.8 px-1.5' : ' top-2 right-2 text-lg py-1 px-3'}  bg-indigo-200 text-indigo-800 rounded-full text-sm font-medium`}
              layoutId={disableLayoutId ? undefined : `time-${event.id}`}
            >
              {event.time}
            </motion.span>
          </motion.div>
          {!isMinimal && (
            <motion.p
              className="text-gray-600 text-sm line-clamp-2"
              layoutId={disableLayoutId ? undefined : `description-${event.id}`}
            >
              {event.description}
            </motion.p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default React.memo(EventCard);
