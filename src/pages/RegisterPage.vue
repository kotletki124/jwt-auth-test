<script setup>
import { ref } from 'vue';
import RegistrationSuccess from 'src/components/RegistrationSuccess.vue';
import RegistrationForm from 'src/components/RegistrationForm.vue';
import TransitionFade from 'src/components/TransitionFade.vue';

const registrationCompleted = ref(false);
</script>

<template>
  <q-page class="col items-center justify-evenly">
    <TransitionFade class="q-pa-md">
      <RegistrationSuccess v-if="registrationCompleted" />
      <RegistrationForm v-else @register="registrationCompleted = true" />
    </TransitionFade>
  </q-page>
</template>
