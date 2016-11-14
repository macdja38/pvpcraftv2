"use strict";

import modules from "../modules";

export class ModuleLoader {
  constructor() {
    this._modules = [];
  }

  loadAll() {
    console.log("modules", modules());
  }
}

export default ModuleLoader;