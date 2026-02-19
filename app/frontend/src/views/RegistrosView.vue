<script setup>
import { ref, onMounted, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import api from '../api/client'
import RegistroModal from '../components/RegistroModal.vue'

const auth = useAuthStore()
const registros = ref([])
const total = ref(0)
const page = ref(1)
const limit = ref(10)
const totalPages = ref(0)
const statusFilter = ref('')
const search = ref('')
const loading = ref(false)
const modalOpen = ref(false)
const editingId = ref(null)

function fetchRegistros() {
  loading.value = true
  const params = { page: page.value, limit: limit.value }
  if (statusFilter.value) params.status = statusFilter.value
  if (search.value.trim()) params.search = search.value.trim()
  api.get('/registros', { params })
    .then(({ data }) => {
      registros.value = data.data
      total.value = data.total
      totalPages.value = data.totalPages
    })
    .catch(() => { registros.value = [] })
    .finally(() => { loading.value = false })
}

onMounted(fetchRegistros)
watch([page, statusFilter], fetchRegistros)

let searchTimeout
watch(search, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    page.value = 1
    fetchRegistros()
  }, 300)
})

function openCreate() {
  editingId.value = null
  modalOpen.value = true
}

function openEdit(id) {
  editingId.value = id
  modalOpen.value = true
}

function onSaved() {
  modalOpen.value = false
  fetchRegistros()
}

async function onDelete(id) {
  if (!confirm('Excluir este registro?')) return
  try {
    await api.delete(`/registros/${id}`)
    fetchRegistros()
  } catch (e) {
    alert(e.response?.data?.message || 'Erro ao excluir')
  }
}

function statusLabel(s) {
  const map = { PENDENTE: 'Pendente', EM_ANDAMENTO: 'Em andamento', CONCLUIDO: 'Concluído' }
  return map[s] || s
}
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <h1 class="text-2xl font-bold">Registros</h1>
      <button class="btn btn-primary" @click="openCreate">Novo registro</button>
    </div>

    <div class="flex flex-wrap gap-4 mb-4">
      <input
        v-model="search"
        type="text"
        placeholder="Buscar por nome ou email..."
        class="input input-bordered flex-1 min-w-[200px]"
      />
      <select v-model="statusFilter" class="select select-bordered">
        <option value="">Todos os status</option>
        <option value="PENDENTE">Pendente</option>
        <option value="EM_ANDAMENTO">Em andamento</option>
        <option value="CONCLUIDO">Concluído</option>
      </select>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
    <div v-else class="overflow-x-auto">
      <table class="table table-zebra bg-base-100 shadow rounded-box">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Status</th>
            <th class="w-24">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in registros" :key="r.id">
            <td>{{ r.nome }}</td>
            <td>{{ r.email }}</td>
            <td>{{ r.telefone }}</td>
            <td>
              <span
                :class="{
                  'badge-warning': r.status === 'PENDENTE',
                  'badge-info': r.status === 'EM_ANDAMENTO',
                  'badge-success': r.status === 'CONCLUIDO',
                }"
                class="badge"
              >
                {{ statusLabel(r.status) }}
              </span>
            </td>
            <td>
              <div class="flex gap-2">
                <button class="btn btn-ghost btn-sm" @click="openEdit(r.id)">Editar</button>
                <button
                  v-if="auth.isAdmin"
                  class="btn btn-ghost btn-sm text-error"
                  @click="onDelete(r.id)"
                >
                  Excluir
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="registros.length === 0" class="text-center py-8 text-base-content/70">
        Nenhum registro encontrado.
      </div>
    </div>

    <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-4">
      <button
        class="btn btn-sm"
        :disabled="page <= 1"
        @click="page--"
      >
        Anterior
      </button>
      <span class="flex items-center px-4">Página {{ page }} de {{ totalPages }}</span>
      <button
        class="btn btn-sm"
        :disabled="page >= totalPages"
        @click="page++"
      >
        Próxima
      </button>
    </div>

    <RegistroModal
      v-if="modalOpen"
      :registro-id="editingId"
      @close="modalOpen = false"
      @saved="onSaved"
    />
  </div>
</template>
