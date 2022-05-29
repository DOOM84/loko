<template>
  <div>
    <div id="loader-wrapper">
      <div id="loader"></div>
      <div class="loader-section section-left"></div>
      <div class="loader-section section-right"></div>
    </div>
    <TheHeader />

    <ClientOnly>
      <TheShowCase :vh="$route.path === '/' ? 100 : 35">
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

})

function scrollToHash () {

  let hash = route.hash;

  nextTick(() => {
      $scrollTo(hash, 800)
    })
}

</script>

<style lang="scss">

</style>

