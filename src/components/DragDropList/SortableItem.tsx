import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Avatar, Button, Flex, Tag, Typography } from 'antd'
import {
  DeleteOutlined,
  HolderOutlined,
  HomeOutlined,
} from '@ant-design/icons'
import type { CSSProperties } from 'react'
import type { NormalizedItem } from '@/types/dragDrop'

const { Text } = Typography

export interface SortableItemProps {
  item: NormalizedItem
  disabled?: boolean
  showImages?: boolean
  onRemove?: (id: string) => void
}

export function SortableItem({
  item,
  disabled = false,
  showImages = true,
  onRemove,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, disabled })

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.55 : 1,
    zIndex: isDragging ? 2 : undefined,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`pdl-item${isDragging ? ' pdl-item--dragging' : ''}`}
    >
      <Flex align="center" gap={12} className="pdl-item__row">
        <button
          type="button"
          className="pdl-handle"
          aria-label={`Drag ${item.label}`}
          disabled={disabled}
          {...attributes}
          {...listeners}
        >
          <HolderOutlined />
        </button>

        {showImages ? (
          <Avatar
            shape="square"
            size={44}
            src={item.image || undefined}
            icon={!item.image ? <HomeOutlined /> : undefined}
          />
        ) : null}

        <div className="pdl-item__meta">
          <Text strong>{item.label}</Text>
          <Text type="secondary" className="pdl-item__id">
            {item.id}
          </Text>
        </div>

        <Tag>Position {item.order}</Tag>

        {onRemove && !disabled ? (
          <Button
            type="text"
            danger
            size="small"
            icon={<DeleteOutlined />}
            aria-label={`Remove ${item.label}`}
            onClick={() => onRemove(item.id)}
          />
        ) : null}
      </Flex>
    </li>
  )
}
