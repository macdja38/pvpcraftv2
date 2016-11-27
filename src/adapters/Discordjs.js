/**
 * Created by macdja38 on 2016-09-18.
 */

"use strict";
import "babel-core/register";
import "source-map-support/register";

import Adapter from "./Adapter";
import Discord from "discord.js";
import Message from "../events/Message";
import Guild from "../events/Guild";
import User from "../events/User";

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

  async login() {
    this._client.on("error", e => console.error("Discordjs error", e));
    await this._client.login(this._adapterSettings.auth.token);
    this.startEvents();
  }

  startEvents() {
    this._client.on("ready", () => {
      /* eslint-disable */
      console.log(`Connected as: ${this._client.user.username}`);
      /* eslint-enable */
    });

    this._client.on("message", message => {
      this._commandHandler.onMessage(new DiscordjsMessage(message));
      console.log(`discordjs ${this._client.user.username} ${message.author.username} ${message.content}`);
    });
  }
}

class DiscordjsMessage extends Message {
  constructor(message) {
    super(message);
  }

  get adapter() {
    return "discordjs"
  }

  get member() {
    return new DiscordjsMember(this._message.author, this._message.guild);
  }

  get guild() {
    return new DiscordjsGuild(this._message.guild);
  }

  get content() {
    return this._message.content;
  }

  get author() {
    return new DiscordjsUser(this._message.author);
  }
}

class DiscordjsGuild extends Guild {
  constructor(guild) {
    super(guild);
  }
}

class DiscordjsUser extends User {
  constructor(user) {
    super(user);
  }
}

class DiscordjsMember extends DiscordjsUser {
  constructor(user, guild) {
    super(user);
    this._guild = guild;
  }

  get highestRole() {
    return this._guild.members.find("id", this._user.id).highestRole.name.replace(/@/g, "AT");
  }

  get highestRole() {
    return this.roles.reduce((prev, role) =>
      !prev || role.position > prev.position ||(role.position === prev.position && role.id < prev.id) ? role : prev);
  }
}

