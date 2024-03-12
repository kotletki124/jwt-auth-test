import { defineStore } from 'pinia';
import { reactive, ref, watch } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import type { Ref } from 'vue';
import type {
  AuthStoreState,
  LoginDto,
  RegisterDto,
  UpdateUserDto,
} from 'app/server/src/shared/types';
import type { AxiosError } from 'axios';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  const { id, ...initialState } = window.__INITIAL_STATE__ || {};
  const userId: Ref<number | null> = ref(id || null);
  const state: AuthStoreState = reactive({
    isAuthenticated: false,
    user: null,
    ...initialState,
  });

  axios.interceptors.response.use(null, (error: AxiosError) => {
    if (error.response?.status === 401) {
      logout();
    }
    return Promise.reject(error);
  });

  watch(userId, (value) => {
    if (value) fetchUserData(value);
  });

  watch(
    () => state.isAuthenticated,
    (value) => {
      if (!value) router.push('/login');
      else router.push('/');
    }
  );

  async function login(loginDto: LoginDto): Promise<void> {
    const {
      data: { id, accessToken },
    } = await axios.post('/api/auth/login', loginDto);
    userId.value = id;
    Object.assign(state, { accessToken, isAuthenticated: true });
  }

  async function logout() {
    const success = await axios.get('/api/auth/logout');
    if (success) {
      userId.value = null;
      Object.assign(state, { isAuthenticated: false, user: null });
    }
  }

  async function register(data: RegisterDto): Promise<boolean> {
    const user = await axios.post('api/auth/register', data);
    return !!user;
  }

  async function checkIfEmailAvailable(email: string): Promise<boolean> {
    try {
      const res = await axios.post('api/users/check', { email });
      return res.data;
    } catch {
      return true;
    }
  }

  async function fetchUserData(id: number) {
    const res = await axios.get(`api/users/${id}`);
    state.user = res.data;
  }

  async function updateUserData(data: UpdateUserDto) {
    if (userId.value) {
      const res = await axios.put(`api/users/${userId.value}`, data);
      state.user = res.data;
    }
  }

  async function deleteUser() {
    if (userId.value) {
      const res = await axios.delete(`api/users/${userId.value}`);
      if (res) logout();
    }
  }

  return {
    state,
    login,
    logout,
    updateUserData,
    deleteUser,
    register,
    checkIfEmailAvailable,
  };
});
