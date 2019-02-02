/**
 * Created by sargis on 7/5/17.
 */
import Phaser from 'phaser'

export default class ProgressView extends Phaser.Group {
  static NAME = 'ProgressView'
  static SHOW = ProgressView.NAME + 'Show'
  static HIDE = ProgressView.NAME + 'Hide'
  static UPDATE = ProgressView.NAME + 'Update'

  constructor () {
    super(window.game)
    this.init()
  }

  init () {
    const style = {font: '65px Arial', fill: '#ffffff', align: 'center'}
    this.textField = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'Please wait...', style)
    this.textField.anchor.set(0.5)
  }

  show () {
    this.textField.text = 'Please wait...'
    this.textField.alpha = 0
    this.add(this.textField)
    let tween = this.game.add.tween(this.textField)
    tween.to({alpha: 1}, 500)
    tween.start()
  }

  hide () {
    this.add(this.textField)
    let tween = this.game.add.tween(this.textField)
    tween.to({alpha: 0}, 500)
    tween.start()
  }

  updatePercent (percent) {
    this.textField.text = 'Loaded ' + percent + '%'
  }
}
