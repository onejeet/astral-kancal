'use client';

import React from 'react';
import { CSS } from '@dnd-kit/utilities';
import { EventCardProps } from './EventCard.types';
import { useDraggable } from '@dnd-kit/core';
import Card from './Card';

const EventCard: React.FC<EventCardProps> = ({
  event,
  isMinimal,
  onClick,
  disableLayoutId,
  currentDate,
  onClose,
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
      <Card event={event} isMinimal={isMinimal} isDragging={isDragging} onClose={onClose} />
    </div>
  );
};

export default React.memo(EventCard);
