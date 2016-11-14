/**
 * Created by macdja38 on 2016-11-13.
 */

export class Command {
  constructor(...args) {
    let options = args.pop();
    this.aliases = options.aliases;
  }
}

export default Command;