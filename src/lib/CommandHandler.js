/**
 * Created by macdja38 on 2016-09-20.
 */
"use strict";

export default class CommandHandler{
  constructor() {
    this._pingsRecieved = {};
    this._pingsResponded = {};
    this._pingsDelay = {};
    this._pingsError = {};
  }

  onMessage(e) {
    console.log("content", e.content);
    if(e.content === "!ping") {
      incrementCounter(this._pingsRecieved, e.adapter);
      let disbatch = Date.now();
      e.reply("Pong").then(()=>{
        pushArrayCounter(this._pingsDelay, e.adapter, Date.now()-disbatch);
        incrementCounter(this._pingsResponded, e.adapter);
      }).catch(console.error);
    }

    if(e.content.toLowerCase() === "!getstats") {
      e.reply(`Recived: ${counterToString(this._pingsRecieved)} Responded to: ${counterToString(this._pingsResponded)}`);
    }

    if(e.content.toLowerCase() === "!gettiming") {
      e.reply(`timing: \n${objectOfArraysToStringAndStats(this._pingsDelay)}`);
    }

    if(e.content === "!reset") {
      e.reply("RESET!");
    }

    if(e.content === "!hrole" && e.name === "discordjs") {
      e.reply(e.member.highestRole)
    }
  }
}

function counterToString(object) {
  return Object.keys(object).map(key => `${key}=${object[key]}`).join(" ");
}

function objectOfArraysToStringAndStats(object) {
  return Object.keys(object).map(key => `${key}=${standardDeviation(object[key])} avg:${average(object[key])}`).join("\n");
}

function incrementCounter(object, index) {
  object[index] = (object[index] || 0) + 1;
}

function pushArrayCounter(thing, index, item) {
  if(thing.hasOwnProperty(index)) {
    thing[index].push(item);
  } else {
    thing[index] = [item];
  }
}

function standardDeviation(values){
  var avg = average(values);

  var squareDiffs = values.map(function(value){
    var diff = value - avg;
    return diff * diff;
  });

  var avgSquareDiff = average(squareDiffs);

  return Math.sqrt(avgSquareDiff);
}

function average(data){
  var sum = data.reduce(function(sum, value){
    return sum + value;
  }, 0);

  return sum / data.length;
}