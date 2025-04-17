import dayjs, { Dayjs } from 'dayjs';

const useWeekDays = () => {
  const getCurrentDays = (currentDate: Dayjs) => {
    return Array.from({ length: 7 }, (_, i) => {
      return dayjs(currentDate).add(i - 3, 'day');
    });
  };

  return {
    getCurrentDays,
  };
};

export default useWeekDays;
