import { EventsByDate } from '@/types';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const today = dayjs();
export const formatDate = (date: dayjs.Dayjs) => date.format('YYYY-MM-DD');

// Helper to get a random integer between min and max, inclusive
const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Sample titles and descriptions for variety
const sampleEvents = [
  { title: 'Coffee with Alex', description: 'Discuss new project ideas' },
  { title: 'Team Standup', description: 'Weekly progress update' },
  { title: 'Yoga Class', description: 'Relaxation and stretching' },
  { title: 'Product Review', description: 'Review new features with the design team' },
  { title: 'Client Meeting', description: 'Quarterly review with client' },
  { title: 'Design Sprint', description: 'Collaborate on UI/UX improvements' },
  { title: '1:1 with Manager', description: 'Monthly catch-up' },
  { title: 'Sales Call', description: 'Talk to potential customer' },
  { title: 'Hackathon Kickoff', description: 'Start of the 2-day challenge' },
  { title: 'Townhall', description: 'Company-wide updates and Q&A' },
];

// Placeholder image list
const images = [
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
  'https://images.unsplash.com/photo-1486325212027-8081e485255e',
  'https://images.unsplash.com/photo-1449034446853-66c86144b0ad',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',
];

const generateRandomTime = () => {
  const hour = getRandomInt(8, 18); // 8 AM to 6 PM
  const minute = getRandomInt(0, 1) === 0 ? '00' : '30';
  const ampm = hour < 12 ? 'AM' : 'PM';
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${formattedHour}:${minute} ${ampm}`;
};

const events: EventsByDate = {};

// Helper function to add an event
const addEventForDate = (date: dayjs.Dayjs) => {
  const dateKey = formatDate(date);
  if (!events[dateKey]) events[dateKey] = [];

  const sample = sampleEvents[getRandomInt(0, sampleEvents.length - 1)];

  events[dateKey].push({
    id: `event-${Math.random().toString(36).substring(2, 9)}`,
    title: sample.title,
    description: sample.description,
    imageUrl: images[getRandomInt(0, images.length - 1)],
    time: generateRandomTime(),
  });
};

// Generate random events
for (let i = 1; i <= 20; i++) {
  const dayOffset = getRandomInt(-5, 5); // dates from 5 days ago to 5 days ahead
  const dateKey = formatDate(today.add(dayOffset, 'day'));

  if (!events[dateKey]) events[dateKey] = [];

  const sample = sampleEvents[getRandomInt(0, sampleEvents.length - 1)];

  events[dateKey].push({
    id: `event-${i}`,
    title: sample.title,
    description: sample.description,
    imageUrl: images[getRandomInt(0, images.length - 1)],
    time: generateRandomTime(),
  });
}

// Ensure we have events for today, yesterday, and tomorrow
addEventForDate(today); // Today
addEventForDate(today.subtract(1, 'day')); // Yesterday
addEventForDate(today.add(1, 'day')); // Tomorrow
console.log('ZZ: events', events);
// Sort events for each date by time
Object.keys(events).forEach((dateKey) => {
  events[dateKey].sort((a, b) => {
    const aTime = dayjs(a.time?.trim(), ['h:mm A', 'hh:mm A'], true);
    const bTime = dayjs(b.time?.trim(), ['h:mm A', 'hh:mm A'], true);

    console.log(
      `🔍 Sorting "${a.time}" => ${aTime.format('HH:mm')}, "${b.time}" => ${bTime.format('HH:mm')}`
    );

    return aTime.valueOf() - bTime.valueOf();
  });
});

export default events;
