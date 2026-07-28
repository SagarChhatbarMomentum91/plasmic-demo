import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { App as AntApp, ConfigProvider, Layout, Typography, theme } from 'antd'
import { DragDropList } from '@/components/DragDropList'
import { PlasmicHost } from '@/pages/PlasmicHost'
import './App.css'

const { Header, Content, Footer } = Layout
const { Text, Title, Paragraph } = Typography

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
})

/**
 * /plasmic-host → Studio app host (PlasmicCanvasHost + registrations)
 * everything else → local playground
 */
export function App() {
  if (window.location.pathname === '/plasmic-host') {
    return <PlasmicHost />
  }

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
          <Layout className="app-layout">
            <Header className="app-header">
              <Text className="app-brand">plasmic-dnd-list</Text>
              <Text type="secondary">Plasmic custom component host</Text>
            </Header>
            <Content className="app-content">
              <section className="app-intro">
                <Title level={3}>DragDropList playground</Title>
                <Paragraph type="secondary">
                  Local preview of the same component Studio uses. App host URL:{' '}
                  <a href="/plasmic-host">/plasmic-host</a>
                </Paragraph>
              </section>

              <DragDropList
                title="Top Buildings"
                projectsEndpoint="/api/method/nexspace.nexspace.frontend_api.api.get_project_names"
                entityName="Building"
                displayField="building_name"
                orderField="display_order"
                saveDraftEndpoint="/api/method/save_building_order_draft"
                publishEndpoint="/api/method/publish_building_order"
                allowEditing
                showSearch
                showProjectSelect
                showImages
                maxItems={10}
                emptyMessage="No buildings yet — add one from the dropdown"
              />
            </Content>
            <Footer className="app-footer">
              App host for Plasmic · mock API enabled by default
            </Footer>
          </Layout>
        </AntApp>
      </ConfigProvider>
    </QueryClientProvider>
  )
}

export default App
