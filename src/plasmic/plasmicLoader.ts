/**
 * Plasmic Loader — used when rendering Studio-designed pages in your React app.
 * Keep separate from app-host registration so the playground can run without tokens.
 */

import {
  initPlasmicLoader,
  type InitOptions,
  type PlasmicComponentLoader,
} from '@plasmicapp/loader-react'
import { DragDropList } from '@/components/DragDropList'
import { dragDropListMeta } from '@/plasmic/registerComponents'

export function createPlasmicLoader(
  options?: Partial<InitOptions>,
): PlasmicComponentLoader {
  const loader = initPlasmicLoader({
    projects: [
      {
        id: import.meta.env.VITE_PLASMIC_PROJECT_ID || 'YOUR_PROJECT_ID',
        token: import.meta.env.VITE_PLASMIC_API_TOKEN || 'YOUR_API_TOKEN',
      },
    ],
    preview: import.meta.env.DEV,
    ...options,
  })

  // Same meta as Studio registration — published pages resolve to this React component.
  loader.registerComponent(DragDropList, dragDropListMeta)
  return loader
}

let cached: PlasmicComponentLoader | null = null

/** Lazy singleton — only created when a Plasmic page is rendered. */
export function getPlasmicLoader(): PlasmicComponentLoader {
  if (!cached) cached = createPlasmicLoader()
  return cached
}
