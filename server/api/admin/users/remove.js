import admin from "firebase-admin";
import formidable from "formidable";
import { firstValues } from 'formidable/src/helpers/firstValues.js';
//import {get, getDatabase, query, ref, remove} from "firebase/database";
//import fs from "fs";

export default async (req, res) => {

    if (req.originalUrl === '/api/admin/users/remove' && req.method.toLowerCase() === 'post') {
        try {

            const form = formidable();

            const {data} = await new Promise((resolve, reject) => {
                form.parse(req, (err, fields, files) => {
                    resolve(firstValues(form, fields))
                });
            })

            const {id} = JSON.parse(data);

            await admin.auth().deleteUser(id);

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
