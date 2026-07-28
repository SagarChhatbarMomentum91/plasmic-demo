/**
 * useSaveDraft — POST draft order.
 * Does not refetch the list: draft endpoints often don't change GET until publish.
 */

import { useMutation } from '@tanstack/react-query'
import { App } from 'antd'
import { saveOrderDraft, toOrderPayload } from '@/services/api'
import { isMockApiEnabled, mockApi } from '@/services/mock'
import type { NormalizedItem } from '@/types/dragDrop'

export function useSaveDraft(options: {
  endpoint: string
  apiUrl: string
  onSuccessLocal?: () => void
}) {
  const { endpoint, onSuccessLocal } = options
  const { message } = App.useApp()

  return useMutation({
    mutationFn: async (items: NormalizedItem[]) => {
      const payload = toOrderPayload(
        items.map((item) => ({ id: item.id, order: item.order })),
      )
      if (isMockApiEnabled) return mockApi.saveOrderDraft(endpoint, payload)
      return saveOrderDraft(endpoint, payload)
    },
    onSuccess: () => {
      onSuccessLocal?.()
      message.success('Draft saved')
    },
    onError: (error: Error) => {
      message.error(error.message || 'Failed to save draft')
    },
  })
}
