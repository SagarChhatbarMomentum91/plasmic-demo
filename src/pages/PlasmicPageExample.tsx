/**
 * Example: render a Plasmic-designed page that includes the DragDropList code component.
 *
 * Usage:
 * 1. Set VITE_PLASMIC_PROJECT_ID and VITE_PLASMIC_API_TOKEN
 * 2. In Studio, set App host URL to http://localhost:3003
 * 3. Drop DragDropList onto a page named "Homepage" (or change component name below)
 * 4. Route to this page in your app
 */

import { PlasmicComponent, PlasmicRootProvider } from '@plasmicapp/loader-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { App as AntApp, ConfigProvider } from 'antd'
import { getPlasmicLoader } from '@/plasmic/plasmicLoader'

const queryClient = new QueryClient()

export function PlasmicPageExample({
  component = 'Homepage',
}: {
  component?: string
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider>
        <AntApp>
          <PlasmicRootProvider loader={getPlasmicLoader()}>
            <PlasmicComponent component={component} />
          </PlasmicRootProvider>
        </AntApp>
      </ConfigProvider>
    </QueryClientProvider>
  )
}

export default PlasmicPageExample
