<template>
  <main  class="center pb-2 adminHome" >
    <h1 class="mt-2 left pb-1 mb-2 pl-2 pr-2 admin-title">
      Детали
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
      <div v-if="mode === 'edit'" class="flexCentered">
        <img :src="detailToUpdate.image" alt="">
      </div>

      <div class="form-group">
        <label for="title">Название</label>
        <input type="text" v-model.trim="detailToUpdate.title" class="form-control " id="title">
      </div>

      <div class="form-group">
        <label for="file">Изображение</label>
        <input class="mr-1" ref="file" type="file" id="file" @change="onFileChange"/>
      </div>


      <div class="form-group">
        <label for="drawing">Номер чертежа</label>
        <input type="text" v-model.trim="detailToUpdate.drawing" class="form-control " id="drawing">
      </div>


      <div class="form-group">
        <label for="weight">Вес (кг)</label>
        <input type="text" v-model.trim="detailToUpdate.weight" class="form-control " id="weight">
      </div>

      <div class="right mt-2 mr-2 admin-opts">
      <div>
        <label for="status" class="admin-status">Опубликовано</label>
        <input type="checkbox" v-model="detailToUpdate.status" id="status">
      </div>

      <button
          type="button"
          class="button btn-dark"
          @click.prevent="storeItem">
        Сохранить
      </button>
      </div>
    </AdminModalWrap>

    <ClientOnly>
    <AdminDtable @endFilter="toFilter = false"
                 :data="data.details"
                 :toFilter="toFilter"
                 :filtering="filtering"
                 :toSearch="['title','drawing']">
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
            <strong>Изображение</strong>
          </div>
        </table-head>
        <table-head>
          <div class="flexCentered">
            <strong>Номер чертежа</strong>
            <i @click.self="filter('drawing', 'asc')" class="fa ml-1 fa-caret-up pointer"></i>
            <i @click.self="filter('drawing', 'desc')" class="fa fa-caret-down pointer"></i>
          </div>
        </table-head>
        <table-head>
          <div class="flexCentered">
            <strong>Вес (кг)</strong>
            <i @click.self="filter('weight', 'asc')" class="fa ml-1 fa-caret-up pointer"></i>
            <i @click.self="filter('weight', 'desc')" class="fa fa-caret-down pointer"></i>
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
            <img v-if="row.image" :src="row.image" alt="">
        </table-body>
        <table-body>
          {{ row.drawing }}
        </table-body>
        <table-body>
          {{ row.weight }}
        </table-body>
        <table-body>
          {{ row.status ? 'Да': 'Нет' }}
        </table-body>
        <table-body>
          <button @click.prevent="updateItem(row)" class="button block btn-dark"><i class="fas fa-edit"></i></button>
          <button @click.prevent="removeItem(row.id)" class="button block btn-dark"><i class="fas fa-trash"></i></button>
        </table-body>
      </template>
    </AdminDtable>
    </ClientOnly>
  </main>
</template>
<script setup>
import {ref} from 'vue';
//import Multiselect from '@vueform/multiselect';
const {$showToast} = useNuxtApp();
import {useRouter} from 'vue-router';
const router = useRouter();
const file = ref(null);
const files = ref(null);
const selectedFile = ref(null);

definePageMeta({
  layout: 'admin'
})

useMeta({
  title: 'Панель управления - Детали'
})


const {data, error} = await useAsyncData('adminDetail', () => $fetch('/api/admin/details/index'));

const filtering = ref([]);
const toFilter = ref(false);

function filter(fTerm, dir){
  filtering.value = [fTerm, dir]
  toFilter.value = true;
}

const detailToUpdate = ref({status: false});
const showDlg = ref(false);
const mode = ref(null);

function onFileChange(e) {
  selectedFile.value = file.value.files[0];
}

function closeModal() {
  showDlg.value = false;
  mode.value = null;
  detailToUpdate.value = {status: false}
  selectedFile.value = null;
}

function updateItem(detail) {
  mode.value = 'edit';
  detailToUpdate.value = {...detail}
  showDlg.value = true;
}


function addItem() {
  mode.value = 'add';
  showDlg.value = true;
  detailToUpdate.value.status = false;
}

async function storeItem() {


  const formData = new FormData();
  formData.append('data', JSON.stringify(detailToUpdate.value))

  if (selectedFile.value) {
    formData.append('file', selectedFile.value);
  }

  try {
    $showToast('Обработка...', 'info', 2000);

    if (mode.value === 'edit') {
      const {result} = await $fetch('/api/admin/details/edit', {
        method: 'POST',
        body: formData,
      })
      const ind = data.value.details.findIndex(item => item.id === result.id);
      data.value.details[ind] = result;
    }

    if (mode.value === 'add') {
      const {result} = await $fetch('/api/admin/details/add', {
        method: 'POST',
        body: formData,
      })
      data.value.details.unshift(result);
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

async function removeItem(dbId) {
  if (confirm('Are you sure?')) {
    try {

      const formData = new FormData();
      formData.append('id', dbId);
     // formData.append('url', url);

      $showToast('Обработка...', 'info', 2000);

      const {id} = await $fetch('/api/admin/details/remove', {
        method: 'POST',
        body: formData,
      })

      data.value.details.splice(data.value.details.findIndex(item => item.id === id), 1);

      filter(null, null);

      $showToast('Успешно удалено', 'success', 2000);

    } catch (e) {

      if (e.response.status === 403) {

        $showToast('Доступ запрешен', 'error');
        await router.replace('/404')

      }
    }
  }
}

</script>

