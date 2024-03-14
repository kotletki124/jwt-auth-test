<script lang="ts" setup>
import { reactive, computed } from 'vue';
import InputPassword from 'src/components/InputPassword.vue';
import { useAuthStore } from 'src/stores/auth';
import { useAsyncState } from '@vueuse/core';
import { generateErrorMessage } from 'src/util';
import type { AxiosError } from 'axios';

const emit = defineEmits(['register']);

const { checkIfEmailAvailable, register } = useAuthStore();

const initialForm = {
  email: 'example@mail.com',
  name: 'Иннокентий',
  password: '123456',
  confirmPassword: '123456',
  phone: '',
  address: '',
  bio: '',
};

const form = reactive({ ...initialForm });

const checkEmail = async (value = form.email) => {
  const isAvailable = await checkIfEmailAvailable(value);
  return isAvailable || 'Данный email уже зарегистрирован';
};

const {
  isLoading,
  error,
  execute: handleSubmit,
} = useAsyncState(
  async () => {
    const { confirmPassword, ...restForm } = form;
    await register(restForm);
    emit('register');
  },
  null,
  { immediate: false }
);

const errorMessage = computed(() =>
  generateErrorMessage(error.value as AxiosError)
);
</script>

<template>
  <q-form
    @submit.prevent="handleSubmit()"
    @reset="Object.assign(form, initialForm)"
    class="q-gutter-md"
    :disabled="isLoading || null"
  >
    <h2>Регистрация</h2>
    <q-input
      outlined
      v-model="form.email"
      label="Email *"
      hint="Ваш email"
      :rules="[
        (val) => (val && val.length > 0) || 'Это поле обязательно',
        (val, { email }) => email(val) || 'Неверный формат',
        (val) => checkEmail(val),
      ]"
      lazy-rules
      autocomplete="off"
    />

    <q-input
      outlined
      v-model="form.name"
      label="Имя *"
      hint="Ваше имя"
      :rules="[
        (val) => (val && val.length > 0) || 'Это поле обязательно',
        (val) => val?.length >= 2 || 'Слишком короткое имя',
        (val) => val?.length < 30 || 'Слишком длинное имя',
      ]"
      lazy-rules
      autocomplete="off"
    />

    <InputPassword
      outlined
      v-model="form.password"
      label="Пароль *"
      hint="Введите пароль"
      :rules="[
        (val) => (val && val.length > 0) || 'Это поле обязательно',
        (val) => val?.length >= 6 || 'Минимальная длина - 6 символов',
      ]"
      lazy-rules
      autocomplete="off"
    />

    <InputPassword
      outlined
      v-model="form.confirmPassword"
      label="Повторите пароль *"
      hint="Повторите пароль"
      :rules="[
        (val) => (val && val.length > 0) || 'Это поле обязательно',
        (val) => val?.length >= 6 || 'Минимальная длина - 6 символов',
        (val) => val === form.password || 'Пароли не совпадают',
      ]"
      lazy-rules
      autocomplete="off"
    />

    <q-input
      outlined
      mask="+7 (###) ### - ## - ##"
      unmasked-value
      v-model="form.phone"
      label="Телефон"
      hint="Ваш номер телефона"
      :rules="[
        (val) => val?.length === 0 || val?.length === 10 || 'Неверный формат',
      ]"
      lazy-rules
      autocomplete="off"
    />

    <q-input
      outlined
      v-model="form.address"
      label="Адрес"
      hint="Ваш адрес"
      autocomplete="off"
    />

    <q-input
      outlined
      autogrow
      v-model="form.bio"
      label="О себе"
      hint="Расскажите о себе"
      autocomplete="off"
    />

    <div v-if="error" class="text-negative">{{ errorMessage }}</div>

    <div>
      <q-btn
        label="зарегистрироваться"
        type="submit"
        color="primary"
        :loading="isLoading"
        :disabled="isLoading"
      />
      <q-btn
        label="сбросить"
        type="reset"
        color="primary"
        flat
        class="q-ml-sm"
        :disabled="isLoading"
      />
    </div>
  </q-form>
</template>
