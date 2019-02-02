/**
 * Created by sargis on 7/4/17.
 */
import { Mediator } from "pure-mvc";
import GameState from "../state/GameState";
import BoardView from "./component/BoardView";
import BoardViewMediator from "./component/BoardViewMediator";
import ProgressViewMediator from "./component/ProgressViewMediator";

export default class GameMediator extends Mediator {
  static NAME = "ApplicationMediator";

  constructor(viewComponent) {
    super(GameMediator.NAME, window.game.world);
  }

  onRegister() {
    this.wake();
    this.facade.registerMediator(new ProgressViewMediator(this.viewComponent));
  }

  registerNotificationInterests() {
    this.subscribeToNotifications(GameState.READY);
  }

  handleNotification(notificationName, ...args) {
    switch (notificationName) {
      case GameState.READY:
        this.facade.registerMediator(new BoardViewMediator(this.viewComponent));
        this.facade.sendNotification(BoardView.DATA_GET);
        break;
    }
  }
}
