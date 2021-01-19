/*global chrome*/

import BlockedUrlService from "./blocked.js";
// const BlockedUrlService = require("./blocked");

// TODO: Refactor this

const run = async () => {
  const blockedUrlService = new BlockedUrlService();
  blockedUrlService.initBlockList();
}

export default run();