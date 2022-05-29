<template>
  <section class="showcase" :style="{ height: vh+'vh'}">
    <div class="video-container">
    <video id="background-video" autoplay loop muted>
      <source src="https://loko.designs.network/video/train.mov" type="video/mp4">
    </video>
    </div>

    <div class="content">
      <div>
        <img src="/img/logo_top.png" alt="">
      </div>
      <slot name="header"></slot>
    </div>
  </section>
</template>

<script setup>
  const props = defineProps({
    vh: {type: Number, default: 100},
  })

</script>



<style scoped lang="scss">

</style>
