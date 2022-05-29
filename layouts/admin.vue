<template>
  <div>
    <div id="modals"></div>
    <AdminTheHeader/>
    <slot/>
  </div>

</template>

<script setup>
useMeta({
  title: 'Панель управления',
  script: [{
    defer: true,
    src: '/scripts/ckeditor/ckeditor.js',
  }]
})
</script>