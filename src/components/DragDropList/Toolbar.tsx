import { Button, Flex, Space, Tag, Typography } from 'antd'
import {
  CloudUploadOutlined,
  SaveOutlined,
} from '@ant-design/icons'
import type { ToolbarProps } from '@/types/dragDrop'
import { SearchBox } from './SearchBox'

const { Title } = Typography

export function Toolbar({
  title,
  entityName,
  allowEditing,
  showSearch,
  search,
  onSearchChange,
  isDirty,
  isSaving,
  isPublishing,
  onSaveDraft,
  onPublish,
  disableActions = false,
  itemCount,
  maxItems,
}: ToolbarProps) {
  const busy = isSaving || isPublishing || disableActions

  return (
    <header className="pdl-toolbar">
      <Flex justify="space-between" align="center" gap={16} wrap="wrap">
        <Space wrap size="middle" align="center">
          <Title level={4} className="pdl-toolbar__title">
            {title}
          </Title>
          <Tag>{entityName}</Tag>
          {typeof itemCount === 'number' && typeof maxItems === 'number' ? (
            <Tag>
              {itemCount}/{maxItems}
            </Tag>
          ) : null}
          {allowEditing ? (
            isDirty ? (
              <Tag color="warning">Unsaved changes</Tag>
            ) : (
              <Tag color="success">Saved</Tag>
            )
          ) : (
            <Tag>Read only</Tag>
          )}
        </Space>

        <Space wrap>
          {showSearch ? (
            <SearchBox
              value={search}
              onChange={onSearchChange}
              placeholder={`Search ${entityName.toLowerCase()}…`}
            />
          ) : null}

          {allowEditing ? (
            <>
              <Button
                icon={<SaveOutlined />}
                loading={isSaving}
                disabled={busy || !isDirty}
                onClick={onSaveDraft}
              >
                Save Draft
              </Button>
              <Button
                type="primary"
                icon={<CloudUploadOutlined />}
                loading={isPublishing}
                disabled={busy || isDirty}
                onClick={onPublish}
              >
                Publish
              </Button>
            </>
          ) : null}
        </Space>
      </Flex>
    </header>
  )
}
