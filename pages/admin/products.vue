<template>
  <main  class="center pb-2 adminHome" >
    <h1 class="mt-2 left pb-1 mb-2 pl-2 pr-2 admin-title">
      Продукция
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
        <img :src="productToUpdate.thumbnail" alt="">
      </div>

      <div class="form-group">
        <label for="description">Название</label>
        <input type="text" v-model.trim="productToUpdate.title" class="form-control " id="description">
      </div>

      <div class="form-group">
        <label for="file">Главное изображение</label>
        <input class="mr-1" ref="file" type="file" id="file" @change="onFileChange"/>
      </div>

      <div class="form-group">
        <label for="files">Изображения на странице продукции</label>
        <input class="mr-1" ref="files" type="file" multiple id="files"/>
      </div>

      <div v-if="mode === 'edit'" class="flexCentered"  v-for="image in productToUpdate.images">
        <div class="pos-relative">
          <img width="200" :src="image" alt="">
          <button @click.prevent="removeImg(productToUpdate.id, image)" class="button block btn-dark ml-1 remove-button">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>


      <div class="form-group mt-2">
        <label for="details">Детали</label>
        <Multiselect
            id="details"
            v-model="productToUpdate.details"
            :object="false"
            mode="tags"
            valueProp="id"
            :searchable="true"
            :createTag="false"
            :options="data.details"
            label="drawing"
        >
          <template v-slot:option="{ option }">
            {{ option.title + ' '+ option.drawing }}
          </template>

        </Multiselect>
      </div>


      <div class="right mt-2 mr-2 admin-opts">
      <div>
        <label for="status" class="admin-status">Опубликовано</label>
        <input type="checkbox" v-model="productToUpdate.status" id="status">
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
                 :data="data.products"
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
            <strong>Изображение</strong>
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
            <img :src="row.thumbnail" alt="">
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
  </main>
</template>
<script setup>
import {ref} from 'vue';
import Multiselect from '@vueform/multiselect';
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
  title: 'Панель управления - Продукция'
})


const {data, error} = await useAsyncData('adminProducts', () => $fetch('/api/admin/products/index'));

const filtering = ref([]);
const toFilter = ref(false);

function filter(fTerm, dir){
  filtering.value = [fTerm, dir]
  toFilter.value = true;
}

const productToUpdate = ref({status: false, title: ''});
const showDlg = ref(false);
const mode = ref(null);

function onFileChange(e) {
  selectedFile.value = file.value.files[0];
}

function closeModal() {
  showDlg.value = false;
  mode.value = null;
  productToUpdate.value = {status: false, title: ''}
  selectedFile.value = null;
}

function updateItem(product) {
  mode.value = 'edit';
  productToUpdate.value = {...product}
  showDlg.value = true;
}


function addItem() {
  mode.value = 'add';
  showDlg.value = true;
  productToUpdate.value.status = false;
}

async function storeItem() {

  const formData = new FormData();
  formData.append('data', JSON.stringify(productToUpdate.value))

  if (selectedFile.value) {
    formData.append('file', selectedFile.value);
  }

  for (let i = 0; i < files.value.files.length; i++) {
    let custFile = files.value.files[i];
    if(custFile){formData.append('images[' + i + ']', custFile,)}
  }

  try {
    $showToast('Обработка...', 'info', 2000);

    if (mode.value === 'edit') {
      const {result} = await $fetch('/api/admin/products/edit', {
        method: 'POST',
        body: formData,
      })
      const ind = data.value.products.findIndex(item => item.id === result.id);
      data.value.products[ind] = result;
    }

    if (mode.value === 'add') {
      const {result} = await $fetch('/api/admin/products/add', {
        method: 'POST',
        body: formData,
      })
      data.value.products.unshift(result);
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

      const {id} = await $fetch('/api/admin/products/remove', {
        method: 'POST',
        body: formData,
      })

      data.value.products.splice(data.value.products.findIndex(item => item.id === id), 1);

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

async function removeImg(dbId, url) {
  if (confirm('Are you sure?')) {

    try {

      const formData = new FormData();
      formData.append('id', dbId);
      formData.append('url', url);

      $showToast('Обработка...', 'info', 2000);

      const {id} = await $fetch('/api/admin/products/removeImg', {
        method: 'POST',
        body: formData,
      })

      const index = productToUpdate.value.images.indexOf(url);

      if (index > -1) {
        productToUpdate.value.images.splice(index, 1); // 2nd parameter means remove one item only
      }

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

<style scoped lang="scss">

.pos-relative{
  position: relative;
}

.remove-button{
  position: absolute;
  top: 0;
  right: 0
}
</style>