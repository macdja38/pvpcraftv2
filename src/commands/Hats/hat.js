/**
 * Created by macdja38 on 2016-11-13.
 */

var https = new require('https');

var request = require('request').defaults({encoding: null});

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

    request.get(avatarURL, (err, res, image)=> {
      console.log(image);
      console.dir(image);
      let data = Buffer.from(image);
      console.log(data);
      console.dir(data);
      let img = new Image;
      img.src = data;
      process.nextTick(() => {
        let canvas = new Canvas(128, 128), ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 128, 128);
      })
    });
  }

  init() {
    console.log("Got init");
  }
}

export default Alerts;