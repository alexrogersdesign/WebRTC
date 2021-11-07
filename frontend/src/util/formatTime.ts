import Message from '../shared/classes/Message';


/**
 * Formats provided time input to provide a user friendly string which
 * displays the difference between current time
 * (how long ago the time occurred).
 * @param {Date}time The time to format
 * @return {string} The difference in time
 */
export function getTimeDifference(time:Date) {
  const timeDiff = Math.floor((Date.now() - time.getTime()) / (60_000));
  const midnight = new Date().setHours(0, 0, 0, 0);
  const beforeMidnight = midnight > time.getTime();
  let timeToDisplay = '';
  if (beforeMidnight) {
    timeToDisplay = time.toLocaleString([],
        {weekday: 'long', hour: '2-digit', minute: '2-digit'},
    );
  } else if (timeDiff === 0) timeToDisplay = 'now';
  else if (timeDiff ===1) timeToDisplay = `${timeDiff} minute ago`;
  else if (timeDiff < 60) timeToDisplay = `${timeDiff} minutes ago`;
  else if (timeDiff < 60 * 24) {
    timeToDisplay = time.toLocaleTimeString(
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

