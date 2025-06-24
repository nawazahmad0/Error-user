const axios = require("axios");

module.exports = {
  config: {
    name: "antichangeinfobox",
    version: "1.0",
    author: "Nawaz Boss",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Prevent changes to group info" },
    longDescription: {
      en: "Lock group avatar, name, emoji, theme, and nicknames from being changed."
    },
    category: "group",
    guide: { en: "{pn} [avt|name|emoji|theme|nickname] [on|off]" }
  },

  onStart: async function ({ api, event, args, threadsData, message }) {
    const { threadID } = event;
    const type = args[0];
    const toggle = args[1];

    if (!["avt", "name", "emoji", "theme", "nickname"].includes(type) || !["on", "off"].includes(toggle)) {
      return message.reply("❌ Usage: {pn} [avt|name|emoji|theme|nickname] [on|off]");
    }

    let data = await threadsData.get(threadID, "data.antiChangeInfoBox") || {};
    const info = await api.getThreadInfo(threadID);

    if (toggle === "off") {
      delete data[type];
    } else {
      switch (type) {
        case "avt":
          if (!info.imageSrc) return message.reply("❌ Group has no avatar.");
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
          const nick = {};
          for (const u of info.userInfo) {
            nick[u.id] = info.nicknames?.[u.id] || "";
          }
          data.nickname = nick;
          break;
      }
    }

    await threadsData.set(threadID, data, "data.antiChangeInfoBox");
    return message.reply(`✅ Anti-change for "${type}" is now "${toggle}".`);
  },

  onEvent: async function ({ api, event, threadsData }) {
    const { threadID, author, logMessageType, logMessageData } = event;
    if (author === api.getCurrentUserID()) return;

    const data = await threadsData.get(threadID, "data.antiChangeInfoBox");
    if (!data) return;

    switch (logMessageType) {
      case "log:thread-image":
        if (data.avt) {
          try {
            const res = await axios.get(data.avt, { responseType: "stream" });
            api.changeGroupImage(res.data, threadID);
            api.sendMessage("🔒 Avatar change is locked!", threadID);
          } catch (e) {
            console.log("Error resetting avatar:", e.message);
          }
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