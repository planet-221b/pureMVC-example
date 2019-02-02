/**
 * Created by sargis on 7/8/17.
 */
import { SimpleCommand } from "pure-mvc";
import BoardProxy from "../model/BoardProxy";

export default class ArrayMode2Command extends SimpleCommand {
  execute(notificationName, ...args) {
    console.warn("ArrayMode2");
  }

  get proxy() {
    return this.facade.retrieveProxy(BoardProxy.NAME);
  }
}
