/**
 * Created by sargis on 7/5/17.
 */
import { Mediator } from "pure-mvc";
import ProgressView from "./ProgressView";

export default class ProgressViewMediator extends Mediator {
  static NAME = "ProgressViewMediator";

  constructor(viewComponent) {
    super(ProgressViewMediator.NAME, viewComponent);
  }

  onRegister() {
    this.wake();
    this.progressView = new ProgressView();
    this.viewComponent.add(this.progressView);
    // this.sendNotification(URLsView.DATA_GET)
  }

  registerNotificationInterests() {
    this.subscribeToNotifications(
      ProgressView.SHOW,
      ProgressView.HIDE,
      ProgressView.UPDATE
    );
  }

  handleNotification(notificationName, ...args) {
    // const name = notification.getName()
    // const body = notification.getBody()

    switch (notificationName) {
      case ProgressView.SHOW:
        this.progressView.show();
        break;
      case ProgressView.HIDE:
        this.progressView.hide();
        break;
      case ProgressView.UPDATE:
        this.progressView.updatePercent(args[0]);
        break;
    }
  }
}
