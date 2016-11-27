"use strict";
import "babel-core/register";
import "source-map-support/register";

import modules from "../modules";

export class ModuleLoader {
  constructor(e) {
    this._modules = [];
    this._e = e;
  }

  loadAll() {
    this._modules = modules().map(M => new M(this._e));
  }

  get modules() {
    return this._modules;
  }
}


export default ModuleLoader;