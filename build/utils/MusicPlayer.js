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
  constructor(adapter, guild, text, voice, queue, currentSong, musicDB, music) {
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
    this.currentSong = currentSong;
    this.songStartTime = Date.now();
    if (queue && (queue.length > 0 || currentSong)) {
      if (currentSong) this.queue.push(currentSong);
      this.init(voice).then(() => {
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

  saveCurrentSong() {
    this._musicDB.saveCurrentSong({
      id: this.guild.id,
      guild_name: this.guild.name,
      text: this.text.name,
      text_id: this.text.id,
      voice: this.voice.name,
      voice_id: this.voice.id
    }, this.currentSong);
  }

  addListeners(connection, oldConnection) {
    if (oldConnection) {
      this.removeListeners(oldConnection);
    }
    connection.on("end", this.onEnd.bind(this));
    connection.on("error", this.onError.bind(this));
    connection.on("warn", this.onWarn.bind(this));
    connection.on("debug", this.onDebug.bind(this));
    connection.on("disconnect", this.onDisconnect.bind(this));
  }

  removeListeners(oldConnection) {
    oldConnection.removeListener("end", this.onEnd);
    oldConnection.removeListener("error", this.onError);
    oldConnection.removeListener("warn", this.onWarn);
    oldConnection.removeListener("debug", this.onDebug);
    oldConnection.removeListener("disconnect", this.onDisconnect);
  }

  queueRandomPlaylist(id) {
    var _this = this;

    return _asyncToGenerator(function* () {
      let playlist = yield _this.music.getCachedDiscordFMPlaylist(id);
      let newSong = playlist.playlist[Math.floor(Math.random() * playlist.playlist.length)];
      _this.queue.push({ link: newSong.url, user: "103607047383166976" });
    })();
  }

  onEnd(...args) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      console.error("End", ...args);
      let lastVideo = _this2.queue.shift();
      if (_this2.repeat) _this2.queue.push(lastVideo);else if (_this2.fallbackQueue && _this2.queue.length < 1) {
        yield _this2.queueRandomPlaylist(_this2.fallbackQueue);
      }
      if (_this2.queue.length > 0) {
        _this2.play();
      }
      _this2.saveQueue();
    })();
  }

  onWarn(...args) {
    console.error("Warn", ...args);
  }

  onDebug(debug) {
    if (!/"op":(?:3|5)/.test(debug)) {
      console.error("Debug", debug);
    }
  }

  onError(...args) {
    console.error("Error", ...args);
  }

  onDisconnect(...args) {
    console.error("Disconnected", ...args);
    this.connection.disconnect(null, true);
    this.init(this.voice);
  }

  _init(channel) {
    return this._adapter.joinVoiceChannel(channel.id).then(connection => {
      let oldConnection = this.connection;
      if (oldConnection) {
        this.removeListeners(oldConnection);
      }
      this.connection = connection;
      this.addListeners(connection, oldConnection);
    });
  }

  init(channel) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      let initReady = _this3._init(channel);
      _this3.ready = initReady;
      yield _this3.ready;
      _this3.ready = true;
      return initReady;
    })();
  }

  add(link, user) {
    this.queue.push({ link, user_id: user.id, user_name: user.name });
    this.saveQueue();
  }

  play() {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      if (_this4.ready === false) _this4.init(_this4.voice);
      try {
        if (_this4.ready.then) yield _this4.ready;
      } catch (error) {
        return;
      }
      if (_this4.queue.length > 0) {
        console.log("queue", _this4.queue);
        let url;
        try {
          url = _this4.music.getStreamUrl((yield _this4.music.getCachingInfoLink(_this4.queue[0].link)));
        } catch (error) {
          _this4.onEnd();
          return;
        }
        _this4.currentSong = { link: _this4.queue[0], user_id: _this4.queue[0].user_id, startTime: Date.now() };
        _this4.saveCurrentSong();
        console.log("Attempting to play ", url);
        console.log("Current connection status Ready:", _this4.connection.ready, " connecting:", _this4.connection.connecting);
        let result = yield _this4.connection.play(url.url, { encoderArgs: ["-c", "copy"] });
        console.log("Play result ", result);
      }
    })();
  }

  pause() {}
}

exports.MusicPlayer = MusicPlayer;
exports.default = MusicPlayer;
//# sourceMappingURL=MusicPlayer.js.map