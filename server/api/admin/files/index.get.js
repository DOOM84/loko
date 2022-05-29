import { getFirestore} from 'firebase-admin/firestore';

const db = getFirestore();


export default defineEventHandler(async (event) => {

    try {

        const filesSnap = await db.collection('files').get();

        const files = filesSnap.docs.map((doc) => {
            return {...doc.data(), id: doc.id}
        });

        return {
            files
        };



    } catch (e) {

        event.res.statusCode = 404;
        event.res.end('Error occurred. Try again later...');
    }

})
