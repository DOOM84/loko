import { getFirestore} from 'firebase-admin/firestore';

const db = getFirestore();


export default defineEventHandler(async (event) => {

    try {

        const detailsSnap = await db.collection('details').get();

        const details = detailsSnap.docs.map((doc) => {
            return {...doc.data(), id: doc.id}
        });

       return {
            details,
        };



    } catch (e) {

        event.res.statusCode = 404;
        event.res.end('Error occurred. Try again later...');
    }

})
