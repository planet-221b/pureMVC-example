/**
 * Created by sargis on 7/4/17.
 */
import GameMediator from '../view/GameMediator'
import BoardProxy from '../model/BoardProxy'
import {SimpleCommand} from 'pure-mvc'

export default class StartupCommand extends SimpleCommand {
  execute (notificationName, ...args) {
    this.facade.registerProxy(new BoardProxy())
    this.facade.registerMediator(new GameMediator())
  }
}
