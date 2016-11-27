/**
 * Created by macdja38 on 2016-11-26.
 */
"use strict";
import "babel-core/register";
import "source-map-support/register";
import crypto from "crypto";

import Module from "./Module";

let requirements = ["configDB", "musicDB", "configJSON", "musicPlayer"];

let request = require("request");

let table = "music";

export class Music extends Module {
  constructor({ configDB, videoInfo, authJSON, musicDB, MusicPlayer, adaptersArray }) {
    super();
    this.adapters = adaptersArray;
    this.MusicPlayer = MusicPlayer;
    this.musicDB = musicDB;
    this.videoInfo = videoInfo;
    this.players = [];
    this.regionCode = "CA";
    this.apiKey = authJSON.get("apiKeys.youtube", false);
    this.startConnections();
  }

  startConnections() {
    this.adapters.forEach(async a => {
      await a.ready;
      this.musicDB.getAll(...a.serverIds).then(queues => {
        queues.forEach(queue => {
          console.log(queue);
          let guild = a.getGuild(queue.id);
          if (!guild) return;
          let voice = guild.getChannel(queue.voice_id);
          let text = guild.getChannel(queue.text_id);
          if (!text || !voice) return;
          let player = new this.MusicPlayer(a, guild, text, voice, queue.queue, this.musicDB, this);
          this.players.push(player);
        })
      })
    })
  }

  getStreamUrl(info) {
    return this.videoInfo.getStreamUrl(info);
  }

  async getCachingInfoLink(link) {
    let hashedLink = crypto.createHash("sha256").update(link).digest("hex");
    return this.getCachingInfoHash(hashedLink, link)
  }

  async getCachingInfoHash(hashedLink, link) {
    let cachedInfo = await this.musicDB.getVid(hashedLink);
    console.log("cachedInfo", cachedInfo);
    if (cachedInfo) return cachedInfo;
    let info = await this.videoInfo.getVideoInfo(link);
    console.log("fetchedInfo", info);
    this.musicDB.saveVid(hashedLink, link, info);
    return info;
  }

  async cachingSearch(string) {
    let cache = await this.musicDB.getSearch(string);
    if (cache) {
      console.log("Cached", cache);
      return cache;
    }
    let response = await this.search(string);
    this.musicDB.saveSearch(string, response).catch(error => console.error);
    console.log(response);
    return response;
  }

  search(string) {
    return new Promise((resolve, reject) => {
      let requestUrl = "https://www.googleapis.com/youtube/v3/search" +
        `?part=snippet&q=${string}&key=${this.apiKey}&regionCode=${this.regionCode}`;
      request({method: "GET", uri: requestUrl, gzip: true}, (error, response) => {
        if (error) reject(error);
        resolve(JSON.parse(response.body));
      })
    })
  }
}

export default Music;