/**
 * Created by sargis on 7/6/17.
 */
import BoardProxy from '../model/BoardProxy'
import BoardView from '../view/component/BoardView'
import {SimpleCommand} from 'pure-mvc'

export default class DataCommand extends SimpleCommand {
  execute (notificationName, ...args) {
    switch (notificationName) {
      case BoardView.DATA_GET:
        this.proxy.jsonDataGet()
        break
    }
  }

  get proxy () {
    return this.facade.retrieveProxy(BoardProxy.NAME)
  }
}
