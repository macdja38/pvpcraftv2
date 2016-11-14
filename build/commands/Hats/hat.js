'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Alerts = undefined;

var _Command = require('../Command');

var _Command2 = _interopRequireDefault(_Command);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

/**
 * Created by macdja38 on 2016-11-13.
 */

var https = new require('https');

var request = require('request').defaults({ encoding: null });

var Canvas = require('canvas'),
    Image = Canvas.Image;

let requirements = ["Warframe"];

class Alerts extends _Command2.default {
  constructor(...args) {
    super(...args, {
      aliases: ['hat'],
      module: 'warframe',
      nodes: ['warframe.alert'],
      description: "Display the current warframe alerts.",
      usage: []
    });
  }

  exec(command) {
    return _asyncToGenerator(function* () {
      let msg = command.message;
      let avatarURL = msg.author.avatarURL;

      request.get(avatarURL, function (err, res, image) {
        console.log(image);
        console.dir(image);
        let data = Buffer.from(image);
        console.log(data);
        console.dir(data);
        let img = new Image();
        img.src = data;
        process.nextTick(function () {
          let canvas = new Canvas(128, 128),
              ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, 128, 128);
        });
      });
    })();
  }

  init() {
    console.log("Got init");
  }
}

exports.Alerts = Alerts;
exports.default = Alerts;
//# sourceMappingURL=hat.js.map