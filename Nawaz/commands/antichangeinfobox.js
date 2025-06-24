const fs = require("fs-extra");
const axios = require("axios");

module.exports = {
  config: {
    name: "antichangeinfobox",
    version: "1.0",
    author: "Converted by Nawaz Boss",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Prevent users from changing group info"
    },
    longDescription: {
      en: "Enable/disable anti-change group info (avatar, name, emoji, theme, nickname)"
    },
    category: "group",
    guide: {
      en: "{pn} [avt|name|emoji|theme|nickname] [on|off]"
    }
  },

  onStart: async function ({ api, event, args, threadsData, getLang, message }) {
    const { threadID } = event;
    const type = args[0];
    const toggle = args[1];

    if (!["avt", "name", "emoji", "theme", "nickname"].includes(type) || !["on", "off"].includes(toggle)) {
      return message.reply("⚠️ Usage:\n{pn} [avt|name|emoji|theme|nickname] [on|off]");
    }

    let data = await threadsData.get(threadID, "data.antiChangeInfoBox", {}) || {};

    if (toggle === "off") {
      delete data[type];
    } else {
      switch (type) {
        case "avt":
          if (!event.imageSrc) return message.reply("❌ No avatar found for this group.");
          data.avt = event.imageSrc;
          break;
        case "name":
          data.name = await api.getThreadInfo(threadID).then(info => info.threadName);
          break;
        case "emoji":
          data.emoji = await api.getThreadInfo(threadID).then(info => info.emoji);
          break;
        case "theme":
          data.theme = await api.getThreadInfo(threadID).then(info => info.color);
          break;
        case "nickname":
          const info = await api.getThreadInfo(threadID);
          data.nickname = {};
          for (const mem of info.userInfo) {
            data.nickname[mem.id] = info.nicknames?.[mem.id] || "";
          }
          break;
      }
    }

    await threadsData.set(threadID, data, "data.antiChangeInfoBox");
    return message.reply(`✅ Anti-change for "${type}" has been turned ${toggle}.`);
  },

  onEvent: async function ({ api, event, threadsData, role }) {
    const { threadID, author, logMessageType, logMessageData } = event;
    const data = await threadsData.get(threadID, "data.antiChangeInfoBox", {});

    // skip if bot or admin
    if (role >= 1 || author == api.getCurrentUserID()) return;

    switch (logMessageType) {
      case "log:thread-image":
        if (data.avt) {
          try {
            const res = await axios.get(data.avt, { responseType: "stream" });
            api.changeGroupImage(res.data, threadID);
            api.sendMessage("🔒 Avatar change is locked in this group!", threadID);
          } catch (e) {}
        }
        break;

      case "log:thread-name":
        if (data.name) {
          api.setTitle(data.name, threadID);
          api.sendMessage("🔒 Group name change is locked!", threadID);
        }
        break;

      case "log:thread-icon":
        if (data.emoji) {
          api.changeThreadEmoji(data.emoji, threadID);
          api.sendMessage("🔒 Emoji change is locked!", threadID);
        }
        break;

      case "log:thread-color":
        if (data.theme) {
          api.changeThreadColor(data.theme, threadID);
          api.sendMessage("🔒 Theme color change is locked!", threadID);
        }
        break;

      case "log:user-nickname":
        if (data.nickname) {
          const { participant_id } = logMessageData;
          const nick = data.nickname?.[participant_id] || "";
          api.changeNickname(nick, threadID, participant_id);
          api.sendMessage("🔒 Nickname change is locked!", threadID);
        }
        break;
    }
  }
};