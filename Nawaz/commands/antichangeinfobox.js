const fs = require("fs");
const path = __dirname + "/../cache/groupLock.json";

module.exports.config = {
  name: "antichangeinfobox",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "Nawaz Boss",
  description: "Lock group name and avatar",
  commandCategory: "group",
  usages: "[on/off]",
  cooldowns: 5,
};

module.exports.run = async ({ api, event, args }) => {
  if (!fs.existsSync(path)) fs.writeFileSync(path, "{}");
  let data = JSON.parse(fs.readFileSync(path));
  const threadID = event.threadID;

  if (args[0] === "off") {
    delete data[threadID];
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    return api.sendMessage("✅ Group lock disabled.", threadID);
  }

  const info = await api.getThreadInfo(threadID);
  data[threadID] = {
    name: info.threadName,
    imageSrc: info.imageSrc || null,
  };

  fs.writeFileSync(path, JSON.stringify(data, null, 2));
  return api.sendMessage("🔒 Group name & avatar locked successfully!", threadID);
};