import Message from '../classes/Message.js';
import User from '../classes/User.js';

export const promiseWithTimeout = <T>
  (timeoutMs: number, promise: () => Promise<T>, failureMessage?: string) => {
  let timeoutHandle: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((resolve, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(new Error(failureMessage));
    }, timeoutMs);
  },
  );

  return Promise.race([
    promise(),
    timeoutPromise,
  ]).then((result) => {
    clearTimeout(timeoutHandle);
    return result;
  });
};

/**
 * Determines whether or not the supplied message should be displayed
 * as incoming or outgoing depending on the supplied user.
 *
 * Checks whether the user value of the message matches the supplied
 * user Parameter. If they match, the direction is 'outgoing',
 * otherwise the direction is 'incoming'.
 * @param {Message} message  The message to check
 * @param {User} user The current user to validate the message against.
 * @return {'outgoing'|'incoming'} The determined direction the message
 * should be displayed as: either 'outgoing' or 'incoming'
 */
export function getMessageDirection(message: Message, user: User) {
  return message.user.id.toString() === user?.id.toString() ?
    'outgoing' :
    'incoming';
}
/**
 * Converts the provided string to TitleCase
 * @param {string} str The string to convert.
 * @return {string} The converted string in TitleCase.
 */
export function toTitleCase(str: string) {
  return str.replace(
      /\w\S*/g,
      (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      },
  );
}

/**
 * A comparator function that attempts to determine whether two parameters
 * can be evaluated to be within a specified range. If so,
 * the difference is returned. Otherwise - 1 is returned. If either of the
 * parameters cannot be evaluated as a number, -1 is returned.
 * @param {any} a The first parameter to compare
 * @param {any} b The second parameter to compare against the first .
 * @param {number} delta The specified range the values should be within.
 * @param {number} aFactor An optional factor to be applied to the first
 * parameter after it has been evaluated as a number.
 * @param {number} bFactor An optional factor to be applied to the second
 * parameter after it has been evaluated as a number.
 * @return {number} The difference between the values if the values are
 * within the specified range or -1 if they are not within the specified range.
 */
export function withinRange(
    a:any, b:any, delta:number, aFactor = 1, bFactor = 1,
) {
  try {
    const inputA = parseInt(a) * aFactor;
    const inputB = parseInt(b) * bFactor;
    const difference = Math.abs(inputA - inputB);
    if (difference > delta) return -1;
    else return difference;
  } catch (e) {
    console.error(e);
    return -1;
  }
}

/**
 * Converts an object with accessors (getters) to an object with keys representing
 * the accessed values (removes _ from an object's keys).
 * @param {Object} item The item to process.
 * @return {{[p: string]: any}} The processed item.
 */
export function stripData(item: Object) {
  const removeUnderscore = (str: string) => {
   return str.replace(/(_)(.)/g, (_, __, v) => v)
  }
  return Object.fromEntries(Object.entries(item).map(([key, value]) => [removeUnderscore(key), value]))

}