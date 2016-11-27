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

var _discord = require("discord.js");

var _discord2 = _interopRequireDefault(_discord);

var _Message = require("../events/Message");

var _Message2 = _interopRequireDefault(_Message);

var _Guild = require("../events/Guild");

var _Guild2 = _interopRequireDefault(_Guild);

var _User = require("../events/User");

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class DiscordjsAdapter extends _Adapter2.default {
  constructor({ configJSON, adapterSettings }) {
    super();
    //noinspection JSUnresolvedVariable
    this._configJSON = configJSON;
    this._adapterSettings = adapterSettings;
    this._client = new _discord2.default.Client();
  }

  static get name() {
    return "discordjs";
  }

  login() {
    var _this = this;

    return _asyncToGenerator(function* () {
      _this._client.on("error", function (e) {
        return console.error("Discordjs error", e);
      });
      yield _this._client.login(_this._adapterSettings.auth.token);
      _this.startEvents();
    })();
  }

  startEvents() {
    this._client.on("ready", () => {
      /* eslint-disable */
      console.log(`Connected as: ${ this._client.user.username }`);
      /* eslint-enable */
    });

    this._client.on("message", message => {
      this._commandHandler.onMessage(new DiscordjsMessage(message));
      console.log(`discordjs ${ this._client.user.username } ${ message.author.username } ${ message.content }`);
    });
  }
}

exports.default = DiscordjsAdapter;
class DiscordjsMessage extends _Message2.default {
  constructor(message) {
    super(message);
  }

  get adapter() {
    return "discordjs";
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

class DiscordjsGuild extends _Guild2.default {
  constructor(guild) {
    super(guild);
  }
}

class DiscordjsUser extends _User2.default {
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
    return this.roles.reduce((prev, role) => !prev || role.position > prev.position || role.position === prev.position && role.id < prev.id ? role : prev);
  }
}
//# sourceMappingURL=Discordjs.js.map