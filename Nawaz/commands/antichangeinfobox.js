const fs = require("fs");
const protectData = __dirname + "/../data/groupProtect.json";

if (!fs.existsSync(protectData)) fs.writeFileSync(protectData, "{}");

let protectStatus = JSON.parse(fs.readFileSync(protectData));

module.exports.config = {
  name: "groupProtect",
  version: "1.1.0",
  hasPermssion: 1,
  credits: "Nawaz Boss",
  description: "Protect group from changes (name, emoji, color, nicknames, avatar)",
  commandCategory: "group",
  usages: "[on/off]",
  cooldowns: 5
};

module.exports.handleEvent = async function({ api, event }) {
  const threadID = event.threadID;
  if (!protectStatus[threadID]) return;

  const threadInfo = await api.getThreadInfo(threadID);

  switch (event.logMessageType) {
    case "log:thread-name":
      api.setTitle(threadInfo.threadName, threadID);
      api.sendMessage("❌ Group name is protected!", threadID);
      break;

    case "log:thread-emoji":
      api.changeThreadEmoji(threadInfo.emoji, threadID);
      api.sendMessage("❌ Group emoji is protected!", threadID);
      break;

    case "log:thread-color":
      api.changeThreadColor(threadInfo.color, threadID);
      api.sendMessage("❌ Group theme is protected!", threadID);
      break;

    case "log:thread-image":
      api.sendMessage("❌ Group avatar change is not allowed!", threadID);
      break;

    case "log:user-nickname":
      const { participantID } = event.logMessageData;
      const oldNick = threadInfo.nicknames[participantID] || "";
      api.changeNickname(oldNick, threadID, participantID);
      api.sendMessage("❌ Nickname change is blocked!", threadID);
      break;
  }
};

module.exports.run = async function({ api, event, args }) {
  const threadID = event.threadID;

  if (args[0] === "on") {
    protectStatus[threadID] = true;
    fs.writeFileSync(protectData, JSON.stringify(protectStatus, null, 2));
    return api.sendMessage("✅ Group protection is now ENABLED!", threadID);
  }

  if (args[0] === "off") {
    delete protectStatus[threadID];
    fs.writeFileSync(protectData, JSON.stringify(protectStatus, null, 2));
    return api.sendMessage("❌ Group protection is now DISABLED!", threadID);
  }

  return api.sendMessage("ℹ️ Use: groupProtect on/off", threadID);
};