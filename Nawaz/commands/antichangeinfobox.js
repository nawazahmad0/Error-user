const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "antichangeinfobox",
    version: "1.0",
    author: "Nawaz Boss (Convert by ChatGPT)",
    role: 0,
    shortDescription: {
      en: "Protect group info from being changed"
    },
    longDescription: {
      en: "Enable or disable protection against group avatar, name, emoji, theme, and nickname changes"
    },
    category: "group",
    guide: {
      en: "{pn} [avt|name|emoji|theme|nickname] [on|off]"
    }
  },

  onStart: async function ({ api, event, args, threadsData, message }) {
    const { threadID } = event;

    if (args.length < 2)
      return message.reply("⚠️ Please use: antichangeinfobox [avt|name|emoji|theme|nickname] [on|off]");

    const type = args[0].toLowerCase();
    const toggle = args[1].toLowerCase();
    const allowedTypes = ["avt", "name", "emoji", "theme", "nickname"];

    if (!allowedTypes.includes(type) || !["on", "off"].includes(toggle))
      return message.reply("❌ Invalid syntax!\nUse: antichangeinfobox [avt|name|emoji|theme|nickname] [on|off]");

    const protectData = await threadsData.get(threadID, "data.antiChangeInfoBox", {}) || {};

    const threadInfo = await api.getThreadInfo(threadID);

    if (toggle === "off") {
      delete protectData[type];
      await threadsData.set(threadID, protectData, "data.antiChangeInfoBox");
      return message.reply(`✅ Anti-change protection for "${type}" disabled.`);
    }

    // ON: Store current data
    switch (type) {
      case "avt":
        if (!threadInfo.imageSrc)
          return message.reply("⚠️ Group does not have an avatar set.");
        protectData.avt = threadInfo.imageSrc;
        break;
      case "name":
        protectData.name = threadInfo.threadName;
        break;
      case "emoji":
        protectData.emoji = threadInfo.emoji;
        break;
      case "theme":
        protectData.theme = threadInfo.color;
        break;
      case "nickname":
        const nicknames = {};
        for (const user of threadInfo.userInfo) {
          const nick = threadInfo.nicknames?.[user.id] || "";
          nicknames[user.id] = nick;
        }
        protectData.nickname = nicknames;
        break;
    }

    await threadsData.set(threadID, protectData, "data.antiChangeInfoBox");
    return message.reply(`✅ Anti-change protection for "${type}" enabled.`);
  },

  onEvent: async function ({ api, event, threadsData }) {
    const { threadID, author, logMessageType, logMessageData } = event;
    const data = await threadsData.get(threadID, "data.antiChangeInfoBox", {});
    const botID = api.getCurrentUserID();

    // Ignore if no protection
    if (!data || Object.keys(data).length === 0) return;

    // Don't act if admin/bot itself changed
    if (author === botID) return;

    switch (logMessageType) {
      case "log:thread-image":
        if (!data.avt) return;
        try {
          const res = await axios.get(data.avt, { responseType: "stream" });
          await api.changeGroupImage(res.data, threadID);
          api.sendMessage("⚠️ Group avatar change is not allowed!", threadID);
        } catch (e) {
          console.error("Failed to revert avatar:", e);
        }
        break;

      case "log:thread-name":
        if (!data.name) return;
        api.setTitle(data.name, threadID);
        api.sendMessage("⚠️ Group name change is locked!", threadID);
        break;

      case "log:thread-icon":
        if (!data.emoji) return;
        api.changeThreadEmoji(data.emoji, threadID);
        api.sendMessage("⚠️ Emoji change is not allowed!", threadID);
        break;

      case "log:thread-color":
        if (!data.theme) return;
        api.changeThreadColor(data.theme, threadID);
        api.sendMessage("⚠️ Theme color change is locked!", threadID);
        break;

      case "log:user-nickname":
        if (!data.nickname) return;
        const { participant_id } = logMessageData;
        const nickname = data.nickname?.[participant_id] || "";
        api.changeNickname(nickname, threadID, participant_id);
        api.sendMessage("⚠️ Nickname change is not allowed!", threadID);
        break;
    }
  }
};