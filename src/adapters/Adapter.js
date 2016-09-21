/**
 * Created by macdja38 on 2016-09-18.
 */

export default class Adapter {
  constructor() {
  }

  register(commandHandler) {
    this._commandHandler = commandHandler;
  }
}