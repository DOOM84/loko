<template>
  <div @click="closeNav" ref="overlay" id="overlay" class="bg"></div>
  <header class="hero">
    <div ref="navbar" class="navbar top">
      <i @click="openNav" class="fas fa-bars fa-lg pointer openNav white mainHeader"></i>
      <nav ref="navigation">
        <transition name="page">
          <ul>
            <li>
              <NuxtLink to="/">Главная</NuxtLink>
            </li>
            <li>
              <a href="/#about" @click.prevent="moveToHash('#about')"> О предприятии</a>
            </li>
            <li>
              <a href="/#info" @click.prevent="moveToHash('#info')">Информация</a>
            </li>
            <li>
              <a href="/#products" @click.prevent="moveToHash('#products')">Продукция</a>
            </li>
            <li>
              <a href="/#services" @click.prevent="moveToHash('#services')">Услуги</a>
            </li>
            <li>
              <a href="/#partners" @click.prevent="moveToHash('#partners')">Наши партнеры</a>
            </li>
            <li><a href="/#contacts" @click.prevent="moveToHash('#contacts')">Контакты</a></li>
          </ul>
        </transition>
      </nav>
    </div>
  </header>
  <div ref="sideNav" class="sidenav">
    <span  class="closeBtn m-1" @click.prevent="closeNav">
      <i class="fas fa-lg  fa-times pointer white"></i>
    </span>

    <div>
      <NuxtLink to="/">Главная</NuxtLink>
      <a href="#" @click.prevent="moveToHash('#about')"> О предприятии</a>
      <a href="#" @click.prevent="moveToHash('#info')">Информация</a>
      <a href="#" @click.prevent="moveToHash('#products')">Продукция</a>
      <a href="#" @click.prevent="moveToHash('#services')">Услуги</a>
      <a href="#" @click.prevent="moveToHash('#partners')">Наши партнеры</a>
      <a href="#" @click.prevent="moveToHash('#contacts')">Контакты</a>
    </div>

  </div>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";
import {useRouter, useRoute} from "vue-router";
const {$scrollTo} = useNuxtApp();
const navbar = ref(null);
const sideNav = ref(null);
const overlay = ref(null);

const router = useRouter();
const route = useRoute();

onMounted(()=>{

  document.body.classList.add('loaded');

  let scrolled = false;
  window.onscroll = function () {
    if (window.pageYOffset > 100) {
      navbar.value.classList.remove('top');
      if (!scrolled) {
        navbar.value.style.transform = 'translateY(-70px)';
      }
      setTimeout(function () {
        navbar.value.style.transform = 'translateY(0)';
        scrolled = true;
      }, 200);
    } else {
      navbar.value.classList.add('top');
      scrolled = false;
    }
  };

})

function openNav() {
  sideNav.value.style.left = "0px";
  overlay.value.style.visibility = "visible";
  overlay.value.style.opacity = "0.5";

}

function closeNav() {
  sideNav.value.style.left = "-250px";
  overlay.value.style.opacity = "0";
  overlay.value.style.visibility = "hidden";

}

function moveToHash(hash){
    if(document.querySelector(hash)){
      $scrollTo(hash, 800);
    }else{
      router.push({ path: '/', hash: hash})
    }
    closeNav()
}

watch(route, () => {
  closeNav()
})
</script>



<style scoped lang="scss">

</style>
