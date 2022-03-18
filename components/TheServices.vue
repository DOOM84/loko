<template>
  <section id="services">
    <h2>
      Услуги
    </h2>
    <div class="cont" v-html="text_content">
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  text_content: {type: String, default: ''},
})
</script>

<style scoped>

</style>
