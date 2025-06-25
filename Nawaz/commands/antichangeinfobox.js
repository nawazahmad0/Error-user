const fs = require("fs-extra");
const path = __dirname + "/../../data/groupProtect.json";

module.exports.config = {
  name: "groupProtect",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "Nawaz Boss",
  description: "Enable or disable group protection",
  commandCategory: "group",
  usages: "[on/off]",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  const threadID = event.threadID;
  let protectList = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : {};

  if (args[0] === "on") {
    protectList[threadID] = true;
    fs.writeFileSync(path, JSON.stringify(protectList, null, 2));
    return api.sendMessage("✅ Group protection ENABLED!", threadID);
  } else if (args[0] === "off") {
    delete protectList[threadID];
    fs.writeFileSync(path, JSON.stringify(protectList, null, 2));
    return api.sendMessage("❌ Group protection DISABLED!", threadID);
  } else {
    return api.sendMessage("🛡 Use: groupProtect on/off", threadID);
  }
};
