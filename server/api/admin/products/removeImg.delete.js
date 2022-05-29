import formidable from "formidable";
import { firstValues } from 'formidable/src/helpers/firstValues.js';
import {
    getFirestore
} from "firebase-admin/firestore";

const db = getFirestore();
import fs from "fs";
import setFilePath from "~/helpers/upload/setFilePath";

export default defineEventHandler(async (event) => {

    try {

        const form = formidable();

        const {id, url} = await new Promise((resolve, reject) => {
            form.parse(event.req, (err, fields, files) => {
                resolve(firstValues(form, fields))
            });
        })

        const images = (await db.collection('products').doc(id).get()).data().images;

        const index = images.findIndex(image => {
            return image === url;
        });

        if (index > -1) {

            if (fs.existsSync(setFilePath('/public' + images[index]))) {
                fs.unlinkSync(setFilePath('/public' + images[index]));
            }

            images.splice(index, 1); // 2nd parameter means remove one item only

            await db.collection('products').doc(id).update({images: images});
        }

        return {id}

    } catch (e) {
        event.res.statusCode = 401;
        event.res.end(JSON.stringify({
            msg: 'Unauthenticated'
        }));
    }

})