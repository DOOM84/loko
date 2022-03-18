import fs from "fs";
import formidable from "formidable";
import { firstValues } from 'formidable/src/helpers/firstValues.js';
import slugify from "slugify";

import {
    getFirestore
} from "firebase-admin/firestore";
import * as yup from "yup";
const db = getFirestore();

const schema = yup.object({

    added: yup.object({
        title: yup.string('Название должно быть строкой')
            .trim('Введите название').required('Введите название'),
    })
})



export default async (req, res) => {

    if (req.originalUrl === '/api/admin/files/edit' && req.method.toLowerCase() === 'post') {

        const fsPromises = fs.promises;

        const form = formidable({
            encoding: 'utf-8',
            keepExtensions: true,
            // 2 mb for news image and attachments. override otherwise
            maxFileSize: 20 * 1024 * 1024,
        });

        const allowedTypes = ['application/pdf'];
        //const maxFileSize = 2000000;

        const {files, fields, err} = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                resolve({files: firstValues(form, files), fields: firstValues(form, fields), err})
            });
        })

        const added = JSON.parse(fields.data);

        if (err || (files.file && !allowedTypes.includes(files.file.mimetype)) /*|| files.avatar.size > maxFileSize*/) {
            res.statusCode = 422;
            res.end(JSON.stringify({msg: 'Неверный тип или размер файла превышен'}));
        } else {

            try {

                await schema.validate({
                    added,
                });

                let oldPath;
                let newPath;
                let toRemove;

                if(files.file){
                    toRemove = added.url
                    oldPath = files.file.filepath;
                    let fileName = files.file.newFilename;
                    let ext = fileName.substring(fileName.indexOf('.') + 1);

                    let salt = (+new Date).toString(36).slice(-5);
                    newPath = 'public/img/uploads/' + Date.now() + salt + '-' + slugify(added.title).toLowerCase() + '.' + ext;

                    added.url = newPath.substring(6);
                }

                await db.collection('files').doc(added.id).update(added);

                if(files.file){

                    if (fs.existsSync('public' + toRemove)) {
                        await fsPromises.unlink('public' + toRemove);
                    }

                    await fsPromises.rename(oldPath, newPath);
                }


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

