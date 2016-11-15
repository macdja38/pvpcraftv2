/**
 * Created by macdja38 on 2016-11-13.
 */

var https = new require('https');

var request = require('request').defaults({encoding: null});

var fs = require('fs');

var Canvas = require('canvas')
  , Image = Canvas.Image;

import Command from "../Command";

let requirements = ["Warframe"];

export class Alerts extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ['hat'],
      module: 'warframe',
      nodes: ['warframe.alert'],
      description: "Display the current warframe alerts.",
      usage: []
    });
  }

  async exec(command) {
    let msg = command.message;
    let avatarURL = msg.author.avatarURL;

    let imgPromise = getImageFromUrl(avatarURL);
    let hatPromise = getImageFromFile('./resources/hat.png');

    let img = await imgPromise;
    let hatImg = await hatPromise;

    process.nextTick(() => {
      let canvas = new Canvas(128, 128), ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, 128, 128);
      ctx.drawImage(hatImg, 0, 0, 128, 128);
      let stream = canvas.pngStream();
      let buffers = [];
      stream.on('data', (buffer) => {
        buffers.push(buffer);
      });
      stream.on('end', () => {
        let buffer = Buffer.concat(buffers);
        command.sendMessage("Here is your hat!", {name: "hat.png", file: buffer});
      });
    })
  }

  init() {
    console.log("Got init");
  }
}

export default Alerts;

function getImageFromFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) return reject(err);
      let img = new Image;
      img.src = data;
      resolve(img);
    })
  })
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