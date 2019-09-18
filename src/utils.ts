import { CellLocation, CellCoordinates } from './types'

/**
 * Get the location of a cell in a square grid,
 * where the grid is simply an array of all cells.
 */

export const getCellLocation = (
  cellIndex: number,
  totalCells: number,
): CellLocation => {
  const sqrt = Math.sqrt(totalCells)
  if (!Number.isInteger(sqrt))
    throw new Error(
      `An array of ${totalCells} items cannot be turned into a square grid`,
    )
  const row = Math.floor(cellIndex / sqrt)
  const column = cellIndex % sqrt
  const region = Math.floor(row / 3) * 3 + Math.floor(column / 3)

  return {
    row,
    column,
    region,
  }
}

export const getCellIndex = (
  cell: CellCoordinates,
  totalCells: number,
): number => {
  const sqrt = Math.sqrt(totalCells)
  if (!Number.isInteger(sqrt))
    throw new Error(
      `An array of ${totalCells} items cannot be turned into a square grid`,
    )

  return cell.column + (cell.row - 1) * sqrt
}

/* Split an array into groups of N length */
export const chunkArray = <InputType>(
  groupSize: number,
  arr: InputType[],
): InputType[][] => {
  /* Get the first N Items */
  const firstGroup = arr.slice(0, groupSize)
  /* Get the rest of the items */
  const remainderGroups =
    arr.length > groupSize
      ? /* if there are more items in the arrray to group,
         * get them with slice, and group them with another call
         * to sliceGroup */
        chunkArray(groupSize, arr.slice(groupSize))
      : /* otherwise, just an empty array */
        []
  return [firstGroup, ...remainderGroups]
}

export const groupArrayByEvery = <InputType>(
  length: number,
  arr: InputType[],
): InputType[][] => {
  const grouped = arr.reduce((acc, current, index) => {
    const groupIndex = index % length
    return [
      ...acc.slice(0, groupIndex),
      [...acc[groupIndex], current],
      ...acc.slice(groupIndex + 1),
    ]
  }, new Array(length).fill([]))
  return grouped
}

export const groupArrayByRegion = <T>(size: number, arr: T[]): T[][] => {
  if (arr.length % (size * size) !== 0)
    throw new Error(
      `An array of ${arr.length} items cannot be grouped into regions of ${size} x ${size}`,
    )

  return arr.reduce((acc, current, index) => {
    const { row, column } = getCellLocation(index, arr.length)
    const cellIndex = Math.floor(row / size) * 3 + Math.floor(column / size)
    return [
      ...acc.slice(0, cellIndex),
      [...acc[cellIndex], current],
      ...acc.slice(cellIndex + 1),
    ]
  }, new Array(size * size).fill([]))
}

export const flattenArray = <T>(arr: Array<T[]>): T[] =>
  arr.reduce<T[]>((acc, current) => {
    return [...acc, ...current]
  }, [])
