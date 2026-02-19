<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-base-200">
    <div class="navbar bg-base-100 shadow-lg">
      <div class="navbar-start">
        <a href="/" class="btn btn-ghost text-xl">Lab App</a>
      </div>
      <div class="navbar-center hidden md:flex">
        <ul class="menu menu-horizontal px-1 gap-1">
          <li><router-link to="/" active-class="active" class="rounded">Dashboard</router-link></li>
          <li><router-link to="/registros" active-class="active" class="rounded">Registros</router-link></li>
        </ul>
      </div>
      <div class="navbar-end">
        <span class="text-sm text-base-content/70 mr-2">{{ auth.user?.email }}</span>
        <span v-if="auth.isAdmin" class="badge badge-primary badge-sm">Admin</span>
        <button class="btn btn-ghost btn-sm" @click="logout">Sair</button>
      </div>
    </div>
    <main class="p-4 md:p-6">
      <router-view />
    </main>
  </div>
</template>
