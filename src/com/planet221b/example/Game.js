/**
 * Created by sargis on 7/4/17.
 */
import 'pixi'
import Phaser from 'phaser'
import config from './config'
import {Facade} from 'pure-mvc'
import GameFacade from './GameFacade'
import GameState from './state/GameState'
import 'babel-polyfill'

export default class Game extends Phaser.Game {
  // STATES
  static STATE_GAME = 'Game'

  constructor () {
    super(config.gameWidth, config.gameHeight, Phaser.CANVAS, '', null)
    this.state.add(Game.STATE_GAME, new GameState())
    Facade.getInstance = GameFacade.getInstance
  }

  init () {
    this.state.start(Game.STATE_GAME)
  }
}

window.game = new Game()
window.game.init()
