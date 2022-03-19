<template>
  <section class="cont pb-2">
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


  </section>


</template>

<script setup>

const route = useRoute();

const {data, error} = await useAsyncData('product', () => $fetch('/api/product',
    {params: {id: route.params.id}}))


useMeta({
  title: 'ООО Локомотив-Сервис Ростов - ' +  data.value.product.title
})

</script>

<style scoped lang="scss">

table th, table td, table tr {
  text-align: center !important;
  font-weight: bold !important;
  border: solid #dee2e6 1px;
}

</style>