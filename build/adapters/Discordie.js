/**
 * Created by macdja38 on 2016-09-18.
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("babel-core/register");

require("source-map-support/register");

var _stream = require("stream");

var _stream2 = _interopRequireDefault(_stream);

var _https = require("https");

var _https2 = _interopRequireDefault(_https);

var _discordie = require("discordie");

var _discordie2 = _interopRequireDefault(_discordie);

var _Adapter = require("./Adapter");

var _Adapter2 = _interopRequireDefault(_Adapter);

var _Message = require("../events/Message");

var _Message2 = _interopRequireDefault(_Message);

var _Guild = require("../events/Guild");

var _Guild2 = _interopRequireDefault(_Guild);

var _User = require("../events/User");

var _User2 = _interopRequireDefault(_User);

var _Connection = require("../events/Connection");

var _Connection2 = _interopRequireDefault(_Connection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class DiscordieAdapter extends _Adapter2.default {
  constructor({ configJSON, adapterSettings }) {
    super();
    //noinspection JSUnresolvedVariable
    this._configJSON = configJSON;
    this._adapterSettings = adapterSettings;
    this._client = new _discordie2.default();
    this._ready = this.startReady();
  }

  get adapter() {
    return "discordie";
  }

  startReady() {
    return new Promise((resolve, reject) => {
      this._client.Dispatcher.on("GATEWAY_READY", () => {
        resolve(true);
      });
    });
  }

  get ready() {
    return this._ready;
  }

  static get name() {
    return "discordie";
  }

  get serverIds() {
    return this._client.Guilds.map(g => g.id);
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
      console.log(`Connected as: ${this._client.User.username}`);
      /* eslint-enable */
    });

    this._client.Dispatcher.on("MESSAGE_CREATE", e => {
      this._commandHandler.onMessage(new DiscordieMessage(e, this._client));
      console.log(`discordie ${this._client.User.username} ${e.message.author.username} ${e.message.content}`);
    });

    this._client.Dispatcher.on("GUILD_ROLE_UPDATE", e => {
      console.log(e); //eslint-disable-line no-console
      const data = e.getChanges();
      console.log(data.before); //eslint-disable-line no-console
      console.log(data.after); //eslint-disable-line no-console
    });
  }

  getGuild(id) {
    let guild = this._client.Guilds.get(id);
    if (guild) {
      return new DiscordieGuild(guild);
    } else {
      return null;
    }
  }

  joinVoiceChannel(channelId) {
    let channel = this._client.Channels.get(channelId);
    if (channel) {
      return channel.join().then(c => new DiscordieConnection(c, this._client));
    }
    return Promise.reject("Channel not found");
  }
}

exports.default = DiscordieAdapter;
class DiscordieMessage extends _Message2.default {
  constructor(message, client) {
    super(message.message, client);
  }

  get adapter() {
    return "discordie";
  }

  get guild() {
    return new DiscordieGuild(this._message.guild);
  }

  get clientUser() {
    return this.client.User;
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

  getChannel(id) {
    return this._guild.channels.find(c => c.id === id);
  }
}

class DiscordieUser extends _User2.default {
  constructor(guild) {
    super(guild);
  }
}

class DiscordieConnection extends _Connection2.default {
  constructor(connectionInfo, client) {
    super(connectionInfo.voiceConnection, client);
  }

  play(data) {
    console.log(`discordie connection state connection is ${this._connection.disposed} and stream is `, this._connection.canStream);
    if (this._connection.disposed || !this._connection.canStream) {
      console.log("Attempting reconnect");
      let channel = this._client.Channels.get(this._connection.channelId);
      if (channel) {
        console.log("found channel, joining");
        return channel.join().then(c => {
          this._connection = c.voiceConnection;console.log("joined");this.play(data);
        });
      }
    }
    data = { container: "god knows", encoding: "even worse", url: data };
    console.log("Discordie Music Playing Code here.", data);
    let encoder;
    let fsStream = false;
    let sourceStreamPromise = false;
    if (data.container === "webm" && data.encoding === "opus") {
      let { rs, sourceStream } = makeStream(data.url);
      fsStream = rs;
      sourceStreamPromise = sourceStream;
      encoder = this._connection.createExternalEncoder({
        type: "WebmOpusPlayer",
        source: fsStream
      });
    } else {
      console.log(this._connection);
      encoder = this._connection.createExternalEncoder({
        type: "ffmpeg",
        format: "opus",
        source: data.url,
        frameDuration: 60,
        debug: true
      });
    }

    let encoderStream = encoder.play();
    encoder.on("end", () => this.emit("end"));

    encoderStream.once('unpipe', () => {
      if (sourceStreamPromise) {
        sourceStreamPromise.then(s => s.unpipe());
        encoder.unpipeAll();
      }
    });
  }
}

function makeStream(url) {
  let rs = new _stream2.default.PassThrough();
  let sourceStreamPromise = new Promise((resolve, reject) => {
    _https2.default.get(url, function (res) {
      res.on("error", error => {
        reject(error);console.error(error);
      });
      resolve(res);
      res.pipe(rs);
    });
  });
  return { rs, sourceStreamPromise };
}
//# sourceMappingURL=Discordie.js.map