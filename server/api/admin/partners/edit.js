import formidable from "formidable";
import { firstValues } from 'formidable/src/helpers/firstValues.js';
import sharp from 'sharp';
import {
    getFirestore
} from "firebase-admin/firestore";

const db = getFirestore();

import getRandom from "~/helpers/getRandom";
import fs from "fs";

export default async (req, res) => {

    if (req.originalUrl === '/api/admin/partners/edit' && req.method.toLowerCase() === 'post') {
       // const fsPromises = fs.promises;
        const form = formidable({
            encoding: 'utf-8',
            keepExtensions: true,
            // 2 mb for news image and attachments. override otherwise
            maxFileSize: 20 * 1024 * 1024,
            //multiples: true,
        });

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        //const maxFileSize = 2000000;

        const {files, fields, err} = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                resolve({files: firstValues(form, files), fields: firstValues(form, fields), err})
            });
        })

        const added = JSON.parse(fields.data);

        if (err || (files.file && !allowedTypes.includes(files.file.mimetype))/*|| files.avatar.size > maxFileSize*/) {
            res.statusCode = 422;
            res.end(JSON.stringify({msg: 'Неверный тип или размер файла превышен'}));
        } else {

            try {

                if(files.file){
                    if (fs.existsSync('public' + added.image)) {
                        fs.unlinkSync('public' + added.image);
                    }

                    await uploadImg(files.file, added);
                }

                await db.collection('partners').doc(added.id).update(added);

                res.setHeader('Content-Type', 'application/json');

                res.end(JSON.stringify({result: added}));

            } catch (e) {

                if (e.path) {
                    res.statusCode = 422;
                    res.end(JSON.stringify({
                        msg: e.errors[0]
                    }));

                } else {

                    res.setHeader('Content-Type', 'application/json');
                    res.statusCode = 401;
                    res.end(JSON.stringify({msg: 'Ошибка! Вы не авторизованы!'}));

                }
            }
        }
    } else {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 404;
        res.end(JSON.stringify({msg: 'Wrong Url'}));
    }
}

async function uploadImg(file, added){

    let uploadPath = file.filepath;
    let fileName = file.newFilename;
    let ext = fileName.substring(fileName.indexOf('.') + 1);

    let nameWithSalt = Date.now() + getRandom(10000000, 1) + (+new Date).toString(36).slice(-5);

    let newPath = 'public/img/partners/' + nameWithSalt + '.' + ext;

        added.image = newPath.substring(6);
        await sharp(uploadPath).resize({height: 100, width: 300, fit: 'outside'})
            .toFile(newPath)

}

