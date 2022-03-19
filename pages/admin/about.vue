<template>
  <main  class="center pb-2 adminHome" >
    <h1 class="mt-2 left pb-1 mb-2 pl-2 pr-2 admin-title">О предприятии</h1>
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
  title: 'Панель управления - О предприятии'
})

const infoToUpdate = ref({});

const {data, error} = await useAsyncData('adminAbout', () => $fetch('/api/admin/about/index'));

const finalEdit = ref(false);

infoToUpdate.value = {...data.value.about}

function bodyUpd(content) {
  infoToUpdate.value.text_content = content;
}

async function storeItem() {

  const formData = new FormData();
  formData.append('data', JSON.stringify(infoToUpdate.value))
  try {

    $showToast('Обработка', 'info', 2000);
      const {result} = await $fetch('/api/admin/about/edit', {
        method: 'POST',
        body: formData,
      })

    $showToast('Сохранено успешно', 'success', 2000);

  } catch (e) {

    if (e.response.status === 422) {

      $showToast(e.response._data.msg, 'error');

    } else if (e.response.status === 403) {

      $showToast('Доступ звапрещен', 'error');
      //$logOut();
      await router.replace('/404');

    } else {

      $showToast('Ошибка', 'error', 2000);

    }

  }
}

</script>

<style lang="scss" scoped>
.adminHome{
  margin: auto;
  z-index: 1;
}
</style>