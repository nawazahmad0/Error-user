const fs = require("fs");
const path = __dirname + "/../../../data/groupProtect.json";

// Ensure file exists
if (!fs.existsSync(path)) fs.writeFileSync(path, "{}");

module.exports.config = {
  name: "groupProtect",
  eventType: [
    "log:thread-name",
    "log:thread-image",
    "log:user-nickname",
    "log:thread-color",
    "log:thread-emoji"
  ],
  version: "1.0",
  credits: "Nawaz Boss",
  description: "Block changes to group info"
};

module.exports.run = async function ({ api, event }) {
  const threadID = event.threadID;
  const data = JSON.parse(fs.readFileSync(path));

  if (!data[threadID]) return; // If protection not enabled for this group

  try {
    const info = await api.getThreadInfo(threadID);

    switch (event.logMessageType) {
      case "log:thread-name":
        await api.setTitle(info.threadName, threadID);
        return api.sendMessage("🚫 Group name change blocked!", threadID);

      case "log:thread-image":
        return api.sendMessage("🚫 Group photo change blocked!", threadID);

      case "log:user-nickname":
        const { participantID } = event.logMessageData;
        const oldNick = info.nicknames[participantID] || "";
        await api.changeNickname(oldNick, threadID, participantID);
        return api.sendMessage("🚫 Nickname change blocked!", threadID);

      case "log:thread-color":
        await api.changeThreadColor(info.color, threadID);
        return api.sendMessage("🚫 Theme change blocked!", threadID);

      case "log:thread-emoji":
        await api.changeThreadEmoji(info.emoji, threadID);
        return api.sendMessage("🚫 Emoji change blocked!", threadID);
    }
  } catch (err) {
    console.log("[GroupProtect Error]:", err);
    return api.sendMessage("❌ GroupProtect error: " + err.message, threadID);
  }
};