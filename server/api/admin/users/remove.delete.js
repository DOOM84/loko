import admin from "firebase-admin";
import formidable from "formidable";
import { firstValues } from 'formidable/src/helpers/firstValues.js';

export default defineEventHandler(async (event) => {

        try {

            const form = formidable();

            const {data} = await new Promise((resolve, reject) => {
                form.parse(event.req, (err, fields, files) => {
                    resolve(firstValues(form, fields))
                });
            })

            const {id} = JSON.parse(data);

            await admin.auth().deleteUser(id);

            return {
               id
            };
        } catch (e) {
            event.res.statusCode = 401;
            event.res.end(JSON.stringify({
                msg: 'Unauthenticated'
            }));
        }
})
