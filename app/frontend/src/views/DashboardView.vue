<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/client'

const stats = ref({ total: 0, pendentes: 0, emAndamento: 0, concluidos: 0 })
const loading = ref(true)

onMounted(async () => {
  try {
    const { data } = await api.get('/registros/stats')
    stats.value = data
  } catch {
    stats.value = { total: 0, pendentes: 0, emAndamento: 0, concluidos: 0 }
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Dashboard</h1>
    <div v-if="loading" class="flex justify-center py-12">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="stat bg-base-100 rounded-box shadow">
        <div class="stat-title">Total</div>
        <div class="stat-value text-primary">{{ stats.total }}</div>
        <div class="stat-desc">registros</div>
      </div>
      <div class="stat bg-base-100 rounded-box shadow">
        <div class="stat-title">Pendentes</div>
        <div class="stat-value text-warning">{{ stats.pendentes }}</div>
      </div>
      <div class="stat bg-base-100 rounded-box shadow">
        <div class="stat-title">Em andamento</div>
        <div class="stat-value text-info">{{ stats.emAndamento }}</div>
      </div>
      <div class="stat bg-base-100 rounded-box shadow">
        <div class="stat-title">Concluídos</div>
        <div class="stat-value text-success">{{ stats.concluidos }}</div>
      </div>
    </div>
  </div>
</template>
