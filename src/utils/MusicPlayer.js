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
      this.init(voice.id).then(() => {
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

  async queueRandomPlaylist(id) {
    let playlist = await this.music.getCachedDiscordFMPlaylist(id);
    console.log("playlist", playlist);
    let newSong = playlist.playlist[Math.floor(Math.random() * playlist.playlist.length)];
    this.queue.push({link: newSong.url, user: "103607047383166976"});
  }

  async onEnd(...args) {
    console.error("End", ...args);
    let lastVideo = this.queue.shift();
    if (this.repeat) this.queue.push(lastVideo);
    else if (this.fallbackQueue) {
      await this.queueRandomPlaylist(this.fallbackQueue);
    }
    if (this.queue.length > 0) {
      this.play();
    }
    this.saveQueue();
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
    this.init(this.voice);
  }

  _init(channel) {
    return this._adapter.joinVoiceChannel(channel).then(connection => {
      let oldConnection = this.connection;
      if (oldConnection) {
        this.removeListeners(oldConnection);
      }
      this.connection = connection;
      this.addListeners(connection, oldConnection);
    });
  }

  async init(channel) {
    let initReady = this._init(channel);
    this.ready = initReady;
    await this.ready;
    this.ready = true;
    return initReady;
  }

  add(link, user) {
    this.queue.push({link, user_id: user.id, user_name: user.name});
    this.saveQueue();
  }

  async play() {
    if (this.ready === false) this.init(this.voice);
    try {
      if (this.ready.then) await this.ready;
    } catch (error) {
      return;
    }
    if (this.queue.length > 0) {
      console.log("queue", this.queue);
      let url;
      try {
        url = this.music.getStreamUrl(await this.music.getCachingInfoLink(this.queue[0].link));
      } catch (error) {
        this.onEnd();
        return;
      }
      this.currentSong = {link: this.queue[0], user_id: this.queue[0].user_id, startTime: Date.now()};
      this.saveCurrentSong();
      console.log("Attempting to play ", url);
      console.log("Current connection status Ready:", this.connection.ready, " connecting:", this.connection.connecting);
      let result = await this.connection.play(url.url, {encoderArgs: ["-c", "copy"]});
      console.log("Play result ", result);
    }
  }

  pause() {

  }
}

export default MusicPlayer;
