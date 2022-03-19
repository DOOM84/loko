<template>
  <section class="cont pb-2 pt-2">

    <div>
      <h3 class="pl-1">{{ showMode }}</h3>
      <div class="mt-1">

        <template v-if="mode==='login'">

          <div class="form-group pl-1 pr-1">
            <input @keyup.enter="authorize" class="form-control" v-model.trim="email" type="email"
                   name="email" placeholder="Email">
          </div>

          <div class="form-group pl-1 pr-1">
            <input @keyup.enter="authorize" class="form-control" v-model.trim="password"  type="password"
                   name="password" placeholder="Пароль">
          </div>

          <div class="mt-1 pa-1">
            <button class="loginBtn" :disabled="showIcon" @click="authorize">
              <i v-if="showIcon" class="fas fa-sync fa-spin"></i>
              <span v-else>{{ showMode }}</span>
            </button>
            <button class="loginBtn" @click="toggleMode('reset')">Забыл пароль</button>
          </div>
        </template>

        <template v-else>

          <div class="form-group pl-1 pr-1">
            <input @keyup.enter="authorize" class="form-control" v-model.trim="email" type="email"
                   name="email" placeholder="Email">
          </div>

          <div class="mt-1 pa-1">
            <button class="loginBtn" :disabled="showIcon" @click="authorize">
              <i v-if="showIcon" class="fas fa-sync fa-spin"></i>
              <span v-else>Отправить</span>
            </button>
            <button class="loginBtn" @click="toggleMode('login')">Вход</button>
          </div>
        </template>
      </div>
    </div>


  </section>


</template>

<script setup>

import {computed, ref} from 'vue';
const authToken = useState('token');
const isLoggedIn = useState('isLoggedIn');
const user = useState('user');
const router = useRouter();
const {$showToast, $logOut} = useNuxtApp();
const email = ref('');
const password = ref('');
const mode = ref('login');
const err = ref(false);
const showIcon = ref(false);

const showMode = computed(() =>
    mode.value === 'login' ? 'Вход' : 'Забыл пароль');

const showBtnMode = computed(() => mode.value === 'login' ? 'Вход' : 'Забыл пароль');

function setCookies(name, data) {
  let now = new Date();
  now.setTime(now.getTime() + 1 * 3600 * 1000);
  let expires = "expires=" + now.toUTCString();
  document.cookie = name + "=" + data + ";" + expires + ";path=/; SameSite=Lax;";
}

function toggleMode(reset = null) {
  if (reset) {
    mode.value = reset
  } else {
    mode.value = 'login'
  }
}

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

async function authorize() {

  if (isLoggedIn.value) {
    return
  }
  err.value = false;

  if (!validateEmail(email.value)) {
    err.value = true;
    $showToast('Введен некорректный Email адрес', 'error');
  }

  if (mode.value !== 'reset') {
    if (password.value.length < 6) {
      err.value = true;
      $showToast('Пароль не должен быть менее 6 символов', 'error');
    }
  }

  if (err.value) {
    return
  }

  const formData = new FormData();

  formData.append("email", email.value);

  if (mode.value !== 'reset') {
    formData.append("password", password.value);
  }

  try {
    showIcon.value = true
    const data = mode.value === 'login' ?
        await $fetch('/api/auth/login', {
          method: 'POST',
          body: formData,
        }) : await $fetch('/api/auth/reset', {
          method: 'POST',
          body: formData,
        })

    if (mode.value !== 'reset') {
      setCookies('token', data.token);
      authToken.value = data.token;
      isLoggedIn.value = !!data.token;
      user.value = {
        name: data.login, /*email: data.email,*/
      }
      router.replace('/admin')

    } else {
      showIcon.value = false;
      $showToast('Данные успешно отправлены на Ваш Email', 'success');
      mode.value = 'login';
    }
  } catch (error) {
    showIcon.value = false;
    err.value = true;
    $logOut();

      if (error.response.status !== 422) {

        $showToast('Пользователя с такими данными не существует', 'error');

      } else {
        $showToast(error.response.data.msg, 'error');
      }

  }

}

</script>

<style lang="scss" scoped>

.loginBtn {
  cursor: pointer;
  width: 100%;
  border: none;
  background: #4CAF50;
  color: #FFF;
  margin: 0 0 5px;
  padding: 10px;
  font-size: 15px;
  border-radius: 5px;
  &:hover{
    background: #275629;
    transition: 0.3s;
  }

}

</style>