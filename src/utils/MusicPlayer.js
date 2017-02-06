/**
 * Created by macdja38 on 2016-11-26.
 */
"use strict";
import "babel-core/register";
import "source-map-support/register";

export class MusicPlayer {
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
    if (queue && (queue.length > 0 || currentSong )) {
      if (currentSong) this.queue.push(currentSong);
      this.init(voice).then(() => {
        this.play();
      })
    }
  }

  saveQueue() {
    this._musicDB.saveQueue({
      id: this.guild.id,
      guild_name: this.guild.name,
      text: this.text.name,
      text_id: this.text.id,
      voice: this.voice.name,
      voice_id: this.voice.id,
    }, this.queue)
  }

  saveCurrentSong() {
    this._musicDB.saveCurrentSong({
      id: this.guild.id,
      guild_name: this.guild.name,
      text: this.text.name,
      text_id: this.text.id,
      voice: this.voice.name,
      voice_id: this.voice.id,
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

  async queueRandomPlaylist(id) {
    let playlist = await this.music.getCachedDiscordFMPlaylist(id);
    let newSong = playlist.playlist[Math.floor(Math.random() * playlist.playlist.length)];
    this.queue.push({link: newSong.url, user: "103607047383166976"});
  }

  async onEnd(...args) {
    console.error(new Date().toString(), "End", ...args);
    let lastVideo = this.queue.shift();
    if (this.repeat) this.queue.push(lastVideo);
    else if (this.fallbackQueue && this.queue.length < 1) {
      await this.queueRandomPlaylist(this.fallbackQueue);
    }
    if (this.queue.length > 0) {
      this.play();
    }
    this.saveQueue();
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
    this.queue.push({link, user_id: user.id, user_name: user.name});
    this.saveQueue();
  }

  async play() {
    if ((this.ready === false || this.connection.ready === false) && !this.ready.hasOwnProperty("then")) this.init(this.voice);
    try {
      if (this.ready.hasOwnProperty("then")) {
        await this.ready;
        console.log(new Date().toString(), "Awaited Ready");
        console.log(new Date().toString(), "Awaited Ready status Ready:", this.connection.ready, " connecting:", this.connection.connecting, "channel", this.voice.name);
      }
      //return this.play();
    } catch (error) {
      console.log(new Date().toString(), "l40", error);
      return;
    }
    if (this.queue.length > 0) {
      console.log(new Date().toString(), "queue", this.queue);
      let url;
      let song = this.queue[0];
      try {
        url = this.music.getStreamUrl(await this.music.getCachingInfoLink(song.link));
      } catch (error) {
        this.onEnd();
        return;
      }
      this.currentSong = {link: song.link, user_id: song.user_id, startTime: Date.now()};
      this.saveCurrentSong();
      console.log(new Date().toString(), "Attempting to play ", url);
      console.log(new Date().toString(), "Current connection status Ready:", this.connection.ready, " connecting:", this.connection.connecting, "channel", this.voice.name);
      if ((this.ready === false || this.connection.ready === false) && !this.ready.hasOwnProperty("then")) this.init(this.voice);
      if (this.ready.hasOwnProperty("then")) {
        await this.ready;
        console.log(new Date().toString(), "Awaited Ready 2");
        console.log(new Date().toString(), "Awaited Ready status Ready 2:", this.connection.ready, " connecting:", this.connection.connecting, "channel", this.voice.name);
      }
      if (this.connection.playing) return this.connection.stopPlaying();
      let result;
      try {
        result = await this.connection.play(url.url, {encoderArgs: ["-c", "copy"]});
      } catch (err) {
        console.error("Play failed", err);
      }
      console.log(new Date().toString(), "Play result ", result);
    }
  }

  pause() {

  }
}

export default MusicPlayer;
