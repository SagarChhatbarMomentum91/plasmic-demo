/**
 * Generic ordered-item contracts for the Plasmic DragDropList.
 * Independent of ERPNext / Buildings — any REST resource works.
 */

/** Loose record returned by list APIs. */
export type OrderedRecord = Record<string, unknown> & {
  id?: string | number
  name?: string
}

export interface OrderPayloadItem {
  id: string
  display_order: number
}

export interface SaveDraftRequest {
  items: OrderPayloadItem[]
}

export interface ApiMessageResponse {
  message?: string | { success?: boolean; message?: string }
  data?: unknown
  success?: boolean
}

/** NS Project name row from get_project_names. */
export interface ProjectName {
  name: string
}

/** Props exposed to Plasmic Studio (right-side panel). */
export interface DragDropListProps {
  /** Toolbar / section title. */
  title?: string
  /**
   * GET endpoint for the currently saved ordered list (array or `{ data: [] }` / `{ message: [] }`).
   * Leave empty to start from an empty curated list and only add via the projects dropdown.
   */
  apiUrl?: string
  /**
   * GET endpoint that returns project / building names for the add dropdown
   * (Frappe `{ message: [{ name }] }`).
   */
  projectsEndpoint?: string
  /** Human-readable entity label (e.g. Building). */
  entityName?: string
  /** Field used as the primary label in each row. */
  displayField?: string
  /** Numeric order field name on each record. */
  orderField?: string
  /** POST endpoint for saving draft order. */
  saveDraftEndpoint?: string
  /** POST endpoint for publishing order. */
  publishEndpoint?: string
  /** When false, list is read-only (no drag / save / publish). */
  allowEditing?: boolean
  /** Show search box in the toolbar. */
  showSearch?: boolean
  /** Show the projects / buildings add dropdown. */
  showProjectSelect?: boolean
  /** Show image thumbnail when an `image` field exists. */
  showImages?: boolean
  /**
   * Maximum number of items that can be added / kept in the ordered list.
   * Defaults to 10.
   */
  maxItems?: number
  /** @deprecated Prefer `maxItems`. Kept for Plasmic backward compatibility. */
  pageSize?: number
  /** Empty-state copy. */
  emptyMessage?: string
  /** Optional className for the root. */
  className?: string
}

export interface NormalizedItem {
  /** Stable id used by dnd-kit (string). */
  id: string
  /** Raw API record. */
  raw: OrderedRecord
  /** Resolved display label. */
  label: string
  /** Current display order (1-based). */
  order: number
  /** Optional image URL. */
  image?: string | null
}

export interface ToolbarProps {
  title: string
  entityName: string
  allowEditing: boolean
  showSearch: boolean
  search: string
  onSearchChange: (value: string) => void
  isDirty: boolean
  isSaving: boolean
  isPublishing: boolean
  onSaveDraft: () => void
  onPublish: () => void
  disableActions?: boolean
  itemCount?: number
  maxItems?: number
}

export interface ProjectSelectProps {
  options: ProjectName[]
  excludedIds: Set<string>
  loading?: boolean
  disabled?: boolean
  maxReached?: boolean
  maxItems: number
  itemCount: number
  entityName: string
  onAdd: (name: string) => void
  onSearch?: (value: string) => void
}
