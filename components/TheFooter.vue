<template>
  <footer id="contacts">
    <div class="footer pt-2">
      <div>
        <div class="pb-1 pl-1 pr-1" v-html="data.contacts"></div>
        <div class="pb-2">
          <img src="/img/footer_logo.png" alt="">
        </div>
      </div>
      <div>
        <iframe  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1326.5465914396254!2d39.94528318962936!3d48.3202895997736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x411e3d3ad866dd33%3A0x714f8db128a44e57!2z0JvQvtC60L7QvNC-0YLQuNCyLdCh0LXRgNCy0LjRgSDQoNC-0YHRgtC-0LI!5e0!3m2!1sru!2sua!4v1594143362853!5m2!1sru!2sua" width="600" height="450" frameborder="0" style="border:0; width: 100%; height: 300px" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>
      </div>
    </div>
    <div>
      Copyright © {{ new Date().getFullYear() }} ООО Локомотив-Сервис Ростов
    </div>
  </footer>
</template>

<script setup>

const {data, pending, error} = await useAsyncData('contacts', () => $fetch('/api/contacts'));

</script>

<style scoped lang="scss">

</style>
