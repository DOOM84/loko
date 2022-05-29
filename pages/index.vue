<template>
  <main>
    <div v-if="pending || error" class="center mt-3 mb-3 loader-color">
      <i class=" fa-4x fas fa-circle-notch fa-spin"></i>
    </div>
    <div v-else>
      <TheAbout :text_content="data.about"/>
      <TheInfo :text_content="data.info" :files="data.files"/>
      <TheProducts :products="data.products"/>
      <TheServices :text_content="data.services"/>
      <ThePartners :partners="data.partners"/>
    </div>
  </main>
</template>

<script setup>

const {data, pending, error} = await useLazyAsyncData('main', () => $fetch('/api/main'));

</script>
