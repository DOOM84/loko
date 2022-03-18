<template>
  <vueper-slides :breakpoints="{
          600: {
    arrows: false,
    bulletsOutside: true
    }
        }" autoplay :slideRatio="1 / 2" :dragging-distance="50">
    <vueper-slide
        v-for="(picture, i) in pictures"
        :key="i"
        :image="picture"
    />
  </vueper-slides>
</template>

<script setup>
  const props = defineProps({
    pictures: {type: Array, default: []},
  })

</script>



<style scoped lang="scss">

</style>
