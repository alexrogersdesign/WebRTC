import faker from 'faker';
import fs from 'fs';
import path from 'path';
import {addMinutes, roundDateToQuarterHour} from './timeHelpers.js';
import {toTitleCase} from './helpers.js';
import {demoUsers} from '../demoItemsNode.js';
import Message from '../classes/Message.js';
import Meeting from '../classes/Meeting.js';


/**
 * Selects a random item from a provided array.
 * @template T
 * @param {Array<T>} array The array to select from.
 * @return {T} The selected item from the array.
 */
function selectRandom<T>(array: Array<T>) {
  return array[Math.floor(Math.random() * array.length)]
}



/**
 * Selects an icon from the meeting-icon folder
 * @return {string} The icon as a base64 encoded Buffer
 */
function selectMeetingIcon() {
  const iconDir = './dist/shared/util/files/meeting-icon';
  const files = fs.readdirSync(iconDir);
  const foundFile = selectRandom(files);
  console.log('found file', foundFile);
  const pathToFile = path.join(iconDir, foundFile)
  console.log('path to file', pathToFile);
  return fs.readFileSync(pathToFile, {encoding: 'base64'})
}

/**
 * Generates a meeting with random data.
 * @return {Meeting} The generated meeting.
 */
export function generateMeeting() {
  const durations = [15,30,45,60,90,120]
  const start = roundDateToQuarterHour(faker.date.future(0));
  const end = addMinutes(start, selectRandom(durations))
  const meeting = new Meeting(
    toTitleCase(faker.company.bs()),
    faker.company.catchPhrase(),
    start,
    end,
  )
  meeting.icon = selectMeetingIcon()
  return meeting;
}

/**
 * Generates an array of meetings of a determined length.
 * @param {number} length The length of the generated meeting array.
 * @return {Meeting[]} The generated array of meetings.
 */
export function generateManyMeetings(length: number) {
  return Array.from({length:length}, () => generateMeeting())
}

/**
 * Generates a random message.
 * @param {Meeting} meeting The meeting the message should be generated to.
 * @param {User} user An optional value for messages user. If not provided,
 * a random user is selected from the demo user list.
 * @return {Message} The generated message
 */
export function generateMessage(meeting:Meeting, user = selectRandom(demoUsers)) {
    return new Message(meeting.id, user, faker.lorem.sentence())
}

/**
 * Generates an array of meetings of a determined length.
 * @param {Meeting} meeting The meeting to use for the generated messages.
 * @param {number} length The length of the generated meeting array.
 * @return {Message[]} The generated array of messages.
 */
export function generateManyMessages(meeting: Meeting, length: number) {
  return Array.from({length:length}, () => generateMessage(meeting))
}