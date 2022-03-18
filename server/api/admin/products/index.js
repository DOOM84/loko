import { getFirestore} from 'firebase-admin/firestore';

const db = getFirestore();


export default async (req, res) => {

    try {

        const productsSnap = await db.collection('products').get();

        const products = productsSnap.docs.map((doc) => {
            return {...doc.data(), id: doc.id}
        });

        const detailsSnap = await db.collection('details').get();

        const details = detailsSnap.docs.map((doc) => {
            return {...doc.data(), id: doc.id}
        });

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            products,
            details
        }));



    } catch (e) {

        res.statusCode = 404;
        res.end('Error occurred. Try again later...');
        /*res.writeHead(401, {
            "Set-Cookie": `token=; HttpOnly; path=/; max-age=0`,
        });
        //res.statusCode = 401;
        res.end(JSON.stringify({msg: 'no or expired token'}));*/
    }

}
