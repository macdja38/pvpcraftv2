/**
 * Created by macdja38 on 2016-09-20.
 */
"use strict";

export default class CommandHandler{
  constructor() {

  }

  onMessage(e) {
    console.log("content", e.content);
    if(e.content === "!ping") {
      e.reply("Pong");
    }
  }
}