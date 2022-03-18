import admin from "firebase-admin";
import formidable from "formidable";
import { firstValues } from 'formidable/src/helpers/firstValues.js';
import * as yup from 'yup';

const schema = yup.object({
    created: yup.object({

        displayName: yup.string('Некорректное имя пользователя.').trim('Некорректное имя пользователя.')
            .min(3, 'Некорректное имя пользователя.')
            .max(100, 'Некорректное имя пользователя.')
            .matches(/^[0-9A-Za-zа-яёА-ЯЁ ]*$/, 'Некорректное имя пользователя.')
            .required('Введите имя пользователя'),
        email: yup.string('Введен некорректный Email адрес').trim('Введен некорректный Email адрес')
            .email('Введен некорректный Email адрес').required('Введен некорректный Email адрес'),
        password: yup.string('Пароль не должен быть менее 6 символов')
            .trim('Пароль не должен быть менее 6 символов')
            .min(6, 'Пароль не должен быть менее 6 символов')
            .required('Пароль не должен быть менее 6 символов'),
        passwordConfirmation: yup.string('Пароль не должен быть менее 6 символов')
            .trim('Пароль не должен быть менее 6 символов').required('Подтвердите пароль')
            .oneOf([yup.ref('password'), null], 'Введенные пароли не совпадают.')
    }),
});

export default async (req, res) => {

    if (req.originalUrl === '/api/admin/users/add' && req.method.toLowerCase() === 'post') {

        const form = formidable({
            encoding: 'utf-8',
            keepExtensions: true,
            // 3 mb for news image and attachments. override otherwise
          //  maxFileSize: 2 * 1024 * 1024,
        });

       // const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

        const {fields} = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                resolve({fields: firstValues(form, fields), err})
            });
        })

        const created = JSON.parse(fields.data);

            try {

                await schema.validate({
                    created
                });

                const userRecord = await admin.auth().createUser(
                    {
                        ...created,
                    })

                await admin.auth()
                    .setCustomUserClaims(userRecord.uid, {admin: created.customClaims.admin});

                const createdUser = await admin.auth().getUser(userRecord.uid)

                const result = {
                    email: createdUser.email,
                    displayName: createdUser.displayName,
                    //photoURL: createdUser.photoURL ? createdUser.photoURL.substring(createdUser.photoURL.lastIndexOf('/') + 1) : null,
                    disabled: createdUser.disabled,
                    customClaims: createdUser.customClaims ? createdUser.customClaims : {admin: false},
                    uid: createdUser.uid
                }

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                    result: result
                }));

            } catch (e) {

                if (e.path) {
                    res.statusCode = 422;
                    res.end(JSON.stringify({
                        msg: e.errors[0]
                    }));

                } else {

                    res.setHeader('Content-Type', 'application/json');
                    res.statusCode = 401;
                    res.end(JSON.stringify({msg: 'Ошибка! Вы не авторизованы!'}));

                }
            }


    } else {
        res.statusCode = 404;
        res.end('wrong URL');
    }
}
