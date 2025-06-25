const fs = require("fs");
const path = __dirname + "/../data/groupProtect.json";

if (!fs.existsSync(path)) fs.writeFileSync(path, "{}");
let protectStatus = JSON.parse(fs.readFileSync(path));

module.exports.config = {
  name: "groupProtect",
  version: "1.0",
  credits: "Nawaz Boss",
};

module.exports.handleEvent = async function ({ api, event }) {
  const threadID = event.threadID;

  // Protection check
  if (!protectStatus[threadID]) return;

  try {
    const info = await api.getThreadInfo(threadID);

    switch (event.logMessageType) {
      case "log:thread-name":
        api.setTitle(info.threadName, threadID);
        api.sendMessage("🚫 Group name change blocked!", threadID);
        break;

      case "log:thread-emoji":
        api.changeThreadEmoji(info.emoji, threadID);
        api.sendMessage("🚫 Emoji change blocked!", threadID);
        break;

      case "log:thread-color":
        api.changeThreadColor(info.color, threadID);
        api.sendMessage("🚫 Theme change blocked!", threadID);
        break;

      case "log:thread-image":
        api.sendMessage("🚫 Group photo change blocked!", threadID);
        break;

      case "log:user-nickname":
        const { participantID } = event.logMessageData;
        const oldNick = info.nicknames[participantID] || "";
        api.changeNickname(oldNick, threadID, participantID);
        api.sendMessage("🚫 Nickname change blocked!", threadID);
        break;
    }
  } catch (err) {
    console.log("❌ [groupProtect ERROR]", err.message);
    api.sendMessage("⚠️ Error in group protection system.", threadID);
  }
}; 
