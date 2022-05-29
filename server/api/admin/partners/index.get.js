import { getFirestore} from 'firebase-admin/firestore';

const db = getFirestore();


export default defineEventHandler(async (event) => {

    try {

        const partnersSnap = await db.collection('partners').get();

        const partners = partnersSnap.docs.map((doc) => {
            return {...doc.data(), id: doc.id}
        });

        return {
            partners
        };



    } catch (e) {

        event.res.statusCode = 404;
        event.res.end('Error occurred. Try again later...');
    }

})
