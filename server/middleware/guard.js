import {useCookie} from "h3";
import database from '~/helpers/dbConn';

import { initializeApp, getApps, cert } from 'firebase-admin/app'
import * as serviceAccount from "../../helpers/loko-821e0-firebase-adminsdk-6vge5-6de9aba71b.json";

const apps = getApps();

if (!apps.length) {
    initializeApp({
        credential: cert(serviceAccount)
    })
}
database();


export default async (req, res) => {



    const toName = req.originalUrl.split("/");

    if (toName[2] === 'admin' && (toName[toName.length - 1] === 'add' ||
        toName[toName.length - 1] === 'edit' || toName[toName.length - 1] === 'remove')) {

        const token = useCookie(req, 'token')

        try {
            const {access} = await $fetch('/api/check', {params: {token: token}});

            if (!access) {
                await Promise.reject(Error('No access'));
            }

        } catch (e) {

            res.writeHead(403, {
                "Set-Cookie": `token=; HttpOnly; path=/; max-age=0`,
            });

            res.end(JSON.stringify({msg: 'no or expired token'}));
        }

    }
};