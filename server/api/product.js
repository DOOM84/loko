import { getFirestore} from 'firebase-admin/firestore';
import * as url from "url";

import { initializeApp, getApps, cert } from 'firebase-admin/app'
import * as serviceAccount from "../../helpers/loko-821e0-firebase-adminsdk-6vge5-6de9aba71b.json";

const apps = getApps();

if (!apps.length) {
    initializeApp({
        credential: cert(serviceAccount)
    })
}

const db = getFirestore();


export default async (req, res) => {

    try {

        let {id} = url.parse(req.url, true).query;

        const productSnap = await db.collection('products')
            .where('slug', '==', id).get();

        const product = productSnap.docs[0].data();

        let filteredDetails = [];

        await Promise.all(product.details.map(async (detail) => {

            const currentDetail = (await db.collection('details').doc(detail).get()).data();

            filteredDetails.push(currentDetail)

        }))

        product.details = filteredDetails;

        res.setHeader('Content-Type', 'application/json');

        res.end(JSON.stringify({
            product
        }));

    } catch (e) {
        res.statusCode = 404;
        res.end('Error occured. Try again later...');
    }
}
