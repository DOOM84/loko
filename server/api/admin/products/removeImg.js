import formidable from "formidable";
import { firstValues } from 'formidable/src/helpers/firstValues.js';
import {
    getFirestore
} from "firebase-admin/firestore";

const db = getFirestore();
import fs from "fs";

export default async (req, res) => {

    if (req.originalUrl === '/api/admin/products/removeImg' && req.method.toLowerCase() === 'post') {
        try {

            const form = formidable();

            const {id, url} = await new Promise((resolve, reject) => {
                form.parse(req, (err, fields, files) => {
                    resolve(firstValues(form, fields))
                });
            })

           const images = (await db.collection('products').doc(id).get()).data().images;

            const index = images.indexOf(url);

            if (index > -1) {
                images.splice(index, 1); // 2nd parameter means remove one item only

                await db.collection('products').doc(id).update({images: images});
            }

            if (fs.existsSync('public' + url)) {
                fs.unlinkSync('public' + url);
            }

            res.setHeader('Content-Type', 'application/json');

            res.end(JSON.stringify({
                id
            }));
        } catch (e) {
            res.statusCode = 401;
            res.end(JSON.stringify({
                msg: 'Unauthenticated'
            }));
        }
    } else {
        res.statusCode = 404;
        res.end('wrong URL');
    }
}
