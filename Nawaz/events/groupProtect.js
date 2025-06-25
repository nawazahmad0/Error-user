
const fs = require("fs");
const path = __dirname + "/../data/groupProtect.json";

module.exports = {
  config: {
    name: "groupProtect",
    eventType: ["log:thread-name", "log:thread-image", "log:thread-color", "log:thread-emoji", "log:thread-nickname"],
    version: "1.0.0",
    credits: "Nawaz Boss"
  },

  run: async function({ api, event }) {
    const threadID = event.threadID;
    if (!fs.existsSync(path)) return;
    const protectData = JSON.parse(fs.readFileSync(path));

    if (!protectData[threadID]) return;

    switch (event.logMessageType) {
      case "log:thread-name":
        api.sendMessage("🚫 Group name change is protected!", threadID);
        break;
      case "log:thread-image":
        api.sendMessage("🚫 Group image change is protected!", threadID);
        break;
      case "log:thread-color":
        api.sendMessage("🚫 Group color change is protected!", threadID);
        break;
      case "log:thread-emoji":
        api.sendMessage("🚫 Group emoji change is protected!", threadID);
        break;
      case "log:thread-nickname":
        api.sendMessage("🚫 Nickname change is protected!", threadID);
        break;
    }
  }
};