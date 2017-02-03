/**
 * Created by macdja38 on 2016-09-18.
 */
"use strict";
import "babel-core/register";
import "source-map-support/register";

import * as fs from "fs";
import * as path from "path";

export default class ConfigJSON {
  /**
   * Instantiates a config object.
   * @param fileName
   */
  constructor({fileName}) {
    this._fileName = fileName;
    this._filePath = path.join(__dirname, `../../config/config/${this._fileName}.json`);
    this._fileExamplePath = path.join(__dirname, `../../config/example/${this._fileName}.example.json`);
    this.reload();
  }

  reload() {
    try {
      var rawFile = fs.readFileSync(this._filePath, "utf8")
    } catch (err) {
      if (err.code === "ENOENT") {
        console.error(`Config file ${this._fileName} not found in ${this._filePath} copying default from ${this._fileExamplePath} Please edit it to your liking.`);
        fs.writeFileSync(this._filePath, fs.readFileSync(this._fileExamplePath, "utf8"));
        console.error(`Config file ${this._fileName} was copied to ${this._filePath}, please edit it to your liking.`);
        throw new Error(`Missing ${this._fileName}.json`)
      }
    }

    try {
      this._data = JSON.parse(rawFile);
    } catch (err) {
      throw new Error(`Invalid JSON in ${this.name}.json`)
    }
  }

  /**
   * get a key from the config. will accept a fallBack value or throw if failThrow is defined.
   * @param key
   * @param fallBack
   * @param failThrow
   * @returns {*}
   */
  get(key, {fallBack, failThrow}) {
    if (failThrow) failThrow = `Error Property ${key} does not exist on ${this._fileName}`;
    let keys = key.split(".");
    return this._recursiveGet(keys, this._data, {fallBack, failThrow});
  }

  _recursiveGet(keys, data, {fallback, failThrow}) {
    if (keys.length === 0) {
      return data;
    }
    let key = keys.shift();
    if (typeof data === "object" && data !== null && data.hasOwnProperty(key)) {
      return this._recursiveGet(keys, data[key], {fallback, failThrow});
    } else {
      if (fallback) return fallback;
      if (failThrow) throw failThrow;
    }
  }
}