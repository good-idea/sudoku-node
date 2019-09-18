import {
  BLANK,
  HELP,
  ADD,
  REMOVE,
  BADMOVE,
  VALID,
  INVALID,
  COMPLETE,
} from './constants'

export type Blank = typeof BLANK

export interface CellCoordinates {
  column: number
  row: number
}

export interface CellLocation extends CellCoordinates {
  region: number
}

export type CellValue = number | Blank

export interface CellDetails {
  value: CellValue
  cellStatus: CellStatus
  locked: boolean
}

/* An array of nine Cells */
// export type Nine = [Cell, CellValue, Cell, Cell, Cell, Cell, Cell, Cell, Cell]
export type Nine = CellValue[]

/* An array of 81 Cells */
export type Board = CellValue[]

/* The status of a Nine */
export type ValidationStatus = typeof VALID | typeof INVALID | typeof COMPLETE
export type NineStatus = ValidationStatus
export type CellStatus = ValidationStatus

export interface BoardStatus {
  rows: NineStatus[]
  columns: NineStatus[]
  regions: NineStatus[]
}

/* An array of nine arrays of digits or blank spaces */
export type RawBoard = Array<Array<number | Blank>>

/* The result of a legal move */
export interface MoveResult {
  newBoard: Board
  message: string
}

/* Moves a user can make */
export type MoveType = typeof HELP | typeof ADD | typeof REMOVE | typeof BADMOVE

interface MoveBase {
  input: string
}

interface Add extends MoveBase {
  type: typeof ADD
  cell: CellCoordinates
  value: number
  message: string
}

interface Remove extends MoveBase {
  type: typeof REMOVE
  cell: CellCoordinates
  message: string
}

interface BadMove extends MoveBase {
  type: typeof BADMOVE
  message: string
}

interface HelpMove extends MoveBase {
  type: typeof HELP
}

export type Move = Add | Remove | BadMove | HelpMove
