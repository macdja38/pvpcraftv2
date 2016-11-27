/**
 * Created by macdja38 on 2016-09-18.
 */

"use strict";
import "babel-core/register";
import "source-map-support/register";

import Adapter from "./Adapter";
import Discordie from "discordie";
import Message from "../events/Message";
import Guild from "../events/Guild";
import User from "../events/User";

export default class DiscordieAdapter extends Adapter {
  constructor({configJSON, adapterSettings}) {
    super();
    //noinspection JSUnresolvedVariable
    this._configJSON = configJSON;
    this._adapterSettings = adapterSettings;
    this._client = new Discordie();
  }

  get adapter() {
    return "discordie"
  }

  static get name() {
    return "discordie";
  }

  async login() {
    await this._client.connect({
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
      this._commandHandler.onMessage(new DiscordieMessage(e));
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

class DiscordieMessage extends Message {
  constructor({message}) {
    super(message);
  }

  get adapter() {
    return "discordie"
  }

  get guild() {
    return new DiscordieGuild(this._message.guild);
  }

  get content() {
    return this._message.content;
  }

  get author() {
    return new DiscordieUser(this._message.author);
  }
}

class DiscordieGuild extends Guild {
  constructor(guild) {
    super(guild);
  }
}

class DiscordieUser extends User {
  constructor(guild) {
    super(guild);
  }
}