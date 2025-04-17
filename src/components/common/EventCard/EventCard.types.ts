import { Event } from '@/types';

export interface EventCardProps extends CardProps {
  onClick?: () => void;
  currentDate?: string;
}

export interface CardProps {
  event: Event;
  disableLayoutId?: boolean;
  isMinimal?: boolean;
  isDragging?: boolean;
  onClose?: () => void;
  fullView?: boolean;
}
