<script lang="ts" setup>
import { ref, nextTick, Ref } from 'vue';

const hidePwd = ref(true);
const inputRef: Ref<HTMLElement | null> = ref(null);

const handleClick = async () => {
  hidePwd.value = !hidePwd.value;
  await nextTick();
  if (inputRef.value) inputRef.value.focus();
};
</script>

<template>
  <q-input ref="inputRef" :type="hidePwd ? 'password' : 'text'">
    <template v-slot:append>
      <q-icon
        :name="hidePwd ? 'visibility' : 'visibility_off'"
        class="cursor-pointer"
        @click="handleClick"
      />
    </template>
  </q-input>
</template>
