import multer, {FileFilterCallback} from 'multer';
import {Request} from "express";
import path from 'path'


/** Middleware used when storing files in memory only */
const memoryStorage = multer.memoryStorage()
/** Middleware used when storing file to disk */
const diskStorage = multer.diskStorage({
    /** Sets the destination folder  */
    destination: function(req, file, callback:any) {
        callback(null, 'images');
    },
    /** Prepend timestamp to to the file name. */
    filename: function(req, file, callback:any) {
        callback(null, '-' + Date.now() + path.extname(file.originalname));
    }
});
/** Middleware to filter out files that should not be uploaded.  */
const fileFilter = (req:Request, file:any, callback:FileFilterCallback) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if(allowedFileTypes.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(null, false);
    }
}
/** Middleware for converting HTTP formdata to a usable file. Stores the file
 * to disk. This is useful for large files or if the files need to be accessed
 * later. */
const uploadDisk = multer({storage:diskStorage, fileFilter});
/** Middleware for converting HTTP formdata to a usable file. Stores the file
 * in memory only. This is useful for small temporary files. No need to garbage
 * collect files on disk.*/
const uploadMemory = multer({storage:memoryStorage, fileFilter})

export {uploadMemory, uploadDisk}