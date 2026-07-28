/**
 * useProjectNames — load project / building names for the add dropdown.
 */

import { useQuery } from '@tanstack/react-query'
import { fetchProjectNames } from '@/services/api'
import { isMockApiEnabled, mockApi } from '@/services/mock'

export function useProjectNames(options: {
  endpoint: string
  search?: string
  enabled?: boolean
}) {
  const { endpoint, search = '', enabled = true } = options

  return useQuery({
    queryKey: ['project-names', endpoint, search],
    enabled: Boolean(endpoint) && enabled,
    queryFn: async () => {
      if (isMockApiEnabled) return mockApi.fetchProjectNames(search)
      return fetchProjectNames(endpoint, search)
    },
    staleTime: 60_000,
  })
}
