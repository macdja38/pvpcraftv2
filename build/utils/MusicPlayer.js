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
      console.error(new Date().toString(), "End", ...args);
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
    console.error(new Date().toString(), "Warn:", ...args);
  }

  onDebug(debug) {
    if (!/"op":(?:3|5)/.test(debug)) {
      console.error(new Date().toString(), "Debug:", debug);
    }
  }

  onError(...args) {
    console.error(new Date().toString(), "Error:", ...args);
  }

  onDisconnect(...args) {
    console.error(new Date().toString(), "Disconnected:", ...args);
    //this.connection.disconnect(null, true);
    //this.init(this.voice);
  }

  _init(channel) {
    console.log(new Date().toString(), "Calling joinVoiceChannel");
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
    let initReady;
    if (!this.ready.hasOwnProperty("then")) {
      initReady = this._init(channel);
      this.ready = initReady;
    }
    return this.ready.then(() => {
      this.ready = true;
      return initReady;
    });
  }

  add(link, user) {
    this.queue.push({ link, user_id: user.id, user_name: user.name });
    this.saveQueue();
  }

  play() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      if ((_this3.ready === false || _this3.connection.ready === false) && !_this3.ready.hasOwnProperty("then")) _this3.init(_this3.voice);
      try {
        if (_this3.ready.hasOwnProperty("then")) {
          yield _this3.ready;
          console.log(new Date().toString(), "Awaited Ready");
          console.log(new Date().toString(), "Awaited Ready status Ready:", _this3.connection.ready, " connecting:", _this3.connection.connecting, "channel", _this3.voice.name);
        }
        //return this.play();
      } catch (error) {
        console.log(new Date().toString(), "l40", error);
        return;
      }
      if (_this3.queue.length > 0) {
        console.log(new Date().toString(), "queue", _this3.queue);
        let url;
        let song = _this3.queue[0];
        try {
          url = _this3.music.getStreamUrl((yield _this3.music.getCachingInfoLink(song.link)));
        } catch (error) {
          _this3.onEnd();
          return;
        }
        _this3.currentSong = { link: song.link, user_id: song.user_id, startTime: Date.now() };
        _this3.saveCurrentSong();
        console.log(new Date().toString(), "Attempting to play ", url);
        console.log(new Date().toString(), "Current connection status Ready:", _this3.connection.ready, " connecting:", _this3.connection.connecting, "channel", _this3.voice.name);
        if ((_this3.ready === false || _this3.connection.ready === false) && !_this3.ready.hasOwnProperty("then")) _this3.init(_this3.voice);
        if (_this3.ready.hasOwnProperty("then")) {
          yield _this3.ready;
          console.log(new Date().toString(), "Awaited Ready 2");
          console.log(new Date().toString(), "Awaited Ready status Ready 2:", _this3.connection.ready, " connecting:", _this3.connection.connecting, "channel", _this3.voice.name);
        }
        if (_this3.connection.playing) return _this3.connection.stopPlaying();
        let result;
        try {
          result = yield _this3.connection.play(url.url, { encoderArgs: ["-c", "copy"] });
        } catch (err) {
          console.error("Play failed", err);
        }
        console.log(new Date().toString(), "Play result ", result);
      }
    })();
  }

  pause() {}
}

exports.MusicPlayer = MusicPlayer;
exports.default = MusicPlayer;
//# sourceMappingURL=MusicPlayer.js.map