/**
 * Created by macdja38 on 2016-11-26.
 */
"use strict";
import "babel-core/register";
import "source-map-support/register";

export class MusicPlayer{
  constructor(adapter, guild, text, voice, queue, musicDB, music) {
    this._adapter = adapter;
    this._musicDB = musicDB;
    this.music = music;
    this.guild = guild;
    this.text = text;
    this.voice = voice;
    this.queue = queue;
    this.repeat = false;
    if(queue && queue.length > 0) {
      this.init(voice.id).then(()=>{
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

  addListeners(connection, oldConnection) {
    if (oldConnection) {
      this.removeListeners(oldConnection);
    }
    connection.on("end", this.onEnd.bind(this));
    connection.on("warn", this.onWarn.bind(this));
    connection.on("debug", this.onDebug.bind(this));
  }

  removeListeners(oldConnection) {
    oldConnection.removeListener("end", this.onEnd);
    oldConnection.removeListener("warn", this.onWarn);
    oldConnection.removeListener("debug", this.onDebug());
  }

  onEnd(...args) {
    console.error(...args);
    let lastVideo = this.queue.shift();
    if(this.repeat) this.queue.push(lastVideo);
    if(this.queue.length > 0) {
      this.play();
    }
  }

  onWarn(...args) {
    console.error("Warn", ...args);
  }

  onDebug(...args) {
    console.error("Debug", ...args);
  }

  async init(channel) {
    return this._adapter.joinVoiceChannel(channel).then(connection => {
      let oldConnection = this.connection;
      this.connection = connection;
      this.addListeners(connection, oldConnection);
    });
  }

  add(link, user) {
    this.queue.push({link, user_id: user.id, user_name: user.name});
    this.saveQueue();
  }

  async play() {
    if (this.queue.length > 0) {
      console.log("queue", this.queue);
      let url = this.music.getStreamUrl(await this.music.getCachingInfoLink(this.queue[0].link));
      console.log(url);
      this.connection.play(url.url, {encoderArgs: ["-c", "copy"]});
    }
  }

  pause() {

  }
}

export default MusicPlayer;
