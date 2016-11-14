/**
 * Created by macdja38 on 2016-09-18.
 */

import Adapter from "./Adapter";
import Discord from "eris";
import Message from "../events/Message";
import Guild from "../events/Guild";
import User from "../events/User";

export default class ErisAdapter extends Adapter {
  constructor({configJSON, adapterSettings}) {
    super();
    //noinspection JSUnresolvedVariable
    this._event = new Message();
    this._configJSON = configJSON;
    this._adapterSettings = adapterSettings;
    this._client = new Discord(this._adapterSettings.auth.token);
  }

  static get name() {
    return "eris";
  }

  async login() {
    this._client.on("error", e => console.error("Eris error", e));
    console.log(this._configJSON);
    await this._client.connect();
    this.startEvents();
  }

  startEvents() {
    this._client.on("ready", () => {
      /* eslint-disable */
      console.log(`Connected as: ${this._client.user.username}`);
      /* eslint-enable */
    });

    this._client.on("messageCreate", message => {
      this._commandHandler.onMessage(new ErisMessage(message, this._client));
      console.log(`eris ${this._client.user.username} ${message.author.username} ${message.content}`);
    });
  }
}

class ErisMessage extends Message {
  constructor(message, client) {
    super(message);
    this._client = client;
  }

  get adapter() {
    return "eris";
  }

  get guild() {
    return new ErisGuild(this._message.guild);
  }

  get content() {
    return this._message.content;
  }

  get author() {
    return new ErisUser(this._message.author);
  }

  get client() {
    return this._client;
  }

  get channel() {
    return this._message.channel;
  }

  reply(string) {
    return this._client.createMessage(this._message.channel.id, `${this._message.author.mention}, ${string}`);
  }
}

class ErisGuild extends Guild {
  constructor(guild) {
    super(guild);
  }
}

class ErisUser extends User {
  constructor(user) {
    super(user);
  }

  /* get highestRole() {
    return this._user.roles.reduce((prev, role) => !prev || role.position > prev.position || (role.position === prev.position && role.id < prev.id) ? role : prev);
  } */
}