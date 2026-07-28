/**
 * Normalization helpers — map arbitrary API rows into NormalizedItem.
 */

import { getRecordField, getRecordId } from '@/services/api'
import type { NormalizedItem, OrderedRecord } from '@/types/dragDrop'

export function normalizeItems(
  records: OrderedRecord[],
  displayField: string,
  orderField: string,
  pageSize: number,
): NormalizedItem[] {
  const mapped: NormalizedItem[] = []

  records.forEach((raw, index) => {
    const id = getRecordId(raw)
    if (!id) return

    const labelValue = getRecordField(raw, displayField)
    const orderValue = getRecordField(raw, orderField)
    const imageValue = getRecordField(raw, 'image')

    const order =
      typeof orderValue === 'number'
        ? orderValue
        : Number(orderValue) || index + 1

    mapped.push({
      id,
      raw,
      label:
        labelValue == null || labelValue === '' ? id : String(labelValue),
      order,
      image:
        typeof imageValue === 'string' && imageValue.length > 0
          ? imageValue
          : null,
    })
  })

  mapped.sort((a, b) => a.order - b.order)

  const sliced = pageSize > 0 ? mapped.slice(0, pageSize) : mapped

  return sliced.map((item, index) => ({
    ...item,
    order: index + 1,
  }))
}

export function applySequentialOrder(items: NormalizedItem[]): NormalizedItem[] {
  return items.map((item, index) => ({
    ...item,
    order: index + 1,
    raw: {
      ...item.raw,
      display_order: index + 1,
    },
  }))
}

/** Build a list row from an NS Project / building name. */
export function itemFromProjectName(
  name: string,
  order: number,
  displayField: string,
): NormalizedItem {
  const raw: OrderedRecord = {
    name,
    [displayField]: name,
    display_order: order,
    image: null,
  }
  return {
    id: name,
    raw,
    label: name,
    order,
    image: null,
  }
}

export function filterBySearch(
  items: NormalizedItem[],
  search: string,
): NormalizedItem[] {
  const q = search.trim().toLowerCase()
  if (!q) return items
  return items.filter(
    (item) =>
      item.label.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q),
  )
}

export function isSameOrder(a: NormalizedItem[], b: NormalizedItem[]): boolean {
  if (a.length !== b.length) return false
  return a.every((item, index) => item.id === b[index]?.id)
}
