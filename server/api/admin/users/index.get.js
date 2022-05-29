import admin from "firebase-admin";

export default defineEventHandler(async (event) => {

    try {

        try {

            const resUsers = [];

                const {users} = await admin.auth().listUsers(1000, '1');

                users.forEach((user)=>{

                    resUsers.push({
                        email: user.email,
                        displayName: user.displayName,
                        //photoURL: user.photoURL ? user.photoURL.substring(user.photoURL.lastIndexOf('/') + 1) : null,
                        disabled: user.disabled,
                        customClaims:  user.customClaims ? user.customClaims : {admin:false},
                        uid: user.uid
                    })
                })

            return {
                users: resUsers
            };

        }catch (e) {

            event.res.setHeader('Content-Type', 'application/json');
            event.res.statusCode = 401;
            event.res.end(JSON.stringify({msg: 'Ошибка! Вы не авторизованы!', users: []}));
        }

    }catch (e){
        //console.log(e);
        event.res.statusCode = 404;
        event.res.end('Error occured. Try again later...');
    }
})
