<script setup>
import TransitionFade from 'src/components/TransitionFade.vue';
import { useAuthStore } from 'src/stores/auth';
const { state, logout } = useAuthStore();
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-header>
        <q-toolbar style="max-width: 1200px; margin: auto">
          <q-btn flat dense to="/" exact label="Главная" />
          <q-space />
          <q-btn
            v-if="state.isAuthenticated"
            flat
            dense
            label="Выйти"
            @click="logout"
          />
          <div v-else>
            <q-btn flat dense to="/register" label="Регистрация" />
            <q-btn flat dense to="/login" label="Войти" />
          </div>
        </q-toolbar>
      </q-header>
      <div class="flex row items-center justify-evenly q-pa-md">
        <div class="flex row items-center justify-evenly" style="width: 600px">
          <TransitionFade>
            <router-view />
          </TransitionFade>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>
