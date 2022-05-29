import formidable from "formidable";
import { firstValues } from 'formidable/src/helpers/firstValues.js';
import {
    getFirestore
} from "firebase-admin/firestore";
import * as yup from "yup";
const db = getFirestore();
import fs from "fs";
import setFilePath from "~/helpers/upload/setFilePath";
import prepareFileInfo from "~/helpers/upload/prepareFileInfo";
import uploadFile from "~/helpers/upload/uploadFile";


const schema = yup.object({

    added: yup.object({
        title: yup.string('Название должно быть строкой')
            .trim('Введите название').required('Введите название'),
    })
})

export default defineEventHandler(async (event) => {

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
            form.parse(event.req, (err, fields, files) => {
                resolve({files: firstValues(form, files), fields: firstValues(form, fields), err})
            });
        })

        let keys = Object.keys(files).filter((key) => key !== 'file')

        const added = JSON.parse(fields.data);

        if (err || (files.file && !allowedTypes.includes(files.file.mimetype))/*|| files.avatar.size > maxFileSize*/) {
            event.res.statusCode = 422;
            event.res.end(JSON.stringify({msg: 'Неверный тип или размер файла превышен'}));
        } else {

            try {

                await schema.validate({
                    added,
                });

                if(files.file){

                    if(added.mainImg){
                        if (fs.existsSync(setFilePath('/public' + added.mainImg))) {
                            fs.unlinkSync(setFilePath('/public' + added.mainImg));
                        }
                    }

                    if (fs.existsSync(setFilePath('/public' + added.thumbnail))) {
                        fs.unlinkSync(setFilePath('/public' + added.thumbnail));
                    }

                    const picPath = prepareFileInfo(files.file.newFilename, '/public/img/products/thumbnails/');

                    const {mainImage} =  await uploadFile(files.file, '/public/',  {
                        mainImage: true,
                        mainImagePath: picPath,
                        mainImageWidth: 160,
                        mainImageHeight: 120,
                    });

                    added.thumbnail = mainImage.substring(mainImage.indexOf('/img'));
                }

                if(keys.length){

                    if (!added.images) {
                        added.images = []
                    }

                    const images = await Promise.all(keys.map(async (key, index) => {

                        const picPath = prepareFileInfo(files[key].newFilename, '/public/img/products/');

                        return await uploadFile(files[key], '/public/', {
                            multipleImages: true,
                            multipleImagesPath: picPath,
                            multipleImagesWidth: 1000,
                            multipleImagesHeight: null,
                        });
                    }))

                    const newImages = images.map((image)=>{

                        return image.pic.substring(image.pic.indexOf('/img'));
                    })

                    added.images.push(...newImages)
                }

                await db.collection('products').doc(added.slug).update(added);

                return {result: added};

            } catch (e) {

                console.log(e);

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

/*async function uploadImg(file, added, mainImg = false){

    let uploadPath = file.filepath;
    let fileName = file.newFilename;
    let ext = fileName.substring(fileName.indexOf('.') + 1);

    let nameWithSalt = Date.now() + getRandom(10000000, 1) + (+new Date).toString(36).slice(-5);

    let newPath = 'public/img/products/' + nameWithSalt + '.' + ext;
    let thumbnail = 'public/img/products/thumbnails/'+ nameWithSalt + '.' + ext;

    if(mainImg){
        added.mainImg = newPath.substring(6);
        added.thumbnail = thumbnail.substring(6);
        await sharp(uploadPath).resize({height: 120, width: 160, fit: 'outside'})
            .toFile(thumbnail)
    }else{
        added.images.push(newPath.substring(6));
        await sharp(uploadPath).resize({height: 500, width: 1000, fit: 'outside', /!*position: 'right top',*!/})
            .toFile(newPath)
    }

}*/

