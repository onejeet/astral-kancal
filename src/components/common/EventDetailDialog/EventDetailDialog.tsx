import { Fragment } from 'react';
import { Dialog } from '@headlessui/react';
import { Event } from '@/types';
import { motion } from 'framer-motion';
import Button from '@/components/core/Button';

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
          <Dialog.Panel className="w-full">
            <motion.div
              layoutId={`card-${event.id}`}
              className="relative w-full min-w-full sm:min-w-[600px] max-w-[800px] overflow-hidden rounded-3xl bg-white shadow-2xl mx-auto"
            >
              <motion.div
                className="relative aspect-[16/9]"
                layoutId={`image-container-${event.id}`}
              >
                <motion.img
                  src={event.imageUrl}
                  alt={event.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  layoutId={`image-${event.id}`}
                />
              </motion.div>

              <motion.div className="p-6 sm:p-8" layoutId={`content-${event.id}`}>
                <motion.div
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
                  layoutId={`header-${event.id}`}
                >
                  <motion.h2
                    className="text-2xl sm:text-3xl font-bold text-gray-900"
                    layoutId={`title-${event.id}`}
                  >
                    {event.title}
                  </motion.h2>
                  <motion.span
                    className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-full text-sm font-medium"
                    layoutId={`time-${event.id}`}
                  >
                    {event.time}
                  </motion.span>
                </motion.div>

                <motion.p
                  className="text-gray-600 text-base sm:text-lg"
                  layoutId={`description-${event.id}`}
                >
                  {event.description}
                </motion.p>
                <Button title="Close" onClick={onClose} containerClassName="mt-8" />
              </motion.div>
            </motion.div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
