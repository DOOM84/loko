<template>
  <section id="info">
    <h2>
      Информация
    </h2>
    <div class="cont">
      <div v-html="text_content"></div>
      <ul class="files">
        <li v-for="(file, i) in files" :key="i">
          <a :href="file.url" target="_blank">{{ file.title }}</a>
        </li>
      </ul>
    </div>
  </section>
</template>


<script setup>

const props = defineProps({
  text_content: {type: String, default: ''},
  files: {type: Array, default: []},
})

</script>

<style scoped lang="scss">

</style>
