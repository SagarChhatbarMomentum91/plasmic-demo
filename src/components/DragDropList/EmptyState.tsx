import { Empty } from 'antd'

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="pdl-empty">
      <Empty description={message} />
    </div>
  )
}
