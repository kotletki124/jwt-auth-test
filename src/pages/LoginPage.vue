<script lang="ts" setup>
import InputPassword from 'src/components/InputPassword.vue';
import { reactive, computed } from 'vue';
import { useAuthStore } from 'src/stores/auth';
import { useAsyncState } from '@vueuse/core';
import { generateErrorMessage } from 'src/util';
import type { AxiosError } from 'axios';

const { login } = useAuthStore();

const options = [
  { label: '30s', value: 30000 },
  { label: '1m', value: 60000 },
  { label: '5m', value: 300000 },
  { label: '30m', value: 1800000 },
];

const initialForm = {
  email: 'example@mail.com',
  password: '123456',
  tokenDuration: options[3],
};

const form = reactive({ ...initialForm });

const {
  isLoading,
  error,
  execute: handleSubmit,
} = useAsyncState(
  async () => {
    const tokenDuration = form.tokenDuration.value;
    await login({ ...form, tokenDuration });
  },
  null,
  { immediate: false }
);

const errorMessage = computed(() =>
  generateErrorMessage(error.value as AxiosError)
);
</script>

<template>
  <q-page class="col items-center justify-evenly">
    <div class="q-pa-md">
      <q-form
        @submit.prevent="handleSubmit()"
        @reset="Object.assign(form, initialForm)"
        class="q-gutter-md"
        :disabled="isLoading || null"
      >
        <h2>Войти</h2>
        <q-input
          outlined
          v-model="form.email"
          label="Email"
          hint="Электронная почта"
          autocomplete="off"
        />

        <InputPassword
          outlined
          v-model="form.password"
          label="Пароль"
          hint="Введите пароль"
          autocomplete="off"
        />

        <q-select
          outlined
          v-model="form.tokenDuration"
          :options="options"
          label="Длительность действия токена"
        />

        <div v-if="error" class="text-negative">{{ errorMessage }}</div>

        <div>
          <q-btn
            label="войти"
            type="submit"
            color="primary"
            :disabled="isLoading"
            :loading="isLoading"
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
    </div>
  </q-page>
</template>
