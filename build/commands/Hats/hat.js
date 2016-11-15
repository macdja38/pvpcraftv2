'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Alerts = undefined;

var _Command = require('../Command');

var _Command2 = _interopRequireDefault(_Command);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Created by macdja38 on 2016-11-13.
 */

var https = new require('https');

var request = require('request').defaults({ encoding: null });

var fs = require('fs');

var Canvas = require('canvas'),
    Image = Canvas.Image;

let requirements = ["Warframe"];

class Alerts extends _Command2.default {
  constructor(...args) {
    super(...args, {
      aliases: ["hat"],
      module: "warframe",
      nodes: ["warframe.alert"],
      description: "Display the current warframe alerts.",
      usage: []
    });
  }

  exec(command) {
    return _asyncToGenerator(function* () {
      let msg = command.message;
      let avatarURL = msg.author.avatarURL;

      let imgPromise;
      if (avatarURL) {
        imgPromise = getImageFromUrl(avatarURL);
      } else {
        imgPromise = getImageFromUrl("https://canary.discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png");
      }
      let hatPromise = getImageFromFile('./resources/hat.png');

      let img = yield imgPromise;
      let hatImg = yield hatPromise;

      process.nextTick(function () {
        try {
          let canvas = new Canvas(128, 128),
              ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, 128, 128);
          ctx.rotate(30 / 180);
          ctx.drawImage(hatImg, -70, -55, 300, 130);
          let stream = canvas.pngStream();
          let buffers = [];
          stream.on('data', function (buffer) {
            buffers.push(buffer);
          });
          stream.on('end', function () {
            let buffer = Buffer.concat(buffers);
            command.sendMessage("Here is your hat!", { name: "hat.png", file: buffer });
          });
        } catch (errors) {
          command.sendMessage(`Sorry the error ${ errors } occurred while processing your command, make sure you have a non-default avatar`);
          console.error("error", errors);
        }
      });
    })();
  }

  init() {
    console.log("Got init");
  }
}

exports.Alerts = Alerts;
exports.default = Alerts;


function getImageFromFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) return reject(err);
      let img = new Image();
      img.src = data;
      resolve(img);
    });
  });
}

function getImageFromUrl(url) {
  return new Promise((resolve, reject) => {
    request.get(url, (err, res, image) => {
      if (err) return reject(err);
      let data = Buffer.from(image);
      let img = new Image();
      img.src = data;
      resolve(img);
    });
  });
}
//# sourceMappingURL=hat.js.map