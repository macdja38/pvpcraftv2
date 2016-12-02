/**
 * Created by macdja38 on 2016-11-26.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MusicPlayer = undefined;

require("babel-core/register");

require("source-map-support/register");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class MusicPlayer {
  constructor(adapter, guild, text, voice, queue, musicDB, music) {
    this._adapter = adapter;
    this._musicDB = musicDB;
    this.music = music;
    this.guild = guild;
    this.text = text;
    this.voice = voice;
    this.queue = queue;
    this.repeat = false;
    this.fallbackQueue = "electro-hub";
    this.ready = false;
    this.connecting = false;
    this.currentSong = false;
    this.songStartTime = Date.now();
    if (queue && queue.length > 0) {
      this.init(voice.id).then(() => {
        this.play();
      });
    }
  }

  saveQueue() {
    this._musicDB.saveQueue({
      id: this.guild.id,
      guild_name: this.guild.name,
      text: this.text.name,
      text_id: this.text.id,
      voice: this.voice.name,
      voice_id: this.voice.id
    }, this.queue);
  }

  addListeners(connection, oldConnection) {
    if (oldConnection) {
      this.removeListeners(oldConnection);
    }
    connection.on("end", this.onEnd.bind(this));
    connection.on("warn", this.onWarn.bind(this));
    connection.on("debug", this.onDebug.bind(this));
    connection.on("disconnect", this.onDisconnect.bind(this));
  }

  removeListeners(oldConnection) {
    oldConnection.removeListener("end", this.onEnd);
    oldConnection.removeListener("warn", this.onWarn);
    oldConnection.removeListener("debug", this.onDebug());
    oldConnection.removeListener("disconnect", this.onDisconnect());
  }

  queueRandomPlaylist(id) {
    var _this = this;

    return _asyncToGenerator(function* () {
      let playlist = yield _this.music.getCachedDiscordFMPlaylist(id);
      console.log("playlist", playlist);
      let newSong = playlist.playlist[Math.floor(Math.random() * playlist.playlist.length)];
      _this.queue.push({ link: newSong.url, user: "103607047383166976" });
    })();
  }

  onEnd(...args) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      console.error(...args);
      let lastVideo = _this2.queue.shift();
      if (_this2.repeat) _this2.queue.push(lastVideo);else if (_this2.fallbackQueue) {
        yield _this2.queueRandomPlaylist(_this2.fallbackQueue);
      }
      if (_this2.queue.length > 0) {
        _this2.play();
      }
    })();
  }

  onWarn(...args) {
    console.error("Warn", ...args);
  }

  onDebug(...args) {
    console.error("Debug", ...args);
  }

  onDisconnect(...args) {
    console.error("Disconnected", ...args);
    this.connection.disconnect(null, true);
  }

  init(channel) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      return _this3._adapter.joinVoiceChannel(channel).then(function (connection) {
        let oldConnection = _this3.connection;
        _this3.connection = connection;
        _this3.addListeners(connection, oldConnection);
      });
    })();
  }

  add(link, user) {
    this.queue.push({ link, user_id: user.id, user_name: user.name });
    this.saveQueue();
  }

  play() {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      if (_this4.queue.length > 0) {
        console.log("queue", _this4.queue);
        let url;
        try {
          url = _this4.music.getStreamUrl((yield _this4.music.getCachingInfoLink(_this4.queue[0].link)));
        } catch (error) {
          _this4.onEnd();
          return;
        }
        console.log("Attempting to play ", url);
        console.log("Current connection status Ready:", _this4.connection.ready, " connecting:", _this4.connection.connecting);
        let result = yield _this4.connection.play(url.url, { encoderArgs: ["-c", "copy"] });
        console.log("Play result ", result);
        _this4.songStartTime = Date.now();
      }
    })();
  }

  pause() {}
}

exports.MusicPlayer = MusicPlayer;
exports.default = MusicPlayer;
//# sourceMappingURL=MusicPlayer.js.map