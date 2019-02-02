/**
 * Created by sargis on 7/8/17.
 */
import BoardView from '../view/component/BoardView'
import BoardProxy from '../model/BoardProxy'
import {SimpleCommand} from 'pure-mvc'

export default class BoardCommand extends SimpleCommand {
  execute (notificationName, ...args) {
    switch (notificationName) {
      case BoardView.CELL_CLICK:
        this.proxy.selectCell(args[0])
        break
      case BoardView.PLAYER_SELECT:
        this.proxy.detectPossibleMoves()
        break
    }
  }

  get proxy () {
    return this.facade.retrieveProxy(BoardProxy.NAME)
  }
}
