import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, App as AntApp } from 'antd'
import {
  DndContext,
  DragOverlay,
  MeasuringStrategy,
  type UniqueIdentifier,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import type { DragDropListProps, NormalizedItem, ProjectName } from '@/types/dragDrop'
import { DEFAULT_PROJECTS_ENDPOINT } from '@/services/api'
import { useOrderedItems } from '@/hooks/useBuildings'
import { useProjectNames } from '@/hooks/useProjectNames'
import { useDragDrop } from '@/hooks/useDragDrop'
import { useSaveDraft } from '@/hooks/useSaveDraft'
import { usePublish } from '@/hooks/usePublish'
import {
  applySequentialOrder,
  filterBySearch,
  isSameOrder,
  itemFromProjectName,
} from '@/lib/normalize'
import { Toolbar } from './Toolbar'
import { ProjectSelect } from './ProjectSelect'
import { SortableItem } from './SortableItem'
import { EmptyState } from './EmptyState'
import { LoadingState } from './LoadingState'
import './styles.css'

const EMPTY_PROJECT_OPTIONS: ProjectName[] = []

const DEFAULTS = {
  title: 'Top Buildings',
  apiUrl: '',
  projectsEndpoint: DEFAULT_PROJECTS_ENDPOINT,
  entityName: 'Building',
  displayField: 'building_name',
  orderField: 'display_order',
  saveDraftEndpoint: '/api/method/save_building_order_draft',
  publishEndpoint: '/api/method/publish_building_order',
  allowEditing: true,
  showSearch: true,
  showProjectSelect: true,
  showImages: true,
  maxItems: 10,
  emptyMessage: 'No buildings yet — add one from the dropdown',
} as const

/**
 * Plasmic-ready DragDropList.
 * Editors configure props in Studio; the component owns
 * fetch projects → add (max N) → reorder → save → publish.
 */
export function DragDropList(props: DragDropListProps) {
  const title = props.title ?? DEFAULTS.title
  const apiUrl = props.apiUrl ?? DEFAULTS.apiUrl
  const projectsEndpoint =
    props.projectsEndpoint ?? DEFAULTS.projectsEndpoint
  const entityName = props.entityName ?? DEFAULTS.entityName
  const displayField = props.displayField ?? DEFAULTS.displayField
  const orderField = props.orderField ?? DEFAULTS.orderField
  const saveDraftEndpoint =
    props.saveDraftEndpoint ?? DEFAULTS.saveDraftEndpoint
  const publishEndpoint = props.publishEndpoint ?? DEFAULTS.publishEndpoint
  const allowEditing = props.allowEditing ?? DEFAULTS.allowEditing
  const showSearch = props.showSearch ?? DEFAULTS.showSearch
  const showProjectSelect =
    props.showProjectSelect ?? DEFAULTS.showProjectSelect
  const showImages = props.showImages ?? DEFAULTS.showImages
  const maxItems = props.maxItems ?? props.pageSize ?? DEFAULTS.maxItems
  const emptyMessage = props.emptyMessage ?? DEFAULTS.emptyMessage

  const { items: serverItems, isLoading, isError, error, isFetching, refetch } =
    useOrderedItems({
      apiUrl,
      displayField,
      orderField,
      pageSize: maxItems,
    })

  const [draftItems, setDraftItems] = useState<NormalizedItem[]>([])
  const [baselineItems, setBaselineItems] = useState<NormalizedItem[]>([])
  const [search, setSearch] = useState('')
  const { message } = AntApp.useApp()

  const projectNamesQuery = useProjectNames({
    endpoint: projectsEndpoint,
    enabled: showProjectSelect,
  })

  useEffect(() => {
    setDraftItems((prev) => (isSameOrder(prev, serverItems) ? prev : serverItems))
    setBaselineItems((prev) =>
      isSameOrder(prev, serverItems) ? prev : serverItems,
    )
  }, [serverItems])

  const isDirty = useMemo(
    () => !isSameOrder(baselineItems, draftItems),
    [baselineItems, draftItems],
  )

  const markClean = useCallback(() => {
    setBaselineItems(draftItems)
  }, [draftItems])

  const saveDraftMutation = useSaveDraft({
    endpoint: saveDraftEndpoint,
    apiUrl,
    onSuccessLocal: markClean,
  })

  const publishMutation = usePublish({
    endpoint: publishEndpoint,
    apiUrl,
    onSuccessLocal: markClean,
  })

  const onOrderChange = useCallback((next: NormalizedItem[]) => {
    setDraftItems(next)
  }, [])

  const {
    sensors,
    collisionDetection,
    itemIds,
    activeItem,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  } = useDragDrop({
    items: draftItems,
    onOrderChange,
    disabled:
      !allowEditing ||
      saveDraftMutation.isPending ||
      publishMutation.isPending,
  })

  const visibleItems = useMemo(
    () => filterBySearch(draftItems, search),
    [draftItems, search],
  )

  const excludedIds = useMemo(
    () => new Set(draftItems.map((item) => item.id)),
    [draftItems],
  )

  const maxReached = draftItems.length >= maxItems

  // When searching, drag is disabled to avoid reordering a filtered subset.
  const dragDisabled =
    !allowEditing ||
    Boolean(search.trim()) ||
    saveDraftMutation.isPending ||
    publishMutation.isPending

  const handleAddProject = useCallback(
    (name: string) => {
      if (!allowEditing) return
      if (excludedIds.has(name)) {
        message.info('Already in the list')
        return
      }
      if (draftItems.length >= maxItems) {
        message.warning(
          `You can add at most ${maxItems} ${entityName.toLowerCase()}s`,
        )
        return
      }
      setDraftItems((prev) =>
        applySequentialOrder([
          ...prev,
          itemFromProjectName(name, prev.length + 1, displayField),
        ]),
      )
    },
    [
      allowEditing,
      displayField,
      draftItems.length,
      entityName,
      excludedIds,
      maxItems,
      message,
    ],
  )

  const handleRemove = useCallback((id: string) => {
    setDraftItems((prev) =>
      applySequentialOrder(prev.filter((item) => item.id !== id)),
    )
  }, [])

  const handleSaveDraft = () => {
    if (!isDirty) {
      message.info('No changes to save')
      return
    }
    saveDraftMutation.mutate(draftItems)
  }

  const handlePublish = () => {
    if (isDirty) {
      message.warning('Save your draft before publishing')
      return
    }
    publishMutation.mutate()
  }

  if (isLoading) {
    return (
      <div className={['pdl-root', props.className].filter(Boolean).join(' ')}>
        <LoadingState tip={`Loading ${entityName.toLowerCase()}…`} />
      </div>
    )
  }

  if (isError) {
    return (
      <div className={['pdl-root', props.className].filter(Boolean).join(' ')}>
        <Alert
          type="error"
          showIcon
          message={`Failed to load ${entityName}`}
          description={error instanceof Error ? error.message : 'Unknown error'}
          action={
            <button type="button" onClick={() => void refetch()}>
              Retry
            </button>
          }
        />
      </div>
    )
  }

  return (
    <div className={['pdl-root', props.className].filter(Boolean).join(' ')}>
      <Toolbar
        title={title}
        entityName={entityName}
        allowEditing={allowEditing}
        showSearch={showSearch}
        search={search}
        onSearchChange={setSearch}
        isDirty={isDirty}
        isSaving={saveDraftMutation.isPending}
        isPublishing={publishMutation.isPending}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        disableActions={isFetching}
        itemCount={draftItems.length}
        maxItems={maxItems}
      />

      {showProjectSelect && allowEditing ? (
        <ProjectSelect
          options={projectNamesQuery.data ?? EMPTY_PROJECT_OPTIONS}
          excludedIds={excludedIds}
          loading={projectNamesQuery.isLoading || projectNamesQuery.isFetching}
          disabled={
            saveDraftMutation.isPending || publishMutation.isPending
          }
          maxReached={maxReached}
          maxItems={maxItems}
          itemCount={draftItems.length}
          entityName={entityName}
          onAdd={handleAddProject}
        />
      ) : null}

      {projectNamesQuery.isError && showProjectSelect ? (
        <Alert
          className="pdl-project-error"
          type="warning"
          showIcon
          message="Could not load projects from the backend"
          description={
            projectNamesQuery.error instanceof Error
              ? projectNamesQuery.error.message
              : 'Check auth / API base URL'
          }
        />
      ) : null}

      {visibleItems.length === 0 ? (
        <EmptyState message={emptyMessage} />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={collisionDetection}
          measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
          autoScroll
        >
          <SortableContext
            items={itemIds as UniqueIdentifier[]}
            strategy={verticalListSortingStrategy}
            disabled={dragDisabled}
          >
            <ul className="pdl-list" aria-label={`${entityName} order`}>
              {visibleItems.map((item) => (
                <SortableItem
                  key={item.id}
                  item={item}
                  disabled={dragDisabled}
                  showImages={showImages}
                  onRemove={
                    allowEditing &&
                    !saveDraftMutation.isPending &&
                    !publishMutation.isPending
                      ? handleRemove
                      : undefined
                  }
                />
              ))}
            </ul>
          </SortableContext>

          <DragOverlay
            dropAnimation={{
              duration: 200,
              easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
            }}
          >
            {activeItem ? (
              <div className="pdl-overlay">
                <SortableItem
                  item={activeItem}
                  disabled
                  showImages={showImages}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {search.trim() && allowEditing ? (
        <p className="pdl-hint">Clear search to reorder items.</p>
      ) : null}
    </div>
  )
}

export default DragDropList
