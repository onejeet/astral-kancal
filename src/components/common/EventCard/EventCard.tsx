'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { EventCardProps } from './EventCard.types';

const EventCard: React.FC<EventCardProps> = ({ event, onClick, disableLayoutId }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: event.id,
  });

  // Simple touch tracking to prevent click after drag
  const touchMoved = React.useRef(false);

  // Set opacity to 0.5 for better visibility during dragging
  const style = React.useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    }),
    [isDragging, transform, transition]
  );

  // Simple handlers for touch events
  const handleTouchStart = () => {
    touchMoved.current = false;
  };

  const handleTouchMove = () => {
    touchMoved.current = true;
  };

  const handleClick = (e: React.MouseEvent) => {
    // Only trigger click if we haven't moved during touch
    if (touchMoved.current || isDragging) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    onClick?.();
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onClick={handleClick}
    >
      <motion.div
        style={style}
        className="bg-white rounded-2xl shadow-sm cursor-pointer overflow-hidden group"
        layoutId={disableLayoutId ? undefined : `card-${event.id}`}
      >
        <motion.div
          className="relative aspect-[16/9]"
          layoutId={disableLayoutId ? undefined : `image-container-${event.id}`}
        >
          <motion.img
            src={event.imageUrl}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover"
            layoutId={`image-${event.id}`}
          />
        </motion.div>

        <motion.div className="p-4" layoutId={`content-${event.id}`}>
          <motion.div
            className="flex justify-between items-center mb-2"
            layoutId={`header-${event.id}`}
          >
            <motion.h3
              className="text-lg font-semibold text-gray-900"
              layoutId={`title-${event.id}`}
            >
              {event.title}
            </motion.h3>
            <motion.span
              className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm font-medium"
              layoutId={`time-${event.id}`}
            >
              {event.time}
            </motion.span>
          </motion.div>
          <motion.p
            className="text-gray-600 text-sm line-clamp-2"
            layoutId={`description-${event.id}`}
          >
            {event.description}
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default React.memo(EventCard);
