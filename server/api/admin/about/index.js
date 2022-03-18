import { getFirestore} from 'firebase-admin/firestore';

const db = getFirestore();


export default async (req, res) => {

    try {

        const about = await db.collection('sections').doc('about').get();

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            about: about.data()
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
