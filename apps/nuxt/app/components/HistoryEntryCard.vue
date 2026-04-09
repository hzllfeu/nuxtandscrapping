<script setup lang="ts">
import type { SearchHistoryEntry } from '~/composables/useSearchHistory'
import { TrashIcon } from '@heroicons/vue/24/outline'

defineProps<{
  entry: SearchHistoryEntry
}>()

defineEmits<{
  delete: []
}>()

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow flex items-center justify-between gap-4">
    <div class="flex flex-col gap-1 min-w-0">
      <span class="text-lg font-semibold text-gray-900 truncate">{{ entry.query }}</span>
      <span class="text-sm text-gray-500">{{ formatDate(entry.createdAt) }}</span>
    </div>
    <div class="flex items-center gap-2 shrink-0">
      <NuxtLink
        :to="`/results?q=${encodeURIComponent(entry.query)}`"
        class="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        Relancer
      </NuxtLink>
      <button
        type="button"
        class="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
        @click="$emit('delete')"
      >
        <TrashIcon class="h-5 w-5" />
      </button>
    </div>
  </div>
</template>
