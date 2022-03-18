<template>
  <section id="products">
    <h2>
      Продукция
    </h2>
    <div class="products">
        <div v-for="(product, i) in products" :key="i">
          <nuxt-link :to="'/product/'+product.slug">
          <img :src="product.thumbnail" alt="">
          <h4>
            {{product.title}}
          </h4>
          </nuxt-link>
        </div>
    </div>

  </section>
</template>

<script setup>
const props = defineProps({
  products: {type: Array, default: []},
})
</script>

<style scoped>

</style>
