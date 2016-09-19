/**
 * Created by macdja38 on 2016-09-18.
 */

import Adapter from "./Adapter";
import Discord from "eris";

export default class ErisAdapter extends Adapter {
  constructor({configJSON, adapterSettings}) {
    super();
    //noinspection JSUnresolvedVariable
    this._configJSON = configJSON;
    this._adapterSettings = adapterSettings;
    this._client = new Discord(this._adapterSettings.auth.token);
  }

  static get name() {
    return "eris";
  }

  login() {
    console.log(this._configJSON);
    this._client.connect();
    this.startEvents();
  }

  startEvents() {
    this._client.on("ready", () => {
      /* eslint-disable */
      console.log(`Connected as: ${this._client.user.username}`);
      /* eslint-enable */
    });

    this._client.on("messageCreate", message => {
      console.log(`eris ${this._client.user.username} ${message.author.username} ${message.content}`);
    });
  }
}