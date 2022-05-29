<template>
  <section class="cont pb-2">
    <div v-if="pending || error" class="center mt-3 mb-3 loader-color">
      <i class=" fa-4x fas fa-circle-notch fa-spin"></i>
    </div>
    <div v-else>
    <h2 class="mt-1 mb-1 center">Продукция — {{data.product.title}}</h2>
    <ClientOnly>
      <TheSlides :pictures="data.product.images" />
    </ClientOnly>

    <TheTable>
      <table class="infoTable mt-2">
        <thead>
        <tr>
          <th scope="col">№</th>
          <th scope="col">Наименование</th>
          <th scope="col">Изображение</th>
          <th scope="col">Номер чертежа</th>
          <th scope="col">Вес (кг)</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(detail,i) in data.product.details">
          <th scope="row">{{ i + 1 }}</th>
          <td>{{ detail.title }}</td>
          <td><img v-if="detail.image" :src="detail.image" :alt="detail.title"></td>
          <td>{{ detail.drawing }}</td>
          <td>{{ detail.weight }}</td>
        </tr>
        </tbody>
      </table>
    </TheTable>
    </div>

  </section>


</template>

<script setup>

const route = useRoute();

const {data, error, pending} = await useLazyAsyncData('product', () => $fetch('/api/product',
    {params: {id: route.params.id}}), {initialCache: false})


if (process.server && error?.value) {
  throwError(error.value)
}

watch(error, (newError) => {
  if(!!newError){
    router.replace('/404')
  }
})

const title = computed(() => 'ООО Локомотив-Сервис Ростов - ' + (data.value ? data.value.product.title : '') )

useHead({
  title: title
})

</script>

<style scoped lang="scss">

table th, table td, table tr {
  text-align: center !important;
  font-weight: bold !important;
  border: solid #dee2e6 1px;
}

</style>