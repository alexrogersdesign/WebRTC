import faker from 'faker';
import fs from 'fs';
import path from 'path';
import {addMinutes, roundDateToQuarterHour} from './timeHelpers.js';
import {selectRandom, toTitleCase} from './helpers.js';
import {demoUsers} from '../demoItemsNode.js';
import Message from '../classes/Message.js';
import Meeting from '../classes/Meeting.js';
import ObjectID from 'bson-objectid';

/**
 * Selects an icon from the meeting-icon folder
 * @return {string} The icon as a base64 encoded Buffer
 */
function selectMeetingIcon() {
  const iconDir = './dist/shared/util/files/meeting-icon';
  const files = fs.readdirSync(iconDir);
  const foundFile = selectRandom(files);
  const pathToFile = path.join(iconDir, foundFile)
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
 * Generates a random message with dummy data.
 * @param {Meeting} meeting The meeting the message should be generated to.
 * @param {User} user An optional value for messages user. If not provided,
 * a random user is selected from the demo user list.
 * @return {Message} The generated message
 */
export function generateMessage(meeting:Meeting, user = selectRandom(demoUsers)) {
  /** An array of possible days to used as the message origin time */
  const days = [1, 1, 1, 2, 3, 7, 20]
  const id = new ObjectID(faker.date.recent(selectRandom(days)).getTime()/1000)
    return new Message(meeting.id, user, faker.lorem.sentence(), id)
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