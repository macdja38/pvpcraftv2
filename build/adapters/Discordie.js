"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Adapter = require("./Adapter");

var _Adapter2 = _interopRequireDefault(_Adapter);

var _discordie = require("discordie");

var _discordie2 = _interopRequireDefault(_discordie);

var _Message = require("../events/Message");

var _Message2 = _interopRequireDefault(_Message);

var _Guild = require("../events/Guild");

var _Guild2 = _interopRequireDefault(_Guild);

var _User = require("../events/User");

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * Created by macdja38 on 2016-09-18.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */

class DiscordieAdapter extends _Adapter2.default {
  constructor({ configJSON, adapterSettings }) {
    super();
    //noinspection JSUnresolvedVariable
    this._configJSON = configJSON;
    this._adapterSettings = adapterSettings;
    this._client = new _discordie2.default();
  }

  get adapter() {
    return "discordie";
  }

  static get name() {
    return "discordie";
  }

  login() {
    var _this = this;

    return _asyncToGenerator(function* () {
      yield _this._client.connect({
        token: _this._adapterSettings.auth.token,
        reconnect: true
      });
      _this.startEvents();
    })();
  }

  startEvents() {
    this._client.Dispatcher.on("GATEWAY_READY", () => {
      /* eslint-disable */
      console.log(`Connected as: ${ this._client.User.username }`);
      /* eslint-enable */
    });

    this._client.Dispatcher.on("MESSAGE_CREATE", e => {
      this._commandHandler.onMessage(new DiscordieMessage(e));
      console.log(`discordie ${ this._client.User.username } ${ e.message.author.username } ${ e.message.content }`);
    });

    this._client.Dispatcher.on("GUILD_ROLE_UPDATE", e => {
      console.log(e); //eslint-disable-line no-console
      const data = e.getChanges();
      console.log(data.before); //eslint-disable-line no-console
      console.log(data.after); //eslint-disable-line no-console
    });
  }
}

exports.default = DiscordieAdapter;
class DiscordieMessage extends _Message2.default {
  constructor({ message }) {
    super(message);
  }

  get adapter() {
    return "discordie";
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

class DiscordieGuild extends _Guild2.default {
  constructor(guild) {
    super(guild);
  }
}

class DiscordieUser extends _User2.default {
  constructor(guild) {
    super(guild);
  }
}
//# sourceMappingURL=Discordie.js.map