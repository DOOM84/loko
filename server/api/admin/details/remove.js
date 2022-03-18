import formidable from "formidable";
import { firstValues } from 'formidable/src/helpers/firstValues.js';
import {
    getFirestore
} from "firebase-admin/firestore";

const db = getFirestore();
import fs from "fs";

export default async (req, res) => {

    if (req.originalUrl === '/api/admin/details/remove' && req.method.toLowerCase() === 'post') {
        try {

            const form = formidable();

            const {id} = await new Promise((resolve, reject) => {
                form.parse(req, (err, fields, files) => {
                    resolve(firstValues(form, fields))
                });
            })

            const {image} = (await db.collection('details').doc(id).get()).data();

            await db.collection('details').doc(id).delete();

            const productsSnap = await db.collection('products')
                .where('details', 'array-contains',
                    id).get();

            await Promise.all(productsSnap.docs.map(async (doc) => {
                const filteredDet = doc.data().details.filter( det => det !== id)
                await db.collection('products').doc(doc.id).update({details: filteredDet});
            }))

            if (fs.existsSync('public' + image)) {
                fs.unlinkSync('public' + image);
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
