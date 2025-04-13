import { EventsByDate } from '@/types';
import dayjs from 'dayjs';

const today = dayjs();
const formatDate = (date: dayjs.Dayjs) => date.format('YYYY-MM-DD');

const events: EventsByDate = {
  [formatDate(today)]: [
    {
      id: 'event-1',
      title: 'Coffee with Alex',
      description: 'Discuss new project ideas',
      imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
      time: '10:00 AM',
    },
    {
      id: 'event-2',
      title: 'Team Standup',
      description: 'Weekly progress update',
      imageUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e',
      time: '2:00 PM',
    },
    {
      id: 'event-3',
      title: 'Yoga Class',
      description: 'Relaxation and stretching',
      imageUrl: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad',
      time: '5:30 PM',
    },
  ],
  [formatDate(today.add(1, 'day'))]: [
    {
      id: 'event-4',
      title: 'Product Review',
      description: 'Review new features with the design team',
      imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
      time: '11:00 AM',
    },
  ],
  [formatDate(today.add(-1, 'day'))]: [
    {
      id: 'event-5',
      title: 'Client Meeting',
      description: 'Quarterly review with client',
      imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',
      time: '3:00 PM',
    },
  ],
  [formatDate(today.add(-2, 'day'))]: [
    {
      id: 'event-6',
      title: 'Product Review',
      description: 'Quarterly review with client',
      imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',
      time: '3:00 PM',
    },
  ],
  [formatDate(today.add(+2, 'day'))]: [
    {
      id: 'event-7',
      title: 'Client Meeting',
      description: 'Quarterly review with client',
      imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',
      time: '3:00 PM',
    },
  ],
};

export default events;
