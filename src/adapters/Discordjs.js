/**
 * Created by macdja38 on 2016-09-18.
 */

import Adapter from "./Adapter";
import Discord from "discord.js";

export default class DiscordjsAdapter extends Adapter {
  constructor({configJSON, adapterSettings}) {
    super();
    //noinspection JSUnresolvedVariable
    this._configJSON = configJSON;
    this._adapterSettings = adapterSettings;
    this._client = new Discord.Client();
  }

  static get name() {
    return "discordjs";
  }

  login() {
    console.log(this._configJSON);
    this._client.login(this._adapterSettings.auth.token);
    this.startEvents();
  }

  startEvents() {
    this._client.on("ready", () => {
      /* eslint-disable */
      console.log(`Connected as: ${this._client.user.username}`);
      /* eslint-enable */
    });

    this._client.on("message", message => {
      console.log(`discordjs ${this._client.user.username} ${message.author.username} ${message.content}`);
    });
  }
}