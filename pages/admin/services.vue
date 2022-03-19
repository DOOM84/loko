<template>
  <main  class="center pb-2 adminHome" >
    <h1 class="mt-2 left pb-1 mb-2 pl-2 pr-2 admin-title">Услуги</h1>
    <ClientOnly>
      <AdminTheEditor v-if="!finalEdit" @bodyUpd="bodyUpd"
                      :content="infoToUpdate.text_content" contentType="html"
                      theme="snow" toolbar="full"/>
    </ClientOnly>

    <div class="right mt-2 mr-2 admin-opts">

      <div>
        <label for="status" class="admin-status">Опубликовано</label>
        <input type="checkbox" v-model="infoToUpdate.status" id="status">
      </div>

      <button
          type="button"
          class="button btn-dark"
          @click.prevent="storeItem">
        Сохранить
      </button>
    </div>
  </main>
</template>

<script setup>
import {ref} from 'vue';
const {$showToast} = useNuxtApp();
const router = useRouter();

definePageMeta({
  layout: 'admin'
})

useMeta({
  title: 'Панель управления - Услуги'
})

const infoToUpdate = ref({});

const {data, error} = await useAsyncData('adminServices', () => $fetch('/api/admin/services/index'));

const finalEdit = ref(false);

infoToUpdate.value = {...data.value.info}

function bodyUpd(content) {
  infoToUpdate.value.text_content = content;
}

async function storeItem() {

  const formData = new FormData();
  formData.append('data', JSON.stringify(infoToUpdate.value))
  try {

    $showToast('Обработка', 'info', 2000);
      const {result} = await $fetch('/api/admin/services/edit', {
        method: 'POST',
        body: formData,
      })

    $showToast('Сохранено успешно', 'success', 2000);

  } catch (e) {
    console.log(e);
    if (e.response.status === 422) {

      $showToast(e.response._data.msg, 'error');

    } else if (e.response.status === 403) {

      $showToast('Доступ запрешен', 'error');

      await router.replace('/404')

    } else {

      $showToast('Ошибка', 'error', 2000);

    }

  }
}

</script>

<style lang="scss" scoped>

</style>