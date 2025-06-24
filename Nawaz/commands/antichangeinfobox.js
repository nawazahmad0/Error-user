const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "antichangeinfobox",
    version: "1.0",
    author: "Nawaz Boss",
    role: 0,
    shortDescription: "Lock group info",
    longDescription: "Prevent group avatar, name, emoji, theme, or nickname from being changed",
    category: "group",
    guide: {
      en: "{pn} [avt|name|emoji|theme|nickname] [on|off]"
    }
  },

  onStart: async function ({ api, event, args, threadsData, message }) {
    const { threadID } = event;
    const type = args[0];
    const toggle = args[1];

    if (!["avt", "name", "emoji", "theme", "nickname"].includes(type) || !["on", "off"].includes(toggle)) {
      return message.reply(`❌ Usage:\n${global.GoatBot.config.prefix}antichangeinfobox [avt|name|emoji|theme|nickname] [on|off]`);
    }

    let data = await threadsData.get(threadID, "data.antiChangeInfoBox") || {};

    if (toggle === "off") {
      delete data[type];
    } else {
      const info = await api.getThreadInfo(threadID);
      switch (type) {
        case "avt":
          if (!info.imageSrc) return message.reply("⚠️ No group avatar found.");
          data.avt = info.imageSrc;
          break;
        case "name":
          data.name = info.threadName;
          break;
        case "emoji":
          data.emoji = info.emoji;
          break;
        case "theme":
          data.theme = info.color;
          break;
        case "nickname":
          data.nickname = {};
          for (const user of info.userInfo) {
            data.nickname[user.id] = info.nicknames?.[user.id] || "";
          }
          break;
      }
    }

    await threadsData.set(threadID, data, "data.antiChangeInfoBox");
    return message.reply(`✅ Anti-change for "${type}" set to ${toggle}.`);
  },

  onEvent: async function ({ api, event, threadsData, role }) {
    const { threadID, author, logMessageType, logMessageData } = event;
    if (role >= 1 || author == api.getCurrentUserID()) return;

    const data = await threadsData.get(threadID, "data.antiChangeInfoBox") || {};

    switch (logMessageType) {
      case "log:thread-image":
        if (data.avt) {
          try {
            const res = await axios.get(data.avt, { responseType: "stream" });
            await api.changeGroupImage(res.data, threadID);
            api.sendMessage("🔒 Group avatar change is locked.", threadID);
          } catch (err) {}
        }
        break;

      case "log:thread-name":
        if (data.name) {
          api.setTitle(data.name, threadID);
          api.sendMessage("🔒 Group name change is locked.", threadID);
        }
        break;

      case "log:thread-icon":
        if (data.emoji) {
          api.changeThreadEmoji(data.emoji, threadID);
          api.sendMessage("🔒 Emoji change is locked.", threadID);
        }
        break;

      case "log:thread-color":
        if (data.theme) {
          api.changeThreadColor(data.theme, threadID);
          api.sendMessage("🔒 Theme color change is locked.", threadID);
        }
        break;

      case "log:user-nickname":
        if (data.nickname) {
          const { participant_id } = logMessageData;
          const oldNick = data.nickname[participant_id] || "";
          api.changeNickname(oldNick, threadID, participant_id);
          api.sendMessage("🔒 Nickname change is locked.", threadID);
        }
        break;
    }
  }
};