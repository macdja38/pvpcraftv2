/**
 * Created by macdja38 on 2016-09-18.
 */

import Adapter from "./Adapter";
import Discordie from "discordie";

export default class DiscordieAdapter extends Adapter {
  constructor({configJSON, adapterSettings}) {
    super();
    //noinspection JSUnresolvedVariable
    this._configJSON = configJSON;
    this._adapterSettings = adapterSettings;
    this._client = new Discordie();
  }

  static get name() {
    return "discordie";
  }

  login() {
    console.log(this._configJSON);
    this._client.connect({
      token: this._adapterSettings.auth.token,
      reconnect: true
    });
    this.startEvents();
  }

  startEvents() {
    this._client.Dispatcher.on("GATEWAY_READY", () => {
      /* eslint-disable */
      console.log(`Connected as: ${this._client.User.username}`);
      /* eslint-enable */
    });

    this._client.Dispatcher.on("MESSAGE_CREATE", e => {
      console.log(`discordie ${this._client.User.username} ${e.message.author.username} ${e.message.content}`);
    });

    this._client.Dispatcher.on("GUILD_ROLE_UPDATE", e => {
      console.log(e); //eslint-disable-line no-console
      const data = e.getChanges();
      console.log(data.before); //eslint-disable-line no-console
      console.log(data.after); //eslint-disable-line no-console
    });
  }
}