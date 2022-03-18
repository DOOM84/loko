import { getFirestore} from 'firebase-admin/firestore';

const db = getFirestore();


export default async (req, res) => {

    try {
        const about = (await db.collection('sections').doc('about').get()).data();
        const contacts = (await db.collection('sections').doc('contacts').get()).data();
        const info = (await db.collection('sections').doc('info').get()).data();
        const services = (await db.collection('sections').doc('services').get()).data();

        const productsSnap = await db.collection('products')
            .where('status', '==', true).select('title', 'slug', 'thumbnail').get();

        const products = productsSnap.docs.map((doc) => {
            return {...doc.data()};
        });

        const filesSnap = await db.collection('files')
            .where('status', '==', true).select('title', 'url').get();

        const files = filesSnap.docs.map((doc) => {
            return {...doc.data()};
        });

        const partnersSnap = await db.collection('partners')
            .where('status', '==', true).select('image').get();

        const partners = partnersSnap.docs.map((doc) => {
            return {...doc.data()};
        });

        res.setHeader('Content-Type', 'application/json');

        res.end(JSON.stringify({
            about: about.status ? about.text_content : '',
            contacts: contacts.status ? contacts.text_content : '',
            info: info.status ? info.text_content : '',
            services: services.status ? services.text_content : '',
            products,
            files,
            partners
        }));

    } catch (e) {
        res.statusCode = 404;
        res.end('Error occured. Try again later...');
    }
}
