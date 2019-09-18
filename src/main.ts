import {
  Blank,
  Board,
  BoardStatus,
  RawBoard,
  CellValue,
  CellDetails,
  CellStatus,
  CellCoordinates,
  MoveType,
  Move,
  MoveResult,
  Nine,
  NineStatus,
} from './types'
import {
  ADD,
  REMOVE,
  HELP,
  BADMOVE,
  BLANK,
  VALID,
  INVALID,
  COMPLETE,
} from './constants'
import {
  getCellLocation,
  getCellIndex,
  groupArrayByEvery,
  groupArrayByRegion,
  flattenArray,
  chunkArray,
} from './utils'
import { getBoard } from './boards'
import * as inquirer from 'inquirer'
import chalk from 'chalk'

const { log } = console
const colorPrint = (color: string) => (text: string) => log(chalk[color](text))
const gray = colorPrint('gray')

/**
 * Board Validation
 */

const columnHeaders = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']

const oneToNine = [1, 2, 3, 4, 5, 6, 7, 8, 9]

/**
 * getNineStatus
 * @param {Nine} nine
 * @return {Nine}
 *
 * based on the 9 digits of a Nine, returns a status
 */
const validateNine = (nine: Nine): NineStatus => {
  /* Are there any duplicates? */
  if (nine.length !== 9)
    throw new Error(
      'getNineStatus was called with an array that does not include 9 items',
    )
  const noDuplicates: boolean = nine.reduce<boolean>(
    (acc, cell, _, fullNineArray) => {
      if (acc === false) return false // If it's already invalid, don't bother with the rest
      if (cell === BLANK) return true // Don't validate empty cells
      // Make sure there is only one instance of the value
      return fullNineArray.filter(d => d === cell).length === 1
    },
    true,
  )
  if (!noDuplicates) return INVALID

  /* Does it include all digits, 1-9? */
  const isComplete = oneToNine.reduce<boolean>((acc, digitToCheckFor) => {
    if (acc === false) return false // If it's already invalid, don't bother with the rest

    /* return true if the array contains the digit */
    return nine.some(cell => cell === digitToCheckFor)
  }, true)
  if (isComplete) return COMPLETE /* yay */

  return VALID
}

const getBestStatus = (statuses: CellStatus[]): CellStatus => {
  /* Always show invalid if any aspects are invalid */
  if (statuses.includes(INVALID)) return INVALID
  /* If any aspects are complete, mark it as a complete cell */
  if (statuses.includes(COMPLETE)) return COMPLETE
  /* Otherwise, it's valid but not complete */
  return VALID
}

const getCellDetailsFromBoard = (
  board: Board,
  originalBoard: Board,
  boardStatus: BoardStatus,
) => (value: CellValue, index: number): CellDetails => {
  /* Locked cells are those that are part of the original puzzle */
  const locked = value !== BLANK && originalBoard[index] === value
  const { row, column, region } = getCellLocation(index, board.length)
  const rowStatus = boardStatus.rows[row]
  const columnStatus = boardStatus.columns[column]
  const regionStatus = boardStatus.regions[region]
  const cellStatus = getBestStatus([rowStatus, columnStatus, regionStatus])

  return {
    value,
    cellStatus,
    locked,
  }
}

const getBoardStatus = (board: Board): BoardStatus => ({
  rows: boardToRows(board).map(validateNine),
  columns: boardToColumns(board).map(validateNine),
  regions: boardToRegions(board).map(validateNine),
})

/**
 * Parsing
 */

/* Convert a "raw board" to an array of cells */
const rawBoardToBoard = (rawBoard: RawBoard): Board => flattenArray(rawBoard)

const boardToRows = (board: Board): Array<Nine> =>
  chunkArray(9, board) as Array<Nine>

const boardToColumns = (board: Board): Array<Nine> =>
  groupArrayByEvery(9, board) as Array<Nine>

const boardToRegions = (board: Board): Array<Nine> =>
  groupArrayByRegion(3, board) as Array<Nine>

/**
 * Printing
 */

const cols = '    A  B  C   D  E  F   G  H  I '
const rule = '  |-----------------------------|'

const isDivider = (index: number) => index === 2 || index === 5

const printLine = (row: CellDetails[], rowIndex: number): void => {
  const printable = row.reduce((acc, cell, cellIndex) => {
    const { locked, cellStatus, value } = cell
    const charChalk =
      value === BLANK
        ? chalk.white
        : cellStatus === COMPLETE
        ? chalk.green
        : cellStatus === INVALID
        ? chalk.red
        : locked
        ? chalk.blue
        : chalk.white

    return (
      acc +
      ' ' +
      charChalk(`${value}`) +
      ' ' +
      (isDivider(cellIndex) ? chalk.gray('|') : '')
    )
  }, chalk.gray(`${rowIndex + 1} |`))
  log(printable + chalk.gray('|'))
}

const printBoard = (board: CellDetails[]): void => {
  gray(cols)
  gray(rule)
  const rows = chunkArray(9, board)
  rows.forEach((row, index) => {
    printLine(row, index)
    if (isDivider(index)) gray(rule)
  })
  gray(rule)
}

/**
 * Gameplay - Parsing Input
 */

/* Get the type of move based on the first character */
const getMoveType = (opString: string): MoveType => {
  const op = opString.toLowerCase()
  if (op.startsWith('h')) return HELP
  if (op.startsWith('a')) return ADD
  if (op.startsWith('r')) return REMOVE
  return BADMOVE
}

/* parse a location such as 'a1' to 1,1 */
const parseCellLocation = (coordString: string): CellCoordinates => {
  const [colChar, rowChar] = coordString.split('')
  /* Get the column # from the letter */
  const column = columnHeaders.findIndex(h => colChar.toUpperCase() === h)
  const row = parseInt(rowChar, 10)
  return {
    row,
    column,
  }
}

const getUserMove = async (): Promise<Move> => {
  const prompt = await inquirer.prompt({
    type: 'input',
    name: 'input',
    message: `Make a move!
`,
  })

  const { input } = prompt
  const [op, coords, value] = input.split(' ') // => [op, location, value?]
  const type = getMoveType(op)

  if (type === HELP) {
    return {
      input,
      type,
    }
  }

  if (type === BADMOVE) {
    return {
      input,
      type,
      message: `"${input}" is not a valid move`,
    }
  }

  // TODO: add a more specific validation error here
  if (!/^[a-iA-I][1-9]$/.test(coords)) {
    return {
      input,
      type: BADMOVE,
      message: `"${coords}" is not a valid coordinate`,
    }
  }
  const cell = parseCellLocation(coords)

  if (type === REMOVE) {
    return {
      input,
      type,
      cell,
      message: `Removed entry from ${coords}`,
    }
  }

  // TODO: add a more specific validation error here
  if (!/^\d$/.test(value) || value === 0) {
    return {
      input,
      type: BADMOVE,
      message: `"${value}" is not a valid value. Values must be 1-9`,
    }
  }

  if (type === ADD) {
    return {
      input,
      type,
      cell,
      value: parseInt(value, 10),
      message: `Updated ${value} to ${coords}`,
    }
  }

  return {
    type,
    input,
  }
}

/**
 * Gameplay - Game Logic
 */

const instructions = `
- - Instructions  - - - - - - - - - - - - - - - - - 

To add or update, type: a <column><row> <value>
               example: a c2 9
       To remove, type: r <column><row>
               example: r d6

To see these instructions again, enter "h" or "help"

- - - - - - - - - - - - - - - - - - - - - - - - - - 
`

const applyMove = (
  board: Board,
  initialBoard: Board,
  move: Move,
): MoveResult => {
  if (move.type === BADMOVE) {
    return {
      newBoard: board,
      message: `"${move.input}" is not a valid move. Type "h" to view the instructions`,
    }
  }

  if (move.type === HELP) {
    return {
      newBoard: board,
      message: chalk.blue(instructions),
    }
  }

  const inputIndex = getCellIndex(move.cell, board.length)

  if (initialBoard[inputIndex] !== BLANK) {
    return {
      newBoard: board,
      message: chalk.red(
        'You cannot change this cell, it is part of the original puzzle.',
      ),
    }
  }
  const newValue = move.type === ADD ? move.value : (BLANK as Blank)
  const newBoard = [
    ...board.slice(0, inputIndex),
    newValue,
    ...board.slice(inputIndex + 1),
  ]

  return {
    newBoard,
    message: `made move: ${move.input}`,
  }
}

/**
 * Gameplay - Main
 */

const startGame = (initialBoard: Board) => {
  const play = async (board: Board) => {
    const boardStatus = getBoardStatus(board)

    const getCellDetails = getCellDetailsFromBoard(
      board,
      initialBoard,
      boardStatus,
    )
    const printableBoard = board.map(getCellDetails)
    printBoard(printableBoard)
    const move = await getUserMove()
    const { newBoard, message } = applyMove(board, initialBoard, move)
    log(message)
    play(newBoard)
  }

  play(initialBoard)
}

const init = async () => {
  log(chalk.blue('Welcome to Sudoku-Node!'))
  log(chalk.blue(instructions))

  const input = await inquirer.prompt({
    type: 'list',
    message: 'Select your difficulty',
    name: 'difficulty',
    choices: ['easy', 'medium', 'hard'],
  })
  const board = getBoard(input.difficulty)
  startGame(rawBoardToBoard(board))
}

init()
