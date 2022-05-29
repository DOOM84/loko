<template>
  <main class="withFooter center pa-1 mt-2 pb-2">
    <h1 class="lg-heading">404: Не найдено</h1>
    <h2 class="center">Данной страницы не существует</h2>
  </main>
</template>

<style scoped lang="scss">

.withFooter{
  height: 23vh;
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

</style>

<script setup>
useMeta({
  title: 'Ошибка 404. Данной страницы не существует'
})

</script>