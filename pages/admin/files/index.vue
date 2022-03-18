<template>
  <main  class="center pb-2 adminHome" >
    <h1 class="mt-2 left pb-1 mb-2 pl-2 pr-2 admin-title">
      Файлы
    </h1>

    <div class="right">
      <button
          type="button"
          class="button btn-dark"

          @click.prevent="addItem">
        Добавить
      </button>
    </div>

    <AdminModalWrap @closeDlg="closeModal" mWidth="1000px" origWidth="100%" :showDlg="showDlg">

      <div class="form-group">
        <label for="description">Название</label>
        <input type="text" v-model.trim="fileToUpdate.title" class="form-control " id="description">
      </div>

      <div class="form-group">
<!--        <label for="file">Название документа (файла)</label>-->
        <input class="mr-1" ref="file" type="file" id="file" @change="onFileChange"/>
      </div>


      <div class="right mt-2 mr-2 admin-opts">
      <div>
        <label for="status" class="admin-status">Опубликовано</label>
        <input type="checkbox" v-model="fileToUpdate.status" id="status">
      </div>

      <button
          type="button"
          class="button btn-dark"
          @click.prevent="storeItem">
        Сохранить
      </button>
      </div>
    </AdminModalWrap>

    <AdminDtable @endFilter="toFilter = false"
                 :data="data.files"
                 :toFilter="toFilter"
                 :filtering="filtering"
                 :toSearch="['title']">
      <template #thead>
        <table-head>
          <div class="flexCentered">
            <strong>Название</strong>
            <i @click.self="filter('title', 'asc')" class="fa ml-1 fa-caret-up pointer"></i>
            <i @click.self="filter('title', 'desc')" class="fa fa-caret-down pointer"></i>
          </div>
        </table-head>
        <table-head>
          <div class="flexCentered">
            <strong>Файл</strong>
          </div>
        </table-head>
        <table-head>
          <div class="flexCentered">
            <strong>Опубликовано</strong>
            <i @click.self="filter('status', 'asc')" class="fa ml-1 fa-caret-up pointer"></i>
            <i @click.self="filter('status', 'desc')" class="fa fa-caret-down pointer"></i>
          </div>
        </table-head>
        <table-head/>
      </template>

      <template #rows="{row}">
        <table-body>
          {{ row.title }}
        </table-body>
        <table-body>
          <a class="link" target="_blank" :href="row.url">
           Показать/Скачать
          </a>
        </table-body>
        <table-body>
          {{ row.status ? 'Да': 'Нет' }}
        </table-body>
        <table-body>
          <button @click.prevent="updateItem(row)" class="button block btn-dark"><i class="fas fa-edit"></i></button>
          <button @click.prevent="removeItem(row.id, row.url)" class="button block btn-dark"><i class="fas fa-trash"></i></button>
        </table-body>
      </template>
    </AdminDtable>
  </main>
</template>
<script setup>
import {ref} from 'vue';
const {$showToast} = useNuxtApp();
import {useRouter} from 'vue-router';
const router = useRouter();
const file = ref(null);
const selectedFile = ref(null);

definePageMeta({
  layout: 'admin'
})

useMeta({
  title: 'Панель управления - Файлы'
})


const {data, error} = await useAsyncData('adminFiles', () => $fetch('/api/admin/files/index'));

const filtering = ref([]);
const toFilter = ref(false);

function filter(fTerm, dir){
  filtering.value = [fTerm, dir]
  toFilter.value = true;
}

const fileToUpdate = ref({status: false, title: ''});
const showDlg = ref(false);
const mode = ref(null);

function onFileChange(e) {
  selectedFile.value = file.value.files[0];
}

function closeModal() {
  showDlg.value = false;
  mode.value = null;
  fileToUpdate.value = {status: false, title: ''}
  selectedFile.value = null;
}

function updateItem(file) {
  mode.value = 'edit';
  fileToUpdate.value = {...file}
  showDlg.value = true;
}


function addItem() {
  mode.value = 'add';
  showDlg.value = true;
  fileToUpdate.value.status = false;
}

async function storeItem() {
  const formData = new FormData();
  formData.append('data', JSON.stringify(fileToUpdate.value))
  if (selectedFile.value) {
    formData.append('file', selectedFile.value);
  }

  try {
    $showToast('Обработка...', 'info', 2000);
    if (mode.value === 'edit') {
      const {result} = await $fetch('/api/admin/files/edit', {
        method: 'POST',
        body: formData,
      })
      const ind = data.value.files.findIndex(item => item.id === result.id);
      data.value.files[ind] = result;
    }

    if (mode.value === 'add') {
      const {result} = await $fetch('/api/admin/files/add', {
        method: 'POST',
        body: formData,
      })
      data.value.files.unshift(result);
    }

    filter(null, null);

    closeModal();

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

async function removeItem(dbId, url) {
  if (confirm('Are you sure?')) {
    try {

      const formData = new FormData();
      formData.append('id', dbId);
      formData.append('url', url);

      $showToast('Обработка...', 'info', 2000);

      const {id} = await $fetch('/api/admin/files/remove', {
        method: 'POST',
        body: formData,
      })

      data.value.files.splice(data.value.files.findIndex(item => item.id === id), 1);

      filter(null, null);

      $showToast('Успешно удалено', 'success', 2000);

    } catch (e) {

      if (e.response.status === 403) {

        $showToast('Доступ запрешен', 'error');
        //$logOut();
        await router.replace('/404')

      }
    }
  }
}

</script>

