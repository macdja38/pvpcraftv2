/**
 * Created by macdja38 on 2016-09-18.
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("babel-core/register");

require("source-map-support/register");

var _Adapter = require("./Adapter");

var _Adapter2 = _interopRequireDefault(_Adapter);

var _eris = require("eris");

var _eris2 = _interopRequireDefault(_eris);

var _Message = require("../events/Message");

var _Message2 = _interopRequireDefault(_Message);

var _Guild = require("../events/Guild");

var _Guild2 = _interopRequireDefault(_Guild);

var _User = require("../events/User");

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class ErisAdapter extends _Adapter2.default {
  constructor({ configJSON, adapterSettings }) {
    super();
    //noinspection JSUnresolvedVariable
    this._event = new _Message2.default();
    this._configJSON = configJSON;
    this._adapterSettings = adapterSettings;
    this._client = new _eris2.default(this._adapterSettings.auth.token);
    this._ready = this.startReady();
  }

  static get name() {
    return "eris";
  }

  startReady() {
    return new Promise((resolve, reject) => {
      this._client.on("ready", () => {
        resolve(true);
      });
    });
  }

  get ready() {
    return this._ready;
  }

  get serverIds() {
    return this._client.guilds.map(g => g.id);
  }

  login() {
    var _this = this;

    return _asyncToGenerator(function* () {
      _this._client.on("error", function (e) {
        return console.error("Eris error", e);
      });
      console.log(_this._configJSON);
      yield _this._client.connect();
      _this.startEvents();
    })();
  }

  startEvents() {
    this._client.on("ready", () => {
      if (this._adapterSettings.hasOwnProperty("status")) {
        this._client.editStatus(this._adapterSettings.status.status, this._adapterSettings.status.game);
      }
      /* eslint-disable */
      console.log(`Connected as: ${ this._client.user.username }`);
      /* eslint-enable */
    });

    this._client.on("messageCreate", message => {
      this._commandHandler.onMessage(new ErisMessage(message, this._client));
      console.log(`eris ${ this._client.user.username } ${ message.author.username } ${ message.content }`);
    });
  }

  joinVoiceChannel(channelId) {
    return this._client.joinVoiceChannel(channelId);
  }

  getGuild(id) {
    return new ErisGuild(this._client.guilds.get(id));
  }
}

exports.default = ErisAdapter;
class ErisMessage extends _Message2.default {
  constructor(message, client) {
    super(message, client);
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

  get channel() {
    return this._message.channel;
  }

  reply(string, ...args) {
    return this._client.createMessage(this._message.channel.id, `${ this._message.author.mention }, ${ string }`, ...args);
  }

  sendMessage(...args) {
    return this.channel.createMessage(...args);
  }
}

class ErisGuild extends _Guild2.default {
  constructor(guild) {
    super(guild);
  }
}

class ErisUser extends _User2.default {
  constructor(user) {
    super(user);
  }

  /* get highestRole() {
    return this._user.roles.reduce((prev, role) => !prev || role.position > prev.position || (role.position === prev.position && role.id < prev.id) ? role : prev);
  } */
}
//# sourceMappingURL=Eris.js.map