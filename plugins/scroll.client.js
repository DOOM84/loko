import {defineNuxtPlugin} from '#app';

export default defineNuxtPlugin((nuxtApp) => {

    nuxtApp.$router.options.scrollBehavior = async (to, from, savedPosition) => {
        /*if (to.hash && document.querySelector(to.hash)) {
            return {
                el: to.hash,
                behavior: 'smooth'
            }
        }*/


        if (savedPosition) {
            return savedPosition
        }

        const findEl = async (hash, x) => {
            return document.querySelector(hash) ||
                new Promise((resolve, reject) => {
                    if (x > 50) {
                        return resolve()
                    }
                    setTimeout(() => { resolve(findEl(hash, ++x || 1)) }, 100)
                })
        };

        if (to.hash) {
            let el = await findEl(to.hash)
            if ('scrollBehavior' in document.documentElement.style) {
                return nuxtApp.$scrollTo(el, 800)
                //return el.scrollIntoView({ behavior: 'smooth' });
            } else {
                return window.scrollTo(0, el.offsetTop)
                //return window.scrollTo(0, el.getBoundingClientRect().top+window.scrollY)
            }
        }
        //return {x: 0, y: 0}



        return {left: 0, top: 0, behavior: "smooth"}
    }



})