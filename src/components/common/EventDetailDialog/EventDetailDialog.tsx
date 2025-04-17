import { Fragment } from 'react';
import { Dialog } from '@headlessui/react';
import { Event } from '@/types';
import { motion } from 'framer-motion';
import Card from '../EventCard/Card';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

export default function EventDetailModal({ isOpen, onClose, event }: Props) {
  if (!event) return null;

  return (
    <Dialog as={Fragment} open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <motion.div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          aria-hidden="true"
        />

        <div className="flex min-h-full items-center justify-center p-4">
          <Dialog.Panel className="w-3xl h-full">
            <Card event={event} onClose={onClose} fullView />
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
