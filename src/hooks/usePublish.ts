/**
 * usePublish — POST publish endpoint and refresh list cache.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { App } from 'antd'
import { publishOrder } from '@/services/api'
import { isMockApiEnabled, mockApi } from '@/services/mock'

export function usePublish(options: {
  endpoint: string
  apiUrl: string
  onSuccessLocal?: () => void
}) {
  const { endpoint, apiUrl, onSuccessLocal } = options
  const { message } = App.useApp()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      if (isMockApiEnabled) return mockApi.publishOrder(endpoint)
      return publishOrder(endpoint)
    },
    onSuccess: async () => {
      onSuccessLocal?.()
      message.success('Order published')
      await queryClient.invalidateQueries({
        queryKey: ['ordered-items', apiUrl],
      })
    },
    onError: (error: Error) => {
      message.error(error.message || 'Failed to publish')
    },
  })
}
