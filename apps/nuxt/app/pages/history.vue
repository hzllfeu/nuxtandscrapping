<script setup lang="ts">
import { getSearchHistory, deleteSearchHistory } from '~/composables/useSearchHistory'
import type { SearchHistoryEntry } from '~/composables/useSearchHistory'

useSeoMeta({
  title: 'Historique des recherches',
  description: 'Consultez et gérez vos recherches passées.',
})

const history = ref<SearchHistoryEntry[]>([])
const isLoading = ref(true)
const isError = ref(false)
const errorMessage = ref('')
const deleteError = ref('')

async function loadHistory() {
  isLoading.value = true
  isError.value = false
  errorMessage.value = ''
  deleteError.value = ''
  try {
    history.value = await getSearchHistory()
  } catch (e: unknown) {
    const err = e as { error?: string }
    isError.value = true
    errorMessage.value = err?.error ?? "Erreur lors du chargement de l'historique"
  } finally {
    isLoading.value = false
  }
}

async function handleDelete(entry: SearchHistoryEntry) {
  deleteError.value = ''
  try {
    await deleteSearchHistory(entry.id)
    history.value = history.value.filter((h) => h.id !== entry.id)
  } catch (e: unknown) {
    const err = e as { error?: string }
    deleteError.value = err?.error ?? 'Erreur lors de la suppression'
  }
}

onMounted(loadHistory)
</script>

<template>
  <div class="min-h-[calc(100vh-200px)] bg-linear-to-b from-blue-50 to-white">
    <div class="container mx-auto px-4 py-12">
      <div class="text-center mb-10">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Historique des recherches</h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Retrouvez et relancez vos recherches passées.
        </p>
      </div>

      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="isError" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p class="text-red-800 font-medium">{{ errorMessage }}</p>
        <button
          type="button"
          class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          @click="loadHistory"
        >
          Réessayer
        </button>
      </div>

      <div v-else>
        <div v-if="deleteError" class="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p class="text-red-800 text-sm font-medium">{{ deleteError }}</p>
        </div>

        <div v-if="history.length === 0" class="text-center py-20">
          <p class="text-gray-600 text-lg">Aucune recherche enregistrée pour le moment.</p>
        </div>

        <div v-else class="flex flex-col gap-4 max-w-3xl mx-auto">
          <p class="text-gray-600 text-sm text-center mb-2">
            <span class="font-semibold text-gray-900">{{ history.length }}</span>
            {{ history.length === 1 ? 'recherche enregistrée' : 'recherches enregistrées' }}
          </p>
          <HistoryEntryCard
            v-for="entry in history"
            :key="entry.id"
            :entry="entry"
            @delete="handleDelete(entry)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
