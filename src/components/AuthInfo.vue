<script lang="ts" setup>
import { useAuthStore } from 'src/stores/auth';
import { computed, ref, watch } from 'vue';
import { formatDate, formatDuration } from '.././util';
import type { Ref } from 'vue';

const { state } = useAuthStore();

let timeOffsetItem = localStorage.getItem(
    `timeOffset_${state.accessToken?.iat}`
  ),
  timeOffset: number;
if (!timeOffsetItem) {
  localStorage.clear();
  timeOffset = new Date().getTime() - state.accessToken?.iat;
  localStorage.setItem(
    `timeOffset_${state.accessToken?.iat}`,
    timeOffset.toString()
  );
} else timeOffset = +timeOffsetItem;

const currTimeTs: Ref<number> = ref(new Date().getTime() - timeOffset);
const iat = computed(() =>
  state.accessToken?.iat ? formatDate(state.accessToken.iat) : 'не выдан'
);
const expIn = computed(() => {
  if (!state.accessToken?.exp || state.accessToken?.exp - currTimeTs.value <= 0)
    return '00:00';
  else return formatDuration(state.accessToken.exp - currTimeTs.value);
});

const timeout = setInterval(() => {
  currTimeTs.value = new Date().getTime() - timeOffset;
}, 1000);

watch(expIn, (value) => {
  if (value === '00:00') clearTimeout(timeout);
});
</script>

<template>
  <div>
    <h6 class="flex items-center justify-between">
      Пользователь:
      <span>
        {{ state.user?.email }}
      </span>
    </h6>
    <h6 class="flex items-center justify-between">
      Токен выдан:
      <span>{{ iat }}</span>
    </h6>
    <h6 class="flex items-center justify-between">
      Токен истекает через:
      <span>{{ expIn }}</span>
    </h6>
  </div>
</template>
