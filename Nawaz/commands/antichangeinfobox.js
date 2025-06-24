const axios = require("axios");

module.exports = {
  config: {
    name: "antichangeinfobox",
    version: "1.0",
    author: "Nawaz Boss",
    role: 0,
    shortDescription: { en: "Lock group info changes" },
    longDescription: { en: "Prevent group avatar, name, emoji, theme, and nicknames from being changed" },
    category: "group",
    guide: { en: "{pn} [avt|name|emoji|theme|nickname] [on|off]" }
  },

  onStart: async function ({ api, event, args, threadsData, message }) {
    const { threadID } = event;
    const type = args[0];
    const toggle = args[1];

    if (!["avt", "name", "emoji", "theme", "nickname"].includes(type) || !["on", "off"].includes(toggle)) {
      return message.reply("📌 सही उपयोग:\n{pn} [avt|name|emoji|theme|nickname] [on|off]");
    }

    const info = await api.getThreadInfo(threadID);
    let settings = await threadsData.get(threadID, "data.antiChangeInfoBox") || {};

    if (toggle === "off") {
      delete settings[type];
    } else {
      switch (type) {
        case "avt":
          if (!info.imageSrc) return message.reply("❌ ग्रुप में avatar नहीं है।");
          settings.avt = info.imageSrc;
          break;
        case "name":
          settings.name = info.threadName;
          break;
        case "emoji":
          settings.emoji = info.emoji;
          break;
        case "theme":
          settings.theme = info.color;
          break;
        case "nickname":
          const nicks = {};
          for (const user of info.userInfo) {
            nicks[user.id] = info.nicknames?.[user.id] || "";
          }
          settings.nickname = nicks;
          break;
      }
    }

    await threadsData.set(threadID, settings, "data.antiChangeInfoBox");
    return message.reply(`✅ "${type}" का लॉक "${toggle}" कर दिया गया है।`);
  },

  onEvent: async function ({ api, event, threadsData }) {
    const { threadID, author, logMessageType, logMessageData } = event;

    // खुद के changes को ignore करो
    if (author === api.getCurrentUserID()) return;

    const settings = await threadsData.get(threadID, "data.antiChangeInfoBox");
    if (!settings) return;

    switch (logMessageType) {
      case "log:thread-image":
        if (settings.avt) {
          try {
            const res = await axios.get(settings.avt, { responseType: "stream" });
            api.changeGroupImage(res.data, threadID);
            api.sendMessage("🔒 ग्रुप का avatar लॉक है!", threadID);
          } catch (err) {
            console.error("❌ Avatar reset error:", err.message);
          }
        }
        break;

      case "log:thread-name":
        if (settings.name) {
          api.setTitle(settings.name, threadID);
          api.sendMessage("🔒 ग्रुप का नाम लॉक है!", threadID);
        }
        break;

      case "log:thread-icon":
        if (settings.emoji) {
          api.changeThreadEmoji(settings.emoji, threadID);
          api.sendMessage("🔒 ग्रुप की emoji लॉक है!", threadID);
        }
        break;

      case "log:thread-color":
        if (settings.theme) {
          api.changeThreadColor(settings.theme, threadID);
          api.sendMessage("🔒 ग्रुप की theme लॉक है!", threadID);
        }
        break;

      case "log:user-nickname":
        if (settings.nickname) {
          const { participant_id } = logMessageData;
          const oldNick = settings.nickname?.[participant_id] || "";
          api.changeNickname(oldNick, threadID, participant_id);
          api.sendMessage("🔒 Nickname लॉक है!", threadID);
        }
        break;
    }
  }
};