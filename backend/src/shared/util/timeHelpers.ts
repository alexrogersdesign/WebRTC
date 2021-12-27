import Message from '../classes/Message.js';
// import Meeting from '../shared/classes/Meeting.js';

const today = new Date();

/**
 * Format time into a string as: Month DD HH:MM PM/AM in the local time zone
 * @param {Date} date object to format
 * @return {string} The date as string in the above format
 */
export function toLocalStringMonth(date:Date) {
  return date.toLocaleTimeString([],
      {month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit'});
}
/**
 * Format time into a string as: Weekday HH:MM PM/AM in the local time zone
 * @param {Date} date object to format
 * @return {string} The date as string in the above format
 */
export function toLocalStringWeekday(date:Date) {
  return date.toLocaleTimeString([],
      {weekday: 'long', hour: 'numeric', minute: '2-digit'});
}
/**
 * Format time into a string as: HH:MM PM/AM in the local time zone
 * @param {Date} date object to format
 * @return {string} The date as string in the above format
 */
export function toLocalStringHour(date:Date) {
  return date.toLocaleTimeString([],
      {hour: 'numeric', minute: '2-digit'});
}
/**
 * Calculates the difference in minutes between the supplied Date objects.
 * If a second date is not supplied, the current time is used.
 * @param {Date} dateToCompare object to compare
 * @param {Date?} reference an optional date to reference, defaults to
 * current time.
 * @return {number} The time difference in minutes
 */
export function getTimeDiffMinutes(dateToCompare:Date, reference= new Date()) {
  return Math.floor((reference.getTime() - dateToCompare.getTime()) / (60_000));
}

/**
 * Formats provided time input to provide a user friendly string which
 * displays the difference between current time
 * (how long ago the time occurred).
 * @param {Date}inputTime The time to format
 * @return {string} The difference in time
 */
export function getPastTimeDifference(inputTime:Date) {
  /* timeDiff = difference in time (minutes) */
  const timeDiff = getTimeDiffMinutes(inputTime);
  const oneWeekAgo = new Date().setDate(today.getDate() - 7);
  const beforeOneWeekAgo = oneWeekAgo > inputTime.getTime();
  const midnight = new Date().setHours(0, 0, 0, 0);
  const beforeMidnight = midnight > inputTime.getTime();

  let timeToDisplay = '';
  /* if time is before one week ago include month */
  if (beforeOneWeekAgo) timeToDisplay = toLocalStringMonth(inputTime);
  /* if time is before midnight include weekday */
  else if (beforeMidnight) timeToDisplay = toLocalStringWeekday(inputTime);
  /* if time is not before midnight and within 24 hours include hour */
  else if (timeDiff < 60 * 24) timeToDisplay = toLocalStringHour(inputTime);
  else if (timeDiff < 60) timeToDisplay = `${timeDiff} minutes ago`;
  else if (timeDiff === 1) timeToDisplay = `${timeDiff} minute ago`;
  else if (timeDiff === 0) timeToDisplay = 'now';
  return timeToDisplay;
}

/**
 * Formats message time to display how recently it occurred.
 * @param {Message} message The message to process
 * @return {string} The difference in time.
 */
export function getMessageTimeDifference(message:Message) {
  return getPastTimeDifference(message.timeStamp);
}

/**
 * Rounds up the current time, or a provided date time up to the nearest
 * quarter hour (15 minute increment).
 * @param {Date} date An optional date to use instead of the current date.
 * @return {Date} A new Date object representing the rounded up time.
 */
export function roundDateToQuarterHour(date = new Date()) :Date {
  /* 900_000 = amount of milliseconds in 15 minutes*/
  return new Date( Math.ceil(date.getTime()/900_000)*900_000);
}

// TODO refactor so this variable is not needed.
/**
 * The current time rounded up to the nearest quarter hour
 */
export const dateRoundedToQuarterHour = roundDateToQuarterHour();

/**
 * Adds minutes to supplied Date object.
 * @param {Date} date Base Date to add minutes to
 * @param {number} minutes The amount of minutes to add
 * @return {Date} A new Date object advanced by the supplied minutes
 */
export function addMinutes(date:Date, minutes:number) {
  return new Date(date.getTime() + minutes * 60_000);
}

/**
 * Formats the supplied date into the string format YYYY-MM-DDTHH:MM
 * which is expected by the time picker components.
 * @param {Date} date The Date object to format
 * @return {string} a formatted string
 */
export function formatDateForPicker(date:Date) {
  return new Date(
      /* Compensate for local time zone
      * Multiply by 60_000 converts getTimeZoneOffset (minutes) to milliseconds.
      * Discard the seconds and millisecond information
      * (after first 16 chars) of string.
      * */
      date.getTime() - today.getTimezoneOffset() * 60_000,
  ).toISOString().substring(0, 16);
}

