import React, { useMemo } from 'react';
import { useDroppable, useDndContext } from '@dnd-kit/core';
import { useIsMobile } from '@/hooks/useIsMobile';
import { motion } from 'framer-motion';

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
  const { active } = useDndContext();
  const isSameSpot = active?.id && active?.data?.current?.date === date;
  const { isMobile } = useIsMobile();

  console.log('AA: DroppableDay', isActive, active, date);

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
        containerRef.current = node; // Store the container reference
      }}
      className="relative min-h-[200px] rounded-2xl p-4 transition-colors"
      style={{
        ...backgroundStyle,
      }}
      animate={animateConfig}
      transition={transitionConfig}
    >
      {active?.id && !isSameSpot && (
        <div
          className={`inset-x-0 top-0 ${isMobile ? 'h-20' : 'h-80'} mb-10 bg-indigo-100/60 rounded-2xl  z-0`}
        />
      )}

      {/* Actual content */}
      <div className="relative z-1 space-y-4">{children}</div>
    </motion.div>
  );
});

export default DroppableDay;
