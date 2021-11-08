import Message from '../shared/classes/Message';
/**
 * Formats provided time input to provide a user friendly string which
 * displays the difference between current time
 * (how long ago the time occurred).
 * @param {Date}inputTime The time to format
 * @return {string} The difference in time
 */
export function getTimeDifference(inputTime:Date) {
  /* timeDiff = difference in time (minutes) */
  const timeDiff = Math.floor((Date.now() - inputTime.getTime()) / (60_000));
  const today = new Date();
  const oneWeekAgo = new Date().setDate(today.getDate() - 7);
  const beforeOneWeekAgo = oneWeekAgo > inputTime.getTime();

  const midnight = new Date().setHours(0, 0, 0, 0);
  const beforeMidnight = midnight > inputTime.getTime();

  let timeToDisplay = '';
  if (beforeOneWeekAgo) {
    /* if time is before one week ago, format time as: Month DD HH:MM PM/AM */
    timeToDisplay = inputTime.toLocaleTimeString([],
        {month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit'},
    );
  } else if (beforeMidnight) {
  /* if time is before midnight, format time as: Weekday HH:MM PM/AM */
    timeToDisplay = inputTime.toLocaleString([],
        {weekday: 'long', hour: '2-digit', minute: '2-digit'},
    );
  } else if (timeDiff === 0) timeToDisplay = 'now';
  else if (timeDiff ===1) timeToDisplay = `${timeDiff} minute ago`;
  else if (timeDiff < 60) timeToDisplay = `${timeDiff} minutes ago`;
  else if (timeDiff < 60 * 24) {
    timeToDisplay = inputTime.toLocaleTimeString(
        [],
        {hour: '2-digit', minute: '2-digit'},
    );
  }
  return timeToDisplay;
};

/**
 * Formats message time to display how recently it occurred.
 * @param {Message} message The message to process
 * @return {string} The difference in time.
 */
export function getMessageTimeDifference(message:Message) {
  return getTimeDifference(message.timeStamp);
}

