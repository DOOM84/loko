import { getFirestore} from 'firebase-admin/firestore';

const db = getFirestore();


export default defineEventHandler(async (event) => {

    try {

        const {id} = useQuery(event);

        const product = (await db.collection('products').doc(id).get()).data();

        if(!product || !product.status){
            const e = new Error('Not found');
            e.code = '404';
            e.statusCode = 404;

            await Promise.reject(e);
        }

        let filteredDetails = [];

        await Promise.all(product.details.map(async (detail) => {

            const currentDetail = (await db.collection('details').doc(detail).get()).data();

            filteredDetails.push(currentDetail)

        }))

        product.details = filteredDetails;

        return {
            product
        };

    } catch (e) {

        event.res.statusCode = 404;
        event.res.end('Error occured. Try again later...');
    }
})
