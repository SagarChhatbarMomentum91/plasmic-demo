/**
 * useOrderedItems — fetch + normalize list data (generic; not Building-only).
 * File kept as useBuildings.ts alias export for the requested folder layout.
 */

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchOrderedItems } from '@/services/api'
import { isMockApiEnabled, mockApi } from '@/services/mock'
import { normalizeItems } from '@/lib/normalize'
import type { NormalizedItem } from '@/types/dragDrop'

/** Stable empty list — avoid `[]` literal so consumers' useEffects don't loop. */
const EMPTY_ITEMS: NormalizedItem[] = []

export function useOrderedItems(options: {
  apiUrl: string
  displayField: string
  orderField: string
  pageSize: number
  enabled?: boolean
}) {
  const { apiUrl, displayField, orderField, pageSize, enabled = true } = options
  const hasUrl = Boolean(apiUrl?.trim())

  const query = useQuery({
    queryKey: ['ordered-items', apiUrl, displayField, orderField, pageSize],
    enabled: hasUrl && enabled,
    queryFn: async () => {
      if (isMockApiEnabled) return mockApi.fetchOrderedItems(apiUrl)
      return fetchOrderedItems(apiUrl)
    },
    staleTime: 30_000,
  })

  const items = useMemo(
    () =>
      normalizeItems(
        query.data ?? [],
        displayField,
        orderField,
        pageSize,
      ),
    [query.data, displayField, orderField, pageSize],
  )

  return {
    ...query,
    // No saved-list URL → treat as successfully loaded empty curated list.
    isLoading: hasUrl ? query.isLoading : false,
    isError: hasUrl ? query.isError : false,
    items: hasUrl ? items : EMPTY_ITEMS,
  }
}

/** Alias matching the requested hook name for Buildings starter use-case. */
export const useBuildings = useOrderedItems
