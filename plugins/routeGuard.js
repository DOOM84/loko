export default defineNuxtPlugin(async ({ssrContext, $logOut}) => {
    const router = useRouter();

    if (process.server && ssrContext) {

        const {res, url} = ssrContext;
        const {path} = router.resolve(url);

        const toName = path.split("/");

        try {

            if (toName[1] === 'login') {

                const {access} = await $fetch('/api/check', {
                    headers: useRequestHeaders(["cookie"]),
                });

                if(access){
                    res.writeHead(302, {Location: "/admin"});
                    res.end();
                }
            }

            if (toName[1] === 'admin') {

                const {access} = await $fetch('/api/check', {
                    headers: useRequestHeaders(["cookie"]),
                });

                if (!access) {
                    await Promise.reject(Error());
                }
            }

        } catch (e) {
            $logOut();
            if (toName[1] === 'admin') {
                res.writeHead(302, {Location: "/404"});
                res.end();
            }
        }
    } else if (process.client) {
        router.beforeEach(async (to, from, next) => {

            const toName = to.path.split("/");

            if (toName[1] === 'login') {

                try {

                    const {access} = await $fetch('/api/check')

                    if (!access) {
                        return next();
                    } else {
                        //$logOut();
                        return next('/admin');
                    }

                } catch (e) {
                    $logOut();
                    return next();
                }

            } else if (toName[1] === 'admin') {

                try {

                    const {access} = await $fetch('/api/check')

                    if (!access) {
                        $logOut();
                        return next('/404');
                    } else {
                        return next();
                    }

                } catch (e) {
                    $logOut();
                    return next('/');
                }

            } else {
                return next();
            }

        });
    }
});
