<template>
  <div>
    <div id="loader-wrapper">
      <div id="loader"></div>
      <div class="loader-section section-left"></div>
      <div class="loader-section section-right"></div>
    </div>
    <TheHeader />

    <ClientOnly>
      <TheShowCase :vh="$route.path === '/' ? 100 : 65">
        <template #header v-if="$route.path === '/'">
          <NuxtLink class="btn" to="/#about">Вперед</NuxtLink>
        </template>
      </TheShowCase>
    </ClientOnly>
    <slot/>

    <TheFooter />

  </div>

</template>

<script setup>
const {$scrollTo} = useNuxtApp();
import {useRoute} from "vue-router";
import {onMounted, nextTick} from 'vue';
const route = useRoute();
const router = useRouter();


onMounted(()=>{

  //loaded.value = true;

  document.body.classList.add('loaded');

  if (route.hash) {
    scrollToHash()
  }



 /* const route = useRoute();

  let hash = route.hash

  console.log(hash);

  if(hash){
   nextTick(() => {
     $scrollTo(hash, 800)
   })
 }*/


})

function scrollToHash () {

  let hash = route.hash;

  nextTick(() => {
      $scrollTo(hash, 800)
    })
}

/*watch(route, () => {
  console.log(route.hash);
})*/

/*onUpdated(()=>{
  const route = useRoute();

  let hash = route.hash;

  console.log(hash);

  if(hash){
    nextTick(() => {
      $scrollTo(hash, 800)
    })
}
})*/




/*import {onMounted, computed, watch} from 'vue';

import {useRoute} from 'vue-router';

const route = useRoute();

const showBgImg = computed(() => {
  return route.path === '/' ? 'bg-img' : '';
});

const showFooter = computed(() => {
  return route.path !== '/';
});

watch(route, () => {
  document.body.id = showBgImg.value;
})

onMounted(() => {
  document.body.id = showBgImg.value;
})*/

</script>

<style lang="scss">

</style>

