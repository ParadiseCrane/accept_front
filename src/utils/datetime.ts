export const getLocalDate = (date: Date) => {
  return timezoneDate(date).toLocaleString();
};

export const concatDateTime = (date: Date, time: Date) => {
  date.setHours(0, 0, 0, 0);
  const justTime = time.getTime() % (24 * 60 * 60 * 1000);
  date.setTime(date.getTime() + justTime);
  return date;
};

export const timezoneDate = (date: Date): Date => {
  return new Date(
    new Date(date).getTime() -
      new Date().getTimezoneOffset() * 60 * 1000
  );
};

export const UTCDate = (date: Date): Date => {
  return new Date(
    date.getTime() - new Date().getTimezoneOffset() * 60 * 1000
  );
};

const addFrontZero = (number: number) =>
  number > 9 ? number.toString() : '0' + number;

const getLabeledTime = (time: number) => ({
  seconds: addFrontZero(Math.floor(time) % 60),
  minutes: addFrontZero(Math.floor(time / 60) % 60),
  hours: addFrontZero(Math.floor(time / 60 / 60) % 24),
  days: Math.floor(time / 60 / 60 / 24) % 30,
  months: Math.floor(time / 60 / 60 / 24 / 30) % 12,
  years: Math.floor(time / 60 / 60 / 24 / 30 / 12),
});

export const timerDate = (time: number): any => {
  return getLabeledTime(time / 1000);
};
