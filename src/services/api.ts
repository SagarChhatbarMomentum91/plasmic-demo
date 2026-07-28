/**
 * Generic Axios API helpers for ordered lists.
 * No ERPNext-specific field names — callers pass URLs and field maps.
 */

import axios, { type AxiosInstance } from 'axios'
import type {
  ApiMessageResponse,
  OrderedRecord,
  OrderPayloadItem,
  ProjectName,
  SaveDraftRequest,
} from '@/types/dragDrop'

export const DEFAULT_PROJECTS_ENDPOINT =
  '/api/method/nexspace.nexspace.frontend_api.api.get_project_names'

const baseURL = import.meta.env.VITE_API_BASE_URL ?? ''

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data as
        | { message?: string; _error_message?: string }
        | undefined
      const msg = data?.message ?? data?._error_message ?? error.message
      return Promise.reject(new Error(msg || 'Request failed'))
    }
    return Promise.reject(error)
  },
)

/** Normalize ERPNext `{ data: [] }` or bare arrays. */
export function unwrapListPayload(payload: unknown): OrderedRecord[] {
  if (Array.isArray(payload)) return payload as OrderedRecord[]
  if (
    payload &&
    typeof payload === 'object' &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: OrderedRecord[] }).data
  }
  if (
    payload &&
    typeof payload === 'object' &&
    Array.isArray((payload as { message?: unknown }).message)
  ) {
    return (payload as { message: OrderedRecord[] }).message
  }
  return []
}

export async function fetchOrderedItems(apiUrl: string): Promise<OrderedRecord[]> {
  const { data } = await apiClient.get<unknown>(apiUrl)
  return unwrapListPayload(data)
}

/** Fetch NS Project names for the add dropdown (`get_project_names`). */
export async function fetchProjectNames(
  endpoint: string,
  search?: string,
): Promise<ProjectName[]> {
  const { data } = await apiClient.get<unknown>(endpoint, {
    params: search?.trim() ? { search: search.trim() } : undefined,
  })
  return unwrapListPayload(data)
    .map((row) => {
      const name = row.name
      return typeof name === 'string' && name.length > 0 ? { name } : null
    })
    .filter((row): row is ProjectName => row != null)
}

export async function saveOrderDraft(
  endpoint: string,
  items: OrderPayloadItem[],
): Promise<ApiMessageResponse> {
  const body: SaveDraftRequest = { items }
  const { data } = await apiClient.post<ApiMessageResponse>(endpoint, body)
  return data
}

export async function publishOrder(endpoint: string): Promise<ApiMessageResponse> {
  const { data } = await apiClient.post<ApiMessageResponse>(endpoint)
  return data
}

export function getRecordId(record: OrderedRecord): string {
  const value = record.id ?? record.name
  return value == null ? '' : String(value)
}

export function getRecordField(
  record: OrderedRecord,
  field: string,
): unknown {
  return record[field]
}

export function toOrderPayload(
  items: Array<{ id: string; order: number }>,
): OrderPayloadItem[] {
  return items.map((item) => ({
    id: item.id,
    display_order: item.order,
  }))
}
