/**
 * Mock API for local / Plasmic canvas preview without a live backend.
 * Enabled when VITE_USE_MOCK_API=true (default in .env).
 */

import type {
  ApiMessageResponse,
  OrderedRecord,
  OrderPayloadItem,
  ProjectName,
} from '@/types/dragDrop'

const STORE_KEY = 'plasmic-dnd-list:items:v2'

/** Catalog of selectable projects (mirrors get_project_names). */
const projectCatalog: ProjectName[] = [
  { name: 'Atrius-Residential' },
  { name: 'Plaza One-Commercial' },
  { name: 'Garden Wing-Residential' },
  { name: 'Harbor View-Mixed' },
  { name: 'Skyline Tower-Commercial' },
  { name: 'Lake Shore-Residential' },
  { name: 'Central Park-Commercial' },
  { name: 'Oak Ridge-Residential' },
  { name: 'Metro Hub-Commercial' },
  { name: 'Sunrise Court-Residential' },
  { name: 'West End-Mixed' },
  { name: 'North Gate-Commercial' },
]

/** Curated ordered list starts empty — add via the projects dropdown. */
const seed: OrderedRecord[] = []

function delay(ms = 350) {
  return new Promise((r) => setTimeout(r, ms))
}

function read(): OrderedRecord[] {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (!raw) return seed
    return JSON.parse(raw) as OrderedRecord[]
  } catch {
    return seed
  }
}

function write(items: OrderedRecord[]) {
  localStorage.setItem(STORE_KEY, JSON.stringify(items))
}

export const isMockApiEnabled =
  import.meta.env.VITE_USE_MOCK_API === 'true' ||
  import.meta.env.VITE_USE_MOCK_API === '1' ||
  import.meta.env.VITE_USE_MOCK_API === undefined

export const mockApi = {
  async fetchOrderedItems(_apiUrl: string): Promise<OrderedRecord[]> {
    await delay()
    return [...read()].sort(
      (a, b) => Number(a.display_order ?? 0) - Number(b.display_order ?? 0),
    )
  },

  async fetchProjectNames(search?: string): Promise<ProjectName[]> {
    await delay(200)
    const q = search?.trim().toLowerCase() ?? ''
    if (!q) return [...projectCatalog]
    return projectCatalog.filter((p) => p.name.toLowerCase().includes(q))
  },

  async saveOrderDraft(
    _endpoint: string,
    items: OrderPayloadItem[],
  ): Promise<ApiMessageResponse> {
    await delay(450)
    const current = read()
    const byId = new Map(
      current.map((row) => [String(row.id ?? row.name), row]),
    )

    const next: OrderedRecord[] = items.map((row) => {
      const existing = byId.get(row.id)
      if (existing) {
        return { ...existing, display_order: row.display_order }
      }
      return {
        name: row.id,
        building_name: row.id,
        display_order: row.display_order,
        image: null,
      }
    })

    next.sort(
      (a, b) => Number(a.display_order ?? 0) - Number(b.display_order ?? 0),
    )
    write(next)
    return { success: true, message: 'Draft saved (mock)' }
  },

  async publishOrder(_endpoint: string): Promise<ApiMessageResponse> {
    await delay(500)
    return { success: true, message: 'Published (mock)' }
  },
}
