import { Spin } from 'antd'

export function LoadingState({ tip = 'Loading…' }: { tip?: string }) {
  return (
    <div className="pdl-loading" aria-busy="true">
      <Spin size="large" tip={tip} />
    </div>
  )
}
