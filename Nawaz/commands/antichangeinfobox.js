const fs = require("fs");
const path = __dirname + "/../data/groupProtect.json";

// Ensure file exists
if (!fs.existsSync(path)) fs.writeFileSync(path, "{}");

module.exports.config = {
  name: "antichangeinfobox",
  version: "1.0",
  hasPermssion: 1,
  credits: "Nawaz Boss",
  description: "Block group info change like name, emoji, theme, nickname, image.",
  commandCategory: "group",
  usages: "antichangeinfobox on/off",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const threadID = event.threadID;
  const data = JSON.parse(fs.readFileSync(path));

  if (args[0] === "on") {
    data[threadID] = true;
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    return api.sendMessage("✅ Anti-ChangeInfoBox ENABLED in this group!", threadID);
  }

  if (args[0] === "off") {
    delete data[threadID];
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    return api.sendMessage("❌ Anti-ChangeInfoBox DISABLED in this group!", threadID);
  }

  return api.sendMessage("⚠️ Use: antichangeinfobox on/off", threadID);
};