<template>
  <section id="partners">
    <h2>
      Наши партнеры
    </h2>
    <div class="partners">
        <div v-for="(partner, i) in partners" :key="i">
          <img :src="partner.image" >
        </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  partners: {type: Array, default: []
  }
})
</script>

<style scoped>

</style>
