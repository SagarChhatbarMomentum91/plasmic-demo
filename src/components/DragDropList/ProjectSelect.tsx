import { useMemo, useState } from 'react'
import { Select, Space, Typography } from 'antd'
import type { ProjectName, ProjectSelectProps } from '@/types/dragDrop'

const { Text } = Typography

const EMPTY_OPTIONS: ProjectName[] = []

/**
 * Searchable dropdown of backend projects / building names.
 * Selecting an option adds it to the ordered DnD list (caller enforces max).
 */
export function ProjectSelect({
  options = EMPTY_OPTIONS,
  excludedIds,
  loading = false,
  disabled = false,
  maxReached = false,
  maxItems,
  itemCount,
  entityName,
  onAdd,
  onSearch,
}: ProjectSelectProps) {
  const [value, setValue] = useState<string | null>(null)

  const selectOptions = useMemo(
    () =>
      options
        .filter((p) => !excludedIds.has(p.name))
        .map((p) => ({ label: p.name, value: p.name })),
    [options, excludedIds],
  )

  const handleChange = (next: string | null) => {
    if (!next || maxReached || disabled) {
      setValue(null)
      return
    }
    onAdd(next)
    setValue(null)
  }

  return (
    <div className="pdl-project-select">
      <Space wrap size="middle" align="center" style={{ width: '100%' }}>
        <Select
          showSearch
          allowClear
          value={value}
          placeholder={
            maxReached
              ? `Maximum of ${maxItems} ${entityName.toLowerCase()}s reached`
              : `Add ${entityName.toLowerCase()}…`
          }
          options={selectOptions}
          loading={loading}
          disabled={disabled || maxReached}
          onSearch={onSearch}
          onChange={handleChange}
          filterOption={
            onSearch
              ? false
              : (input, option) =>
                  String(option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
          }
          optionFilterProp="label"
          style={{ minWidth: 280, flex: 1 }}
          aria-label={`Add ${entityName}`}
          notFoundContent={loading ? 'Loading…' : 'No projects found'}
        />
        <Text type="secondary" className="pdl-project-select__count">
          {itemCount}/{maxItems}
        </Text>
      </Space>
    </div>
  )
}
