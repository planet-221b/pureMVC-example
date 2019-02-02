/**
 * Created by sargis on 7/4/17.
 */
import BoardVO from './vo/BoardVO'
import BoardView from '../view/component/BoardView'
import { Proxy } from 'pure-mvc'

export default class BoardProxy extends Proxy {
  static NAME = 'BoardProxy'

  static DUPLICATE_MOVES = [
    [-1, 0],
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 1],
    [1, -1],
    [-1, -1],
    [1, 1]
  ]

  static JUMP_MOVES = [
    [-2, 0],
    [0, -2],
    [2, 0],
    [0, 2]
  ]

  constructor () {
    super(BoardProxy.NAME, new BoardVO())
    this.load = window.game.load
    this.cache = window.game.cache
  }

  jsonDataGet () {
    this.load.onLoadStart.addOnce(this.onLoadStart, this)
    this.load.onFileComplete.add(this.onFileComplete, this)
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this)
    this.load.json('board', 'assets/json/board.json')
    this.load.start()
  }

  onLoadStart () {
  }

  onFileComplete (progress, cacheKey, success, totalLoaded, totalFiles) {
  }

  onLoadComplete () {
    const board = this.cache.getJSON('board')
    this.vo.width = board.width
    this.vo.height = board.height
    this.vo.player1 = board.player1
    this.vo.player2 = board.player2
    this.vo.obstacles = board.obstacles
    this.vo.cells = []
    this.initCells()
    this.initPlayer(this.vo.player1, BoardView.CEll_PLAYER_1)
    this.initPlayer(this.vo.player2, BoardView.CEll_PLAYER_2)
    this.initObstacles(this.vo.obstacles)
    this.sendNotification(BoardView.DATA_READY, this.vo)
  }

  selectCell (position) {
    if (this.selectedPlayer) {
      this.sendNotification(BoardView.PLAYER_DESELECT)
      this.selectedPlayer = null
    }
    this.checkPlayerSelect(position, this.vo.player1, 1)
    this.checkPlayerSelect(position, this.vo.player2, 2)
  }

  detectPossibleMoves () {
    if (!this.selectedPlayer) {
      return
    }
    const duplicateMoves = []
    const jumpMoves = []
    this.findMoves(BoardProxy.DUPLICATE_MOVES, duplicateMoves)
    this.findMoves(BoardProxy.JUMP_MOVES, jumpMoves)
    this.sendNotification(BoardView.POSSIBLE_MOVES_READY, {duplicateMoves, jumpMoves})
  }

  findMoves (movePatterns, moves) {
    const playerX = this.selectedPlayer[0]
    const playerY = this.selectedPlayer[1]
    movePatterns.forEach(move => {
      const dX = playerX + move[0]
      const dY = playerY + move[1]
      if (dX >= 0 && dX < this.vo.width && dY >= 0 && dX < this.vo.height) {
        const cell = this.vo.cells[dX][dY]
        if (cell === BoardView.CEll_EMPTY) {
          moves.push({i: dX, j: dY})
        }
      }
    })
  }

  get vo () {
    return this.getData()
  }

  checkPlayerSelect (position, player, id) {
    for (let i = 0; i < player.length; ++i) {
      const playerPosition = player[i]
      if (playerPosition[0] === position.i && playerPosition[1] === position.j) {
        this.selectedPlayer = player[i]
        this.sendNotification(BoardView.PLAYER_SELECT, position)
        return
      }
    }
  }

  initCells () {
    for (let i = 0; i < this.vo.width; ++i) {
      const col = []
      this.vo.cells.push(col)
      for (let j = 0; j < this.vo.height; ++j) {
        col.push(BoardView.CEll_EMPTY)
      }
    }
  }

  initPlayer (player, id) {
    for (let i = 0; i < player.length; ++i) {
      const position = player[i]
      const col = position[0]
      const row = position[1]
      this.vo.cells[col][row] = id
    }
  }

  initObstacles (obstacles) {
    for (let i = 0; i < obstacles.length; ++i) {
      const position = obstacles[i]
      const col = position[0]
      const row = position[1]
      this.vo.cells[col][row] = BoardView.CEll_OBSTACLE
    }
  }
}
