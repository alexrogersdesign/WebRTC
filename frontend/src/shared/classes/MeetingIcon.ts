/* eslint-disable require-jsdoc */
// TODO add jsdoc
import ObjectID from 'bson-objectid';
import {Image} from './Image';

/**
 * Represents the icon image for a meeting
 */
class MeetingIcon extends Image {
    private _meetingId: ObjectID;

    constructor(image: string, id: ObjectID, meetingId: ObjectID) {
      super(image, id);
      this._meetingId = meetingId;
    }

    get meetingId(): ObjectID {
      return this._meetingId;
    }

    set meetingId(value: ObjectID) {
      this._meetingId = value;
    }
}

export {MeetingIcon};
