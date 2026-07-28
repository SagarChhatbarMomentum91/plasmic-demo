# Plasmic DragDropList

Custom Plasmic code component: pick projects/buildings from the backend, drag to reorder (max 10), then Save Draft + Publish.

## Quick start

```bash
cd plasmic-dnd-list
npm install
npm run dev
```

Opens the app host at [http://localhost:3003](http://localhost:3003) with mock data.

## Connect to Plasmic Studio

1. Run `npm run dev` (keep it running — Studio iframes your app).
2. Open your Plasmic project → top-left **⋯** → **Configure project**.
3. Set **App host URL** to `http://localhost:3003/plasmic-host` (protocol: http).
4. Confirm, then reload Studio. **Drag Drop List** appears under custom components.
5. Drag it onto a page and configure props in the right panel:

| Prop | Example |
| --- | --- |
| Title | Top Buildings |
| Projects Endpoint | `/api/method/nexspace.nexspace.frontend_api.api.get_project_names` |
| Max Items | `10` |
| Entity Name | Building |
| Display Field | `building_name` |
| Project Dropdown | ✓ |
| Editing Enabled | ✓ |

6. Preview with live (or mock) data, then publish the Plasmic page.

## How it works

1. **Dropdown** loads project names from `get_project_names` (NS Project `name` values).
2. **Add** a project to the ordered list (max 10; already-added names are hidden).
3. **Drag** rows to set display order; remove with the trash icon.
4. **Save Draft** / **Publish** POST the ordered `{ id, display_order }` payload.

## Env

```env
VITE_USE_MOCK_API=true
VITE_API_BASE_URL=http://localhost:8000
VITE_PLASMIC_PROJECT_ID=...
VITE_PLASMIC_API_TOKEN=...
```

Set `VITE_USE_MOCK_API=false` to hit the real Frappe backend via the Vite `/api` proxy (session cookies required for `get_project_names`).

## Render a Plasmic page in React

```tsx
import { PlasmicPageExample } from '@/pages/PlasmicPageExample'

export default function Page() {
  return <PlasmicPageExample component="Homepage" />
}
```

## Architecture

| Layer | Role |
| --- | --- |
| `types/dragDrop.ts` | Plasmic props + normalized item shape |
| `services/api.ts` | REST helpers + `fetchProjectNames` |
| `hooks/useProjectNames.ts` | Dropdown catalog |
| `hooks/*` | Fetch, drag, save, publish |
| `components/DragDropList/*` | UI (including `ProjectSelect`) |
| `plasmic/registerComponents.ts` | Studio + loader registration |
