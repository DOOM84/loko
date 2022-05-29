import formidable from "formidable";
import {firstValues} from 'formidable/src/helpers/firstValues.js';
import uploadFile from "~/helpers/upload/uploadFile";
import prepareFileInfo from "~/helpers/upload/prepareFileInfo";

export default defineEventHandler(async (event) => {

    const form = formidable({
        encoding: 'utf-8',
        keepExtensions: true,
        // 2 mb for news image and attachments. override otherwise
        maxFileSize: 2 * 1024 * 1024,
    });

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    const {files, err} = await new Promise((resolve, reject) => {
        form.parse(event.req, (err, fields, files) => {
            resolve({files: firstValues(form, files), err})
        });
    })

    if (err || !allowedTypes.includes(files.upload.mimetype) /*|| files.avatar.size > maxFileSize*/) {
        event.res.statusCode = 422;
        event.res.end(JSON.stringify({msg: 'Неверный тип или размер файла превышен'}));
    } else {

        try {

            const picPath = prepareFileInfo(files.upload.newFilename, '/public/img/uploads/');

            const {mainImage} =  await uploadFile(files.upload, '/public/',  {
                mainImage: true,
                mainImagePath: picPath,
                mainImageWidth: null,
                mainImageHeight: null,
            });

            return {
                fileName: mainImage.substring(mainImage.lastIndexOf('/')+1),
                uploaded: 1,
                url: mainImage.substring(mainImage.indexOf('/img'))
            }

        } catch (e) {
            event.res.setHeader('Content-Type', 'application/json');
            event.res.statusCode = 401;
            event.res.end(JSON.stringify({msg: 'Ошибка! Вы не авторизованы!'}));
        }
    }

})