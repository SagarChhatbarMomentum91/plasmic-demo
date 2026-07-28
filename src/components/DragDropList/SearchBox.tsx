import { Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

export interface SearchBoxProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBox({
  value,
  onChange,
  placeholder = 'Search…',
}: SearchBoxProps) {
  return (
    <Input
      allowClear
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      prefix={<SearchOutlined />}
      className="pdl-search"
      aria-label="Search items"
    />
  )
}
