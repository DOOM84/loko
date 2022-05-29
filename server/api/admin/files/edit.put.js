import fs from "fs";
import formidable from "formidable";
import { firstValues } from 'formidable/src/helpers/firstValues.js';

import {
    getFirestore
} from "firebase-admin/firestore";
import * as yup from "yup";
import setFilePath from "~/helpers/upload/setFilePath";
import uploadFile from "~/helpers/upload/uploadFile";
const db = getFirestore();

const schema = yup.object({

    added: yup.object({
        title: yup.string('Название должно быть строкой')
            .trim('Введите название').required('Введите название'),
    })
})


export default defineEventHandler(async (event) => {

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
            form.parse(event.req, (err, fields, files) => {
                resolve({files: firstValues(form, files), fields: firstValues(form, fields), err})
            });
        })

        const added = JSON.parse(fields.data);

        if (err || (files.file && !allowedTypes.includes(files.file.mimetype)) /*|| files.avatar.size > maxFileSize*/) {
            event.res.statusCode = 422;
            event.res.end(JSON.stringify({msg: 'Неверный тип или размер файла превышен'}));
        } else {

            try {

                await schema.validate({
                    added,
                });

                if(files.file){

                    if (fs.existsSync(setFilePath('/public' + added.url))) {
                        fs.unlinkSync(setFilePath('/public' + added.url));
                    }

                    const {newPath} = await uploadFile(files.file, '/public/img/uploads/');

                    added.url = newPath.substring(newPath.indexOf('/img'));

                }

                await db.collection('files').doc(added.id).update(added);

                return {result: added};

            } catch (e) {
                if (e.path) {
                    event.res.statusCode = 422;
                    event.res.end(JSON.stringify({
                        msg: e.errors[0]
                    }));

                } else {

                    event.res.setHeader('Content-Type', 'application/json');
                    event.res.statusCode = 401;
                    event.res.end(JSON.stringify({msg: 'Ошибка! Вы не авторизованы!'}));

                }
            }
        }
})

