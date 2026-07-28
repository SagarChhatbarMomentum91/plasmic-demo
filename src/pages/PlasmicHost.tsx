/**
 * Plasmic app-host page.
 * Studio iframes this URL to discover + render registered code components.
 *
 * Point Project → Configure project → App host URL to:
 *   http://localhost:3003/plasmic-host
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { App as AntApp, ConfigProvider, theme } from 'antd'
import { PlasmicCanvasHost } from '@plasmicapp/host'
import { registerPlasmicComponents } from '@/plasmic/registerComponents'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
})

// Must run before PlasmicCanvasHost mounts so Studio can enumerate components.
registerPlasmicComponents()

export function PlasmicHost() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
          token: {
            colorPrimary: '#1677ff',
            borderRadius: 8,
            fontFamily:
              '"IBM Plex Sans", "Segoe UI", system-ui, -apple-system, sans-serif',
          },
        }}
      >
        <AntApp>
          <PlasmicCanvasHost />
        </AntApp>
      </ConfigProvider>
    </QueryClientProvider>
  )
}

export default PlasmicHost
