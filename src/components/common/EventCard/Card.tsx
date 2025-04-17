'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CardProps } from './EventCard.types';
import Button from '@/components/core/Button';
import { CircleX } from 'lucide-react';

const Card: React.FC<CardProps> = ({
  event,
  isDragging,
  onClose,
  isMinimal,
  fullView,
  disableLayoutId,
}) => {
  return (
    <motion.div
      className={` bg-white relative ${isMinimal ? 'rounded-xl' : 'rounded-2xl'} shadow-sm cursor-pointer overflow-hidden group ${isDragging ? 'touch-none' : ''}`}
      layoutId={disableLayoutId ? undefined : `card-${event.id}`}
    >
      <motion.div
        className={`relative ${isMinimal ? 'aspect-[12/4]' : fullView ? 'aspect-[16/9]' : 'aspect-[14/5]'}`}
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
            className={` ${isMinimal ? ' absolute top-1 right-1 text-xs py:0.8 px-1.5' : 'text-lg py-1 px-3'}  bg-indigo-200 text-indigo-800 rounded-full text-sm font-medium`}
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
        {onClose && (
          <Button
            title="Close"
            onClick={() => onClose()}
            containerClassName="mt-8"
            startIcon={<CircleX size={16} />}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export default React.memo(Card);
