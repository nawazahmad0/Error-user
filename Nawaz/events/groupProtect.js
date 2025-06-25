const fs = require("fs");
const path = __dirname + "/../../../data/groupProtect.json";
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
  version: "2.0",
  credits: "Nawaz Boss",
  description: "Protect group info"
};

module.exports.run = async function ({ api, event }) {
  const threadID = event.threadID;
  let data = {};
  try {
    data = JSON.parse(fs.readFileSync(path));
  } catch (e) {
    fs.writeFileSync(path, "{}");
    data = {};
  }

  if (!data[threadID]) return;

  try {
    const info = await api.getThreadInfo(threadID);
    switch (event.logMessageType) {
      case "log:thread-name":
        await api.setTitle(info.threadName, threadID);
        return api.sendMessage("🚫 Group name change is blocked!", threadID);

      case "log:thread-image":
        return api.sendMessage("🚫 Group image change is blocked!", threadID);

      case "log:user-nickname":
        const userID = event.logMessageData.participant_id;
        const oldNick = info.nicknames?.[userID] || "";
        await api.changeNickname(oldNick, threadID, userID);
        return api.sendMessage("🚫 Nickname change is blocked!", threadID);

      case "log:thread-color":
        await api.changeThreadColor(info.color, threadID);
        return api.sendMessage("🚫 Theme change is blocked!", threadID);

      case "log:thread-emoji":
        await api.changeThreadEmoji(info.emoji, threadID);
        return api.sendMessage("🚫 Emoji change is blocked!", threadID);
    }
  } catch (err) {
    console.error("❌ Error in groupProtect:", err);
  }
};