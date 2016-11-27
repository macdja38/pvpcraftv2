/**
 * Created by macdja38 on 2016-11-13.
 */
"use strict";
import "babel-core/register";
import "source-map-support/register";

export const clean = function clean(text) {
  if (typeof(text) === "string") {
    return text.replace("``", "`" + String.fromCharCode(8203) + "`").replace("//", "/" + String.fromCharCode(8203) + "/");
  }
  else {
    return text;
  }
};

export default {
  clean,
}