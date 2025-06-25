const fs = require("fs");
const path = __dirname + "/../cache/groupLock.json";

module.exports.config = {
  name: "antichangeinfobox",
  version: "1.0.1",
  hasPermssion: 1,
  credits: "Nawaz Boss",
  description: "Lock group name and avatar (on/off)",
  commandCategory: "group",
  usages: "[on/off]",
  cooldowns: 5,
};

module.exports.run = async ({ api, event, args }) => {
  if (!fs.existsSync(path)) fs.writeFileSync(path, "{}");
  let data = JSON.parse(fs.readFileSync(path));
  const threadID = event.threadID;

  if (!args[0]) return api.sendMessage("❌ Usage: +antichangeinfobox [on/off]", threadID);

  if (args[0].toLowerCase() === "off") {
    if (!data[threadID]) return api.sendMessage("ℹ️ Group lock is not enabled.", threadID);
    delete data[threadID];
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    return api.sendMessage("✅ Group lock disabled.", threadID);
  }

  // Enable lock
  try {
    const info = await api.getThreadInfo(threadID);
    data[threadID] = {
      name: info.threadName,
      imageSrc: info.imageSrc || null,
    };
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    return api.sendMessage("🔒 Group name & avatar locked successfully!", threadID);
  } catch (e) {
    return api.sendMessage("❌ Error fetching thread info: " + e.message, threadID);
  }
};