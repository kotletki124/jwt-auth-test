<script lang="ts" setup>
import { ref } from 'vue';
const emit = defineEmits(['confirm']);
const showDialog = ref(false);
</script>

<template>
  <q-btn @click="showDialog = !showDialog">
    <q-dialog v-model="showDialog">
      <q-card>
        <q-card-section class="row items-center no-wrap">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm"
            >Вы действительно хотите удалить аккаунт? Это действие нельзя
            отменить.</span
          >
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Отмена" color="primary" v-close-popup />
          <q-btn
            flat
            label="Удалить"
            color="negative"
            v-close-popup
            @click="emit('confirm')"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-btn>
</template>
