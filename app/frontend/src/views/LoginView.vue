<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import api from '../api/client'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

async function submit() {
  error.value = ''
  loading.value = true
  try {
    const { data } = await api.post('/auth/login', { email: email.value, password: password.value })
    auth.setAuth(data.access_token, data.user)
    router.push(route.query.redirect || '/')
  } catch (e) {
    error.value = e.response?.data?.message || 'Falha no login'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200">
    <div class="card w-full max-w-md bg-base-100 shadow-xl">
      <div class="card-body">
        <h1 class="card-title text-2xl justify-center">Login</h1>
        <form @submit.prevent="submit" class="space-y-4">
          <div class="form-control">
            <label class="label" for="email">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="input input-bordered"
              placeholder="email@exemplo.com"
              required
            />
          </div>
          <div class="form-control">
            <label class="label" for="password">Senha</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="input input-bordered"
              required
            />
          </div>
          <div v-if="error" class="alert alert-error text-sm">{{ error }}</div>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
