/**
 * Plasmic Studio app-host registration.
 * Studio iframes this app and discovers DragDropList + its prop controls.
 */

import registerComponent from '@plasmicapp/host/registerComponent'
import type { CodeComponentMeta } from '@plasmicapp/host/registerComponent'
import { DragDropList } from '@/components/DragDropList'
import type { DragDropListProps } from '@/types/dragDrop'
import { DEFAULT_PROJECTS_ENDPOINT } from '@/services/api'

export const dragDropListMeta: CodeComponentMeta<DragDropListProps> = {
  name: 'DragDropList',
  displayName: 'Drag Drop List',
  description:
    'Pick up to 10 projects/buildings from the backend, drag to reorder, then save draft and publish.',
  importPath: './components/DragDropList',
  importName: 'DragDropList',
  props: {
    title: {
      type: 'string',
      displayName: 'Title',
      description: 'Heading shown in the toolbar.',
      defaultValue: 'Top Buildings',
    },
    apiUrl: {
      type: 'string',
      displayName: 'Saved Order API URL',
      description:
        'Optional GET endpoint for the currently saved ordered list. Leave empty to start blank and only add via the projects dropdown.',
      defaultValue: '',
    },
    projectsEndpoint: {
      type: 'string',
      displayName: 'Projects Endpoint',
      description:
        'GET endpoint that returns project / building names for the add dropdown (get_project_names).',
      defaultValue: DEFAULT_PROJECTS_ENDPOINT,
    },
    entityName: {
      type: 'string',
      displayName: 'Entity Name',
      description: 'Label for this resource (Building, Product, Employee…).',
      defaultValue: 'Building',
    },
    displayField: {
      type: 'string',
      displayName: 'Display Field',
      description: 'Field name used as the row title (e.g. building_name).',
      defaultValue: 'building_name',
    },
    orderField: {
      type: 'string',
      displayName: 'Order Field',
      description: 'Numeric field used for sorting (e.g. display_order).',
      defaultValue: 'display_order',
    },
    saveDraftEndpoint: {
      type: 'string',
      displayName: 'Save Draft Endpoint',
      description: 'POST endpoint that accepts { items: [{ id, display_order }] }.',
      defaultValue: '/api/method/save_building_order_draft',
    },
    publishEndpoint: {
      type: 'string',
      displayName: 'Publish Endpoint',
      description: 'POST endpoint that publishes the saved draft order.',
      defaultValue: '/api/method/publish_building_order',
    },
    allowEditing: {
      type: 'boolean',
      displayName: 'Editing Enabled',
      description: 'When off, the list is read-only (no drag, save, or publish).',
      defaultValue: true,
    },
    showSearch: {
      type: 'boolean',
      displayName: 'Search',
      description: 'Show the toolbar search box.',
      defaultValue: true,
    },
    showProjectSelect: {
      type: 'boolean',
      displayName: 'Project Dropdown',
      description: 'Show the dropdown to add projects / buildings from the backend.',
      defaultValue: true,
    },
    showImages: {
      type: 'boolean',
      displayName: 'Show Images',
      description: 'Show image thumbnails when an image field is present.',
      defaultValue: true,
    },
    maxItems: {
      type: 'number',
      displayName: 'Max Items',
      description: 'Maximum number of buildings that can be added (default 10).',
      defaultValue: 10,
    },
    emptyMessage: {
      type: 'string',
      displayName: 'Empty Message',
      description: 'Message shown when the list has no items.',
      defaultValue: 'No buildings yet — add one from the dropdown',
    },
    className: {
      type: 'string',
      displayName: 'Class Name',
      description: 'Optional CSS class for the root element.',
    },
  },
}

/** Register with Plasmic Studio (app host). Call once at app startup. */
export function registerPlasmicComponents() {
  registerComponent(DragDropList, dragDropListMeta)
}
