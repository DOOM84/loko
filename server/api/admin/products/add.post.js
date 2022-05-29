import formidable from "formidable";
import { firstValues } from 'formidable/src/helpers/firstValues.js';
import slugify from "slugify";
import {
    getFirestore
} from "firebase-admin/firestore";
import * as yup from "yup";
const db = getFirestore();
import prepareFileInfo from "~/helpers/upload/prepareFileInfo";
import uploadFile from "~/helpers/upload/uploadFile";


const schema = yup.object({

    added: yup.object({
        title: yup.string('Название должно быть строкой')
            .trim('Введите название').required('Введите название'),
    })
})

const fileSchema = yup.object().shape({
    file: yup.mixed().required('File is required'),
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

                await fileSchema.validate({
                    file: files.file
                });

                added.slug = slugify(added.title, {strict: true}).toLowerCase();

                const picPath = prepareFileInfo(files.file.newFilename, '/public/img/products/thumbnails/');

                const {mainImage} =  await uploadFile(files.file, '/public/',  {
                    mainImage: true,
                    mainImagePath: picPath,
                    mainImageWidth: 160,
                    mainImageHeight: 120,
                });

                added.thumbnail = mainImage.substring(mainImage.indexOf('/img'));

                if(keys.length){

                    const images = await Promise.all(keys.map(async (key, index) => {

                        const picPath = prepareFileInfo(files[key].newFilename, '/public/img/products/');

                        return await uploadFile(files[key], '/public/', {
                            multipleImages: true,
                            multipleImagesPath: picPath,
                            multipleImagesWidth: 1000,
                            multipleImagesHeight: null,
                        });
                    }))

                    added.images = images.map((image)=>{

                        return image.pic.substring(image.pic.indexOf('/img'));
                    })

                }

                await db.collection('products').doc(added.slug).set(added);

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
        const { id } = await db.collection('products').add(added);
        added.id = id;
        await sharp(uploadPath).resize({height: 120, width: 160, fit: 'outside'})
            .toFile(thumbnail)
    }else{
        added.images.push(newPath.substring(6));
        await db.collection('products').doc(added.id).update(added);
        await sharp(uploadPath).resize({height: 500, width: 1000, fit: 'outside', /!*position: 'right top',*!/})
            .toFile(newPath)
    }

}*/

