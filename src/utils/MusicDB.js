/**
 * Created by macdja38 on 2016-11-26.
 */
"use strict";
import "babel-core/register";
import "source-map-support/register";

import BaseDB from "./BaseDB";

console.log(BaseDB);

export class musicDB extends BaseDB {
  constructor(r) {
    super(r);
    this.table = "queue";
    this.searchCache = "searchCache";
    this.videoCache = "videoCache";
    this.discordFMCache = "discordFMCache";
    this.ensureTable("queue", {});
    this.ensureTable(this.searchCache);
    this.ensureTable(this.videoCache);
    this.ensureTable(this.discordFMCache);
  }

  getAll(...args) {
    return this.r.table(this.table).getAll(...args);
  }

  saveQueue(info, queue) {
    let status = {
      id: info.id,
      guild_name: info.guild_name,
      text: info.text,
      text_id: info.text_id,
      voice: info.voice,
      voice_id: info.voice_id,
      queue
    };
    return this.r.table(this.table).insert(status, {conflict: "update"}).run();
  }

  saveCurrentSong(info, currentSong) {
    let status = {
      id: info.id,
      guild_name: info.guild_name,
      text: info.text,
      text_id: info.text_id,
      voice: info.voice,
      voice_id: info.voice_id,
      currentSong
    };
    return this.r.table(this.table).insert(status, {conflict: "update"}).run();
  }

  saveVid(linkHash, link, video) {
    video.id = linkHash;
    video.link = link;
    video.timeFetched = Date.now();
    return this.r.table(this.videoCache).insert(video, {conflict: "replace"}).run();
  }

  getVid(hash) {
    return this.r.table(this.videoCache).get(hash).run();
  }

  saveSearch(string, result) {
    return this.r.table(this.searchCache).insert({id: string, result: result, timeFetched: Date.now()}, {conflict: "replace"}).run();
  }

  getSearch(string) {
    return this.r.table(this.searchCache).get(string).run();
  }

  saveDiscordFMPlaylist(id, playlist) {
    return this.r.table(this.discordFMCache).insert({id, playlist}, {conflict: "replace"}).run();
  }

  getDiscordFMPlaylist(id) {
    return this.r.table(this.discordFMCache).get(id).run();
  }
}

export default musicDB;