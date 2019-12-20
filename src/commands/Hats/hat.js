/**
 * Created by macdja38 on 2016-11-13.
 */
"use strict";
import "babel-core/register";
import "source-map-support/register";

var https = new require('https');

var request = require('request').defaults({encoding: null});

var fs = require('fs');

var Canvas = require('canvas')
  , Image = Canvas.Image;

import Command from "../Command";

let requirements = ["Warframe"];

export class Hat extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["hat"],
      module: ["hat"],
      nodes: ["warframe.alert"],
      description: "Display the current warframe alerts.",
      usage: []
    });
  }

  async exec(command) {
    let msg = command.message;
    let avatarURL = msg.author.avatarURL;

    let imgPromise;
    if (avatarURL) {
      imgPromise = getImageFromUrl(avatarURL);
    } else {
      imgPromise = getImageFromUrl("https://canary.discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png");
    }
    let hatPromise = getImageFromFile("./resources/hat.png");

    let img = await imgPromise;
    let hatImg = await hatPromise;

    process.nextTick(() => {
      try {
        let canvas = new Canvas(128, 128), ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, 128, 128);
        ctx.rotate(30 / 180);
        ctx.drawImage(hatImg, -70, -55, 300, 130);
        let stream = canvas.pngStream();
        let buffers = [];
        stream.on("data", (buffer) => {
          buffers.push(buffer);
        });
        stream.on("end", () => {
          let buffer = Buffer.concat(buffers);
          command.sendMessage({embed: {image: {url: "attachment://hat.png"}, description: "Here is your hat!\nEdit [here](https://christmas.ryke.xyz) | Invite bot [here](https://hat.pvpcraft.ca)"}}, {name: "hat.png", file: buffer});
        });
      } catch(errors){
        command.sendMessage(`Sorry the error ${errors} occurred while processing your command, make sure you have a non-default avatar`);
        console.error("error", errors);
      }
    });
  }

  init() {
    console.log("Got init");
  }
}

export default Hat;

function getImageFromFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) return reject(err);
      let img = new Image;
      img.src = data;
      resolve(img);
    });
  });
}

function getImageFromUrl(url) {
  return new Promise((resolve, reject)=>{
    request.get(url, (err, res, image)=> {
      if(err) return reject(err);
      let data = Buffer.from(image);
      let img = new Image;
      img.src = data;
      resolve(img);
    });
  });
}