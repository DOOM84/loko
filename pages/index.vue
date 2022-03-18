<template>
  <main>
    <template v-if="data">
      <TheAbout  :text_content="data.about" />
      <TheInfo  :text_content="data.info" :files="data.files" />
      <TheProducts :products="data.products" />
      <TheServices :text_content="data.services" />
      <ThePartners  :partners="data.partners"/>
    </template>

  </main>
</template>

<script setup>
import {onMounted, ref} from 'vue';
const cached = useCachedinfo();
const data = ref({});

//const {data, error} = await useAsyncData('index', () => $fetch('/api/index'));

onMounted(async () => {

  const index = cached.value.findIndex((element) => element['about']);

  if (index !== -1) {

    data.value.about = cached.value[0].about
    data.value.info = cached.value[1].info
    data.value.files = cached.value[2].files
    data.value.products = cached.value[3].products
    data.value.services = cached.value[4].services
    data.value.partners = cached.value[5].partners

  } else {

    data.value = await $fetch('/api/index');

    cached.value.push({'about': data.value.about})
    cached.value.push({'info': data.value.info})
    cached.value.push({'files': data.value.files})
    cached.value.push({'products': data.value.products})
    cached.value.push({'services': data.value.services})
    cached.value.push({'partners': data.value.partners})
  }

})

/*useMeta({
  title: t('sphere') + ' — ' + t('welcome')
})*/
</script>
