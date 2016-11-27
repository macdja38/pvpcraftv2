/**
 * Created by macdja38 on 2016-11-26.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.baseDB = undefined;

require("babel-core/register");

require("source-map-support/register");

class baseDB {
  constructor(r) {
    this.r = r;
  }

  ensureTable(tableName, tableOptions) {
    let table = this.r.table(tableName);
    return this.r.tableList().contains(tableName).branch(table, this.r.tableCreate(tableName, tableOptions)).run();
  }
}

exports.baseDB = baseDB;
exports.default = baseDB;
//# sourceMappingURL=BaseDB.js.map