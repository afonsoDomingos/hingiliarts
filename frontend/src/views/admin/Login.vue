<template>
  <div class="login-page">
    <div class="login-card">
      <div class="text-center mb-4">
        <h1 class="logo-text">Hingili<span class="highlight">Arts</span></h1>
        <p class="text-secondary">Painel Administrativo</p>
      </div>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group mb-3">
          <label>Email</label>
          <input v-model="email" type="email" required placeholder="admin@hingilearts.com">
        </div>
        <div class="form-group mb-4">
          <label>Senha</label>
          <input v-model="password" type="password" required placeholder="••••••••">
        </div>
        
        <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
          {{ isLoading ? 'Entrando...' : 'Entrar no Painel' }}
        </button>
        
        <p v-if="error" class="error-msg text-center mt-3">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const email = ref('');
const password = ref('');
const error = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  isLoading.value = true;
  error.value = '';
  try {
    const response = await axios.post('http://localhost:5000/api/admin/login', {
      email: email.value,
      password: password.value
    });
    localStorage.setItem('adminToken', response.data.token);
    localStorage.setItem('adminUser', JSON.stringify(response.data.user));
    router.push('/admin/dashboard');
  } catch (err) {
    error.value = err.response?.data?.message || 'Erro ao fazer login';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-main);
}

.login-card {
  background: var(--bg-secondary);
  padding: 40px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.form-group input {
  width: 100%;
  padding: 12px 15px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  transition: var(--transition);
}

.form-group input:focus {
  outline: none;
  border-color: #ff8a00;
}

.error-msg {
  color: #ef4444;
  font-size: 0.85rem;
}

.w-100 {
  width: 100%;
  justify-content: center;
}

.mb-3 { margin-bottom: 1rem; }
.mb-4 { margin-bottom: 1.5rem; }
</style>
