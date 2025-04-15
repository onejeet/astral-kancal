import { Event } from '@/types';

export interface EventCardProps {
  event: Event;
  onClick?: () => void;
  disableLayoutId?: boolean;
}
