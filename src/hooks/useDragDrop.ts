/**
 * useDragDrop — dnd-kit sensors + reorder. Entity-agnostic.
 */

import { useCallback, useMemo, useState } from 'react'
import {
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core'
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import type { NormalizedItem } from '@/types/dragDrop'
import { applySequentialOrder } from '@/lib/normalize'

export function useDragDrop(options: {
  items: NormalizedItem[]
  onOrderChange: (items: NormalizedItem[]) => void
  disabled?: boolean
}) {
  const { items, onOrderChange, disabled = false } = options
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const itemIds = useMemo(() => items.map((item) => item.id), [items])

  const activeItem = useMemo(
    () => items.find((item) => item.id === String(activeId)) ?? null,
    [items, activeId],
  )

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      if (disabled) return
      setActiveId(event.active.id)
    },
    [disabled],
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      setActiveId(null)
      if (disabled || !over || active.id === over.id) return

      const oldIndex = items.findIndex((item) => item.id === String(active.id))
      const newIndex = items.findIndex((item) => item.id === String(over.id))
      if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return

      onOrderChange(applySequentialOrder(arrayMove(items, oldIndex, newIndex)))
    },
    [disabled, items, onOrderChange],
  )

  const handleDragCancel = useCallback(() => {
    setActiveId(null)
  }, [])

  return {
    sensors,
    collisionDetection: closestCenter,
    itemIds,
    activeId,
    activeItem,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  }
}
