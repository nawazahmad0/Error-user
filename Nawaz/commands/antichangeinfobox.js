
const fs = require("fs");
const path = __dirname + "/../data/groupProtect.json";

module.exports = {
  config: {
    name: "groupProtect",
    version: "1.0.0",
    hasPermission: 1,
    credits: "Nawaz Boss",
    description: "Toggle group anti-change protection",
    commandCategory: "group",
    usages: "[on/off]",
    cooldowns: 5
  },

  run: async function({ api, event, args }) {
    const threadID = event.threadID;
    let protectData = {};

    if (fs.existsSync(path)) {
      protectData = JSON.parse(fs.readFileSync(path));
    }

    if (args[0] === "on") {
      protectData[threadID] = true;
      fs.writeFileSync(path, JSON.stringify(protectData, null, 2));
      return api.sendMessage("✅ Group protection ENABLED!", threadID);
    } else if (args[0] === "off") {
      delete protectData[threadID];
      fs.writeFileSync(path, JSON.stringify(protectData, null, 2));
      return api.sendMessage("❌ Group protection DISABLED!", threadID);
    } else {
      return api.sendMessage("⚠️ Usage: groupProtect [on/off]", threadID);
    }
  }
};