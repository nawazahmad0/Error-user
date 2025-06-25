module.exports.config = {
  name: "groupProtect",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "Nawaz Boss",
  description: "Protects group from changes in name, emoji, avatar, theme, and nicknames.",
  commandCategory: "group",
  usages: "[on/off]",
  cooldowns: 3
};

let protectStatus = {};

module.exports.handleEvent = async ({ api, event }) => {
  const threadID = event.threadID;

  if (!protectStatus[threadID]) return;

  try {
    const thread = await api.getThreadInfo(threadID);

    // Check for name change
    if (event.logMessageType == "log:thread-name") {
      await api.setTitle(thread.threadName, threadID);
      api.sendMessage("⚠️ Group name change is protected!", threadID);
    }

    // Check for emoji change
    if (event.logMessageType == "log:thread-emoji") {
      await api.changeThreadEmoji(thread.emoji, threadID);
      api.sendMessage("⚠️ Group emoji change is protected!", threadID);
    }

    // Check for theme change
    if (event.logMessageType == "log:thread-color") {
      await api.changeThreadColor(thread.color, threadID);
      api.sendMessage("⚠️ Group theme change is protected!", threadID);
    }

    // Check for avatar change
    if (event.logMessageType == "log:thread-image") {
      await api.sendMessage("⚠️ Group avatar change is protected! Please don't change it.", threadID);
    }

    // Check for nickname change
    if (event.logMessageType == "log:user-nickname") {
      const { participantID } = event.logMessageData;
      const oldNick = thread.nicknames[participantID] || "";
      await api.changeNickname(oldNick, threadID, participantID);
      api.sendMessage("⚠️ Nickname change is not allowed in this group!", threadID);
    }

  } catch (err) {
    console.log(err);
  }
};

module.exports.run = async ({ api, event, args }) => {
  const threadID = event.threadID;

  if (args[0] === "on") {
    protectStatus[threadID] = true;
    return api.sendMessage("✅ Group protection is now ENABLED!", threadID);
  }

  if (args[0] === "off") {
    delete protectStatus[threadID];
    return api.sendMessage("❌ Group protection is now DISABLED!", threadID);
  }

  return api.sendMessage("⚙️ Usage: groupProtect on/off", threadID);
};