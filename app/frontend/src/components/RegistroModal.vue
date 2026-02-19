<script setup>
import { ref, watch, onMounted } from 'vue'
import api from '../api/client'

const props = defineProps({
  registroId: { type: String, default: null },
})

const emit = defineEmits(['close', 'saved'])

const nome = ref('')
const email = ref('')
const telefone = ref('')
const status = ref('PENDENTE')
const loading = ref(false)
const error = ref('')

const statusOptions = [
  { value: 'PENDENTE', label: 'Pendente' },
  { value: 'EM_ANDAMENTO', label: 'Em andamento' },
  { value: 'CONCLUIDO', label: 'Concluído' },
]

async function load(id) {
  if (!id) {
    nome.value = ''
    email.value = ''
    telefone.value = ''
    status.value = 'PENDENTE'
    return
  }
  loading.value = true
  try {
    const { data } = await api.get(`/registros/${id}`)
    nome.value = data.nome
    email.value = data.email
    telefone.value = data.telefone
    status.value = data.status
  } catch {
    emit('close')
  } finally {
    loading.value = false
  }
}

watch(() => props.registroId, load, { immediate: true })
onMounted(() => load(props.registroId))

async function submit() {
  error.value = ''
  loading.value = true
  try {
    const payload = { nome: nome.value, email: email.value, telefone: telefone.value, status: status.value }
    if (props.registroId) {
      await api.patch(`/registros/${props.registroId}`, payload)
    } else {
      await api.post('/registros', payload)
    }
    emit('saved')
  } catch (e) {
    const msg = e.response?.data?.message
    error.value = Array.isArray(msg) ? msg.join(', ') : (msg || 'Erro ao salvar')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <dialog class="modal modal-open" open>
    <div class="modal-box">
      <h2 class="text-xl font-bold mb-4">{{ registroId ? 'Editar' : 'Novo' }} Registro</h2>
      <form @submit.prevent="submit" class="space-y-4">
        <div class="form-control">
          <label class="label">Nome</label>
          <input v-model="nome" type="text" class="input input-bordered" required />
        </div>
        <div class="form-control">
          <label class="label">Email</label>
          <input v-model="email" type="email" class="input input-bordered" required />
        </div>
        <div class="form-control">
          <label class="label">Telefone</label>
          <input
            v-model="telefone"
            type="tel"
            class="input input-bordered"
            placeholder="(11) 98765-4321"
            minlength="8"
            required
          />
        </div>
        <div class="form-control">
          <label class="label">Status</label>
          <select v-model="status" class="select select-bordered">
            <option v-for="o in statusOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
          </select>
        </div>
        <div v-if="error" class="alert alert-error text-sm">{{ error }}</div>
        <div class="modal-action">
          <button type="button" class="btn" @click="emit('close')">Cancelar</button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>
      </form>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button type="button" @click="emit('close')">fechar</button>
    </form>
  </dialog>
</template>
