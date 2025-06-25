const fs = require("fs");
const path = __dirname + "/../data/groupProtect.json";

// अगर data फोल्डर या JSON नहीं बना है तो बना दो
if (!fs.existsSync(path)) fs.writeFileSync(path, "{}");

let protectStatus = JSON.parse(fs.readFileSync(path));

module.exports.config = {
  name: "groupProtect",
  version: "1.0",
  hasPermssion: 1,
  credits: "Nawaz Boss",
  description: "Protect group settings like name, emoji, theme, nickname",
  commandCategory: "group",
  usages: "groupProtect on/off",
  cooldowns: 5,
};

module.exports.handleEvent = async function ({ api, event }) {
  const threadID = event.threadID;
  if (!protectStatus[threadID]) return;

  try {
    const info = await api.getThreadInfo(threadID);
    switch (event.logMessageType) {
      case "log:thread-name":
        api.setTitle(info.threadName, threadID);
        api.sendMessage("❌ Group name change is blocked!", threadID);
        break;

      case "log:thread-emoji":
        api.changeThreadEmoji(info.emoji, threadID);
        api.sendMessage("❌ Group emoji change is blocked!", threadID);
        break;

      case "log:thread-color":
        api.changeThreadColor(info.color, threadID);
        api.sendMessage("❌ Group theme change is blocked!", threadID);
        break;

      case "log:thread-image":
        api.sendMessage("⚠️ Avatar change detected! Please avoid it.", threadID);
        break;

      case "log:user-nickname":
        const { participantID } = event.logMessageData;
        const oldNick = info.nicknames[participantID] || "";
        api.changeNickname(oldNick, threadID, participantID);
        api.sendMessage("❌ Nickname changes are not allowed!", threadID);
        break;
    }
  } catch (e) {
    console.log("❌ Error in groupProtect:", e);
  }
};

module.exports.run = async function ({ api, event, args }) {
  const threadID = event.threadID;

  if (args[0] === "on") {
    protectStatus[threadID] = true;
    fs.writeFileSync(path, JSON.stringify(protectStatus, null, 2));
    return api.sendMessage("✅ Group protection ENABLED!", threadID);
  }

  if (args[0] === "off") {
    delete protectStatus[threadID];
    fs.writeFileSync(path, JSON.stringify(protectStatus, null, 2));
    return api.sendMessage("❌ Group protection DISABLED!", threadID);
  }

  return api.sendMessage("📌 Use: groupProtect on/off", threadID);
};