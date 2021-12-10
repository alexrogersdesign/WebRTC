import Message from '../shared/classes/Message';
import User from '../shared/classes/User';

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
