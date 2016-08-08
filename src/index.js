/**
 * Created by macdja38 on 2016-08-07.
 */

import "babel-polyfill";
import "source-map-support/register";
import Pvpcraft from "./pvpcraft";
import Discordie from "discordie";
var client = new Discordie();
var pvpcraft = new Pvpcraft();

function* jsRocksIsAwesome() {
  yield "JS Rocks is Awesome";
  yield "JS Rocks says JavaScript Rocks";
  return "because JavaScript really rocks";
}

var jsRocks = jsRocksIsAwesome();

/* eslint-disable */
console.log(jsRocks.next());
console.log(jsRocks.next());
console.log(jsRocks.next());
/* eslint-enable */

client.connect({
  token: "MjExNzc2MjUwNTQ3NjY2OTU2.CoiPhw.NZfpyOkDx97xDOwRW2RqQOCRkTs",
  reconnect: true
});

client.Dispatcher.on("GATEWAY_READY", e => {
  /* eslint-disable */
  console.log(e);
  console.log(`Connected as: ${client.User.username}`);
  /* eslint-enable */
});

client.Dispatcher.on("MESSAGE_CREATE", e => {
  if (e.message.content == "ping")
    e.message.channel.sendMessage(pvpcraft.inc());
});