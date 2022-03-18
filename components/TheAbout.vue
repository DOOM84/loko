<template>
  <section id="about">
    <h2>О предприятии</h2>
    <div v-html="text_content"></div>
  </section>
</template>

<script setup>

const props = defineProps({
  text_content: {type: String, default: ''},
})

</script>

<style scoped lang="scss">

</style>
