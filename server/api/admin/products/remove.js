import formidable from "formidable";
import { firstValues } from 'formidable/src/helpers/firstValues.js';
import {
    getFirestore
} from "firebase-admin/firestore";

const db = getFirestore();
import fs from "fs";

export default async (req, res) => {

    if (req.originalUrl === '/api/admin/products/remove' && req.method.toLowerCase() === 'post') {
        try {

            const form = formidable();

            const {id} = await new Promise((resolve, reject) => {
                form.parse(req, (err, fields, files) => {
                    resolve(firstValues(form, fields))
                });
            })

            const {images, mainImg, thumbnail} = (await db.collection('products').doc(id).get()).data();

            await db.collection('products').doc(id).delete();

            images.map((img) => {
                if (fs.existsSync('public' + img)) {
                    fs.unlinkSync('public' + img);
                }
            })

            if (fs.existsSync('public' + mainImg)) {
                fs.unlinkSync('public' + mainImg);
            }

            if (fs.existsSync('public' + thumbnail)) {
                fs.unlinkSync('public' + thumbnail);
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
