<script setup lang="ts">
import { UpdateUserDto } from 'app/server/src/shared/types';
import { useAuthStore } from 'src/stores/auth';
import { reactive, ref, watch, onMounted, nextTick, computed } from 'vue';
import { useAsyncState } from '@vueuse/core';
import DeleteButton from 'src/components/DeleteButton.vue';
import { generateErrorMessage } from 'src/util';
import type { AxiosError } from 'axios';

const { state, updateUserData, deleteUser } = useAuthStore();
const form: UpdateUserDto = reactive({
  name: '',
  phone: '',
  address: '',
  bio: '',
});
const formModified = ref(false);

const updateFormValue = async (value = state.user) => {
  if (value) {
    const { name = '', phone = '', address = '', bio = '' } = value;
    Object.assign(form, {
      ...form,
      name,
      phone,
      address,
      bio,
    });
    await nextTick();
    formModified.value = false;
  }
};

onMounted(async () => {
  await updateFormValue();
  setTimeout(() => {
    formModified.value = false;
  }, 200);
});

watch(form, () => {
  formModified.value = true;
});

watch(
  () => state.user,
  (value) => {
    updateFormValue(value);
  }
);

const {
  isLoading,
  error,
  execute: handleSubmit,
} = useAsyncState(
  async () => {
    await updateUserData(form);
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
    @reset="updateFormValue"
    class="q-gutter-y-md"
    :disabled="isLoading || null"
  >
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

    <q-input
      outlined
      mask="+7 (###) ### - ## - ##"
      unmasked-value
      v-model="form.phone"
      label="Телефон"
      hint="Ваш номер телефона"
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

    <div class="q-gutter-y-sm">
      <q-btn
        label="Сохранить изменения"
        type="submit"
        color="primary"
        :disabled="isLoading || !formModified"
        :loading="isLoading"
      />

      <q-btn
        label="Сбросить"
        type="reset"
        color="primary"
        flat
        class="q-ml-sm"
        :disabled="isLoading || !formModified"
      />

      <DeleteButton
        class="btn-delete"
        label="Удалить пользователя"
        type="submit"
        color="negative"
        @confirm="deleteUser"
        :disabled="isLoading"
      />
    </div>
  </q-form>
</template>

<style lang="scss" scoped>
.btn-delete {
  @media (max-width: $breakpoint-xs-max) {
    width: 100%;
  }
}
</style>
