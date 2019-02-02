/**
 * Created by sargis on 7/4/17.
 */
import { Facade } from "pure-mvc";
import ArrayMode1Command from "./controller/ArrayMode1Command";
import ArrayMode2Command from "./controller/ArrayMode2Command";
import BoardCommand from "./controller/BoardCommand";
import DataCommand from "./controller/DataCommand";
import StartupCommand from "./controller/StartupCommand";
import BoardView from "./view/component/BoardView";

export default class GameFacade extends Facade {
  static KEY = "Example";
  static NAME = "ExampleFacade";
  static STARTUP = GameFacade.NAME + "StartUp";
  static ARRAY_MODE_TEST = GameFacade.NAME + "ArrayModeTest";

  static getInstance(key) {
    console.log(Facade.instanceMap);
    if (!Facade.instanceMap[key]) {
      Facade.instanceMap[key] = new GameFacade(key);
    }
    return Facade.instanceMap[key];
  }

  initializeController() {
    super.initializeController();
    this.registerCommand(GameFacade.STARTUP, StartupCommand);
    this.registerCommand(BoardView.DATA_GET, DataCommand);
    this.registerCommand(BoardView.CELL_CLICK, BoardCommand);
    this.registerCommand(GameFacade.ARRAY_MODE_TEST, ArrayMode1Command);
    this.registerCommand(GameFacade.ARRAY_MODE_TEST, ArrayMode2Command);
  }

  startup(game) {
    this.sendNotification(GameFacade.STARTUP, game);
    this.sendNotification(GameFacade.ARRAY_MODE_TEST);
    // this.removeCommand(GameFacade.ARRAY_MODE_TEST, ArrayMode2Command);
    // this.removeCommands(GameFacade.ARRAY_MODE_TEST)
    // this.sendNotification(GameFacade.ARRAY_MODE_TEST);
  }

  sendNotification(notificationName, ...args) {
    console.log("Sent " + notificationName);
    super.sendNotification(notificationName, ...args);
  }
}
