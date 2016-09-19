/**
 * Created by macdja38 on 2016-08-07.
 */

import "babel-core/register";
import "source-map-support/register";
import Pvpcraft from "./pvpcraft";
import Discordie from "discordie";
import Command from "./Types/command";
import CommandParser from "./lib/commandParser";
//import Warframe from "./Warframe";
var client = new Discordie();
var pvpcraft = new Pvpcraft();
var commandParser = new CommandParser({client});
import libHandler from "./libHandler";

libHandler();

function* jsRocksIsAwesome() {
  yield "JS Rocks is Awesome";
  yield "JS Rocks says JavaScript Rocks";
  return "because JavaScript really rocks";
}

async function Login() {
  return await client.connect({
    token: "",
    reconnect: true
  });
}

var jsRocks = jsRocksIsAwesome();

/* eslint-disable */
console.log(jsRocks.next());
console.log(jsRocks.next());
console.log(jsRocks.next());
/* eslint-enable */

var something = Login();
console.log(something); //eslint-disable-line no-console


client.Dispatcher.on("GATEWAY_READY", e => {
  /* eslint-disable */
  console.log(e);
  console.log(`Connected as: ${client.User.username}`);
  /* eslint-enable */
});

client.Dispatcher.on("MESSAGE_CREATE", e => {
  let command = new Command(commandParser.parse(e));
  if (command.command == "ping")
    pvpcraft.command(command);
});

client.Dispatcher.on("GUILD_ROLE_UPDATE", e => {
  console.log(e); //eslint-disable-line no-console
  const data = e.getChanges();
  console.log(data.before); //eslint-disable-line no-console
  console.log(data.after); //eslint-disable-line no-console
});