/**
 * Created by macdja38 on 2016-08-07.
 */
import "source-map-support/register";

export default class pvpcraft {
  constructor() {
    this.count = 0;
  }

  inc() {
    return this.count++;
  }

  command(command) {
    command.sendMessage(this.inc);
  }
}