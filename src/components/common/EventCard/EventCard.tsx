import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import { EventCardProps } from './EventCard.types';

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: event.id,
  });

  const style = React.useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    }),
    [isDragging, transform, transition]
  );

  const handleClick = (e: React.MouseEvent) => {
    // Don't trigger click when clicking the drag handle
    if (!(e.target as HTMLElement).closest('.drag-handle')) {
      onClick?.();
    }
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-2xl shadow-sm cursor-pointer overflow-hidden group"
      layoutId={`card-${event.id}`}
      onClick={handleClick}
    >
      <motion.div className="relative aspect-[16/9]" layoutId={`image-container-${event.id}`}>
        <motion.img
          src={event.imageUrl}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover"
          layoutId={`image-${event.id}`}
        />
        <motion.div
          {...attributes}
          {...listeners}
          className="drag-handle absolute top-2 right-2 p-1 rounded-lg bg-black/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <GripVertical className="w-5 h-5 text-white" />
        </motion.div>
      </motion.div>

      <motion.div className="p-4" layoutId={`content-${event.id}`}>
        <motion.div
          className="flex justify-between items-center mb-2"
          layoutId={`header-${event.id}`}
        >
          <motion.h3 className="text-lg font-semibold text-gray-900" layoutId={`title-${event.id}`}>
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
  );
};

export default React.memo(EventCard);
