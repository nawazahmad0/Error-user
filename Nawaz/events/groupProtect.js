const fs = require("fs"); const path = __dirname + "/../../../data/groupProtect.json";

// Ensure file exists if (!fs.existsSync(path)) fs.writeFileSync(path, "{}", "utf8");

module.exports.config = { name: "groupProtect", eventType: [ "log:thread-name", "log:thread-image", "log:user-nickname", "log:thread-color", "log:thread-emoji" ], version: "1.0", credits: "Nawaz Boss", description: "Block changes to group info" };

module.exports.run = async function ({ api, event }) { const threadID = event.threadID; let data;

try { data = JSON.parse(fs.readFileSync(path)); } catch (e) { data = {}; }

if (!data[threadID]) return;

try { const info = await api.getThreadInfo(threadID); const logType = event.logMessageType;

switch (logType) {
  case "log:thread-name":
    await api.setTitle(info.threadName, threadID);
    return api.sendMessage("🚫 Group name change blocked!", threadID);

  case "log:thread-image":
    return api.sendMessage("🚫 Group image change blocked!", threadID);

  case "log:user-nickname":
    const uid = event.logMessageData.participant_id;
    const oldNick = info.nicknames?.[uid] || "";
    await api.changeNickname(oldNick, threadID, uid);
    return api.sendMessage("🚫 Nickname change blocked!", threadID);

  case "log:thread-color":
    await api.changeThreadColor(info.color, threadID);
    return api.sendMessage("🚫 Theme color change blocked!", threadID);

  case "log:thread-emoji":
    await api.changeThreadEmoji(info.emoji, threadID);
    return api.sendMessage("🚫 Emoji change blocked!", threadID);
}

} catch (err) { console.error("[GroupProtect Error]:", err); return api.sendMessage("❌ GroupProtect error: " + err.message, threadID); } };

