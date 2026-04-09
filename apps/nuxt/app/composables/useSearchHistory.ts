export interface SearchHistoryEntry {
  id: number
  query: string
  createdAt: string
}

export interface SearchHistoryError {
  error: string
  status?: number
}

export async function getSearchHistory(): Promise<SearchHistoryEntry[]> {
  const config = useRuntimeConfig()
  const base = config.public.apiBase as string
  const url = `${base.replace(/\/$/, '')}/searchHistory`
  try {
    const data = await $fetch<SearchHistoryEntry[]>(url)
    const list = Array.isArray(data) ? data : []
    return list.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch (e: unknown) {
    const err = e as { data?: { error?: string }; statusCode?: number }
    throw {
      error: err?.data?.error ?? (e instanceof Error ? e.message : "Erreur lors du chargement de l'historique"),
      status: err?.statusCode,
    } as SearchHistoryError
  }
}

export async function addSearchHistory(query: string): Promise<SearchHistoryEntry> {
  const trimmed = query.trim()
  if (!trimmed) {
    throw { error: 'La requête ne peut pas être vide' } as SearchHistoryError
  }
  const config = useRuntimeConfig()
  const base = config.public.apiBase as string
  const url = `${base.replace(/\/$/, '')}/searchHistory`
  try {
    const data = await $fetch<SearchHistoryEntry>(url, {
      method: 'POST',
      body: { query: trimmed, createdAt: new Date().toISOString() },
    })
    return data
  } catch (e: unknown) {
    const err = e as { data?: { error?: string }; statusCode?: number }
    throw {
      error: err?.data?.error ?? (e instanceof Error ? e.message : "Erreur lors de l'ajout à l'historique"),
      status: err?.statusCode,
    } as SearchHistoryError
  }
}

export async function deleteSearchHistory(id: number): Promise<void> {
  const config = useRuntimeConfig()
  const base = config.public.apiBase as string
  const url = `${base.replace(/\/$/, '')}/searchHistory/${id}`
  try {
    await $fetch(url, { method: 'DELETE' })
  } catch (e: unknown) {
    const err = e as { data?: { error?: string }; statusCode?: number }
    throw {
      error: err?.data?.error ?? (e instanceof Error ? e.message : "Erreur lors de la suppression de l'entrée"),
      status: err?.statusCode,
    } as SearchHistoryError
  }
}
