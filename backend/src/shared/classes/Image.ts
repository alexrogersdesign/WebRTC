/* eslint-disable require-jsdoc */
// TODO add jsdoc
import ObjectID from 'bson-objectid';

/**
 * An Image class that represents stored images used in the application
 */
class Image {
    private _id: ObjectID;
    private _image: string;

    constructor(image: string, id?: ObjectID) {
      this._id = id?? new ObjectID();
      this._image = image;
    }

    get id(): ObjectID {
      return this._id;
    }

    set id(value: ObjectID) {
      this._id = value;
    }

    get image(): string {
      return this._image;
    }

    set image(value: string) {
      this._image = value;
    }
}

export {Image};
