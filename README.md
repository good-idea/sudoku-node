# Sudoku Node

A sudoku puzzle game for the command line.

## Features

- Select from 3 boards: easy, medium, hard
- Highlighting of complete & invalid rows, columns, and regions

### Coming soon

- Bundled lib with a CLI (e.g. `sudoku play hard`)
- Arrow-key navigation & input (instead of typing each command)
- More boards
- Congratulations when the board is complete
- Undo
- Save your progress
- Tests
- Better instructions & messaging

## Playing

Set up with: `npm install`

To play: `npm run play`

### Commands

To add or update a numbers:

- command: `add <column><row> <value>`
- example: `add b2 9`
- shorthand: `a b2 9`

Removing numbers:

- command: `remove <column><row>`
- example: `remove c3`
- shorthand: `r c3`

View the initial instructions:

- command: `help`
- shorthand: `h`

## Development

For local development: `npm run watch`


