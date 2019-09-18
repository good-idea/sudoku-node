import { RawBoard } from './types'

import { BLANK } from './constants'

const _ = BLANK

export const easyBoard: RawBoard = [
  [_, 1, 7, 9, _, 2, 4, _, _],
  [_, _, 2, _, 7, 4, 1, 5, _],
  [3, 9, _, _, _, 8, 7, 2, _],
  [_, 8, _, 2, 9, _, _, 3, 7],
  [_, 5, 9, 6, _, _, _, 4, 1],
  [7, _, 6, 8, 4, _, _, _, 5],
  [1, 7, _, _, 8, _, 9, _, 2],
  [9, _, 3, _, 2, 6, 5, _, _],
  [6, _, _, 5, _, 9, _, 7, 4],
]

export const mediumBoard: RawBoard = [
  [1, _, _, 6, 7, _, _, _, 5],
  [6, _, _, _, _, _, _, 4, _],
  [_, _, 5, 4, 8, 9, 1, _, 2],
  [_, _, _, 8, _, 5, _, 1, 3],
  [_, 2, _, _, 1, _, _, 9, _],
  [5, 9, _, 3, _, 6, _, _, _],
  [9, _, 8, 5, 6, 7, 3, _, _],
  [_, 3, _, _, _, _, _, _, 8],
  [2, _, _, _, 3, 8, _, _, 1],
]

export const hardBoard: RawBoard = [
  [_, _, _, _, _, _, _, _, _],
  [_, _, _, _, 9, _, _, _, 8],
  [_, 4, _, _, _, 5, 3, _, 7],
  [_, 8, _, _, 6, 1, _, 7, 4],
  [_, 9, _, _, _, _, 5, _, _],
  [_, 1, 7, _, _, _, _, _, 6],
  [2, _, _, 6, _, _, 4, 8, _],
  [_, _, _, 9, 1, _, 2, _, _],
  [8, 3, 9, _, 2, _, _, _, _],
]

export const getBoard = (difficulty: string) => {
  switch (difficulty) {
    case 'easy':
      return easyBoard
    case 'medium':
      return mediumBoard
    case 'hard':
      return hardBoard
    default:
      throw new Error(`There is no board for difficulty "${difficulty}"`)
  }
}
