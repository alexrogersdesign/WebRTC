import util from 'util';
import multer, {FileFilterCallback} from 'multer';
import {GridFsStorage} from "multer-gridfs-storage";
import {Request, Response} from "express";
import path from 'path'


const MONGODB_URI = process.env.FULL_DB_CONN_STRING as string

//
// const gridFsStorage = new GridFsStorage({
//     url: MONGODB_URI,
//     options: { useNewUrlParser: true, useUnifiedTopology: true },
//     file: (req, file) => {
//         const allowedTypes = ["image/png", "image/jpeg"];
//
//         if (allowedTypes.indexOf(file.mimetype) === -1) {
//             return `${Date.now()}-webRTC-${file.originalname}`;
//         }
//         return {
//             bucketName: "photos",
//             filename: `${Date.now()}-webRTC-${file.originalname}`
//         };
//     }
// });

// type Callback = (a1:null, a2: boolean) => void
const memoryStorage = multer.memoryStorage()
const directStorage = multer.diskStorage({
    destination: function(req, file, cb:any) {
        cb(null, 'images');
    },
    filename: function(req, file, cb:any) {
        cb(null, '-' + Date.now() + path.extname(file.originalname));
    }
});
const fileFilter = (req:Request, file:any, cb:FileFilterCallback) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if(allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

// const multerUploadGrid = multer({ storage: gridFsStorage }).single("icon");
// const multerUploadDirect = multer({ storage: gridFsStorage }).single("icon");
// const uploadGrid = util.promisify(multerUploadGrid);
let uploadDirect = multer({ storage: directStorage, fileFilter });
const uploadMemory = multer({storage:memoryStorage, fileFilter})

// const uploadFile = async (req:Request, res:Response) => {
//     try {
//         await uploadGrid(req, res);
//         console.log(req.file);
//         if (req.file == undefined) {
//             return res.send(`You must select a file.`);
//         }
//         return res.send(`File has been uploaded.`);
//     } catch (error) {
//         console.log(error);
//         return res.send(`Error when trying upload image: ${error}`);
//     }
// };



export {uploadMemory, uploadDirect}