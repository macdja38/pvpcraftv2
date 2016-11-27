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
    if(queue && queue.length > 0) {
      this.init(voice.id).then(()=>{
        this.play();
      })
    }
  }

  async init(channel) {
    return this._adapter.joinVoiceChannel(channel).then(connection => {
      this.connection = connection;
    });
  }

  add(video) {

  }

  async play() {
    if (this.queue.length > 0) {
      console.log("queue", this.queue);
      let url = this.music.getStreamUrl(await this.music.getCachingInfoLink(this.queue[0].link));
      console.log(url);
      this.connection.play(url.url);
    }
  }

  pause() {

  }
}

export default MusicPlayer;
