/**
 * Created by sargis on 7/6/17.
 */

import Phaser from 'phaser'
import GameFacade from '../GameFacade'
import ProgressView from '../view/component/ProgressView'
import {Facade} from 'pure-mvc'

export default class GameState extends Phaser.State {
  static NAME = 'GameState'
  static READY = GameState.NAME + 'Ready'

  init (...args) {
    this.game.renderer.renderSession.roundPixels = true
    this.scale.pageAlignHorizontally = true
    this.scale.pageAlignVertically = true
    this.facade = Facade.getInstance(GameFacade.KEY)
    this.facade.startup(this)
  }

  preload () {
    this.load.onLoadStart.addOnce(this.onLoadStart, this)
    this.load.onFileComplete.add(this.onFileComplete, this)
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this)
    this.load.pack('initial', 'assets/assets.json')
    this.load.start()
  }

  onLoadStart () {
    this.facade.sendNotification(ProgressView.SHOW)
  }

  onFileComplete (progress, cacheKey, success, totalLoaded, totalFiles) {
    console.log(
      'File Complete: ' +
        progress +
        '% - ' +
        totalLoaded +
        ' out of ' +
        totalFiles
    )
    this.facade.sendNotification(ProgressView.UPDATE, progress)
  }

  onLoadComplete () {
    this.facade.sendNotification(ProgressView.HIDE)
  }

  create () {
    this.facade.sendNotification(GameState.READY)
  }
}
