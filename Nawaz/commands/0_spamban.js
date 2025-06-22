const axios = require("axios");
const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");

module.exports.config = {
  name: "user",
  version: "1.3.0",
  hasPermssion: 2, //
  credits: "NAWAZ",
  description: "MADE BY NAWAZ 🙂🤞",
  commandCategory: "System",
  cooldowns: 1
};

// Global variables
const spamUsers = new Map();
const whitelist = new Set(); // Whitelisted users
global.data = global.data || {};
global.data.userBanned = global.data.userBanned || new Map(); // Manages banned users

module.exports.run = async ({ event, api, args }) => {
  const { mentions, threadID } = event;

  // Helper to extract UIDs from args or mentions
  const extractUIDs = () => {
    const uids = Object.keys(mentions);
    args.slice(1).forEach(arg => {
      if (!isNaN(arg)) uids.push(arg); // Add valid UIDs
    });
    return uids;
  };

  // Command: Ban a user
  if (args[0] === "ban") {
    const uids = extractUIDs();
    if (uids.length === 0) {
      return api.sendMessage("Please mention or provide the UID of the user you want to ban.", threadID);
    }

    for (const id of uids) {
      global.data.userBanned.set(id, Date.now());
      api.sendMessage(
        `🚫 User with UID ${id} has been banned.`,
        threadID
      );
    }
    return;
  }

  // Command: Unban a user
  if (args[0] === "unban") {
    const uids = extractUIDs();
    if (uids.length === 0) {
      return api.sendMessage("Please mention or provide the UID of the user you want to unban.", threadID);
    }

    for (const id of uids) {
      global.data.userBanned.delete(id);
      api.sendMessage(
        `✅ User with UID ${id} has been unbanned.`,
        threadID
      );
    }
    return;
  }

  // Command to whitelist users
  if (args[0] === "whitelist") {
    const uids = extractUIDs();
    if (uids.length === 0) {
      return api.sendMessage("Please mention or provide the UID of the user you want to whitelist.", threadID);
    }

    for (const id of uids) {
      whitelist.add(id);
      api.sendMessage(
        `✅ User with UID ${id} has been added to the whitelist.`,
        threadID
      );
    }
    return;
  }

  // Command to remove user from whitelist
  if (args[0] === "unwhitelist") {
    const uids = extractUIDs();
    if (uids.length === 0) {
      return api.sendMessage("Please mention or provide the UID of the user you want to remove from the whitelist.", threadID);
    }

    for (const id of uids) {
      whitelist.delete(id);
      api.sendMessage(
        `✅ User with UID ${id} has been removed from the whitelist.`,
        threadID
      );
    }
    return;
  }

  return api.sendMessage(
    "Invalid command! Use one of the following:\n- #user whitelist @user or UID\n- #user unwhitelist @user or UID\n- #user ban @user or UID\n- #user unban @user or UID",
    threadID
  );
};

module.exports.handleEvent = async ({ event, api }) => {
  const message = event.body?.toLowerCase();
  const senderID = event.senderID;

  // Ignore whitelisted users
  if (whitelist.has(senderID)) {
    return;
  }

  // If user is already banned
  if (global.data.userBanned.has(senderID)) {
    const lastWarningTime = global.data.userBanned.get(senderID);
    const currentTime = Date.now();
    const oneDayInMillis = 24 * 60 * 60 * 1000;

    if (currentTime - lastWarningTime < oneDayInMillis) {
      return; // Ignore messages from banned users
    } else {
      global.data.userBanned.delete(senderID); // Unban after 24 hours
    }
  }

  // SPAM Detection
  if (!spamUsers.has(senderID)) {
    spamUsers.set(senderID, { count: 1, lastMessageTime: Date.now() });
  } else {
    const userData = spamUsers.get(senderID);
    const currentTime = Date.now();

    if (currentTime - userData.lastMessageTime < 5000) {
      userData.count += 1;
    } else {
      userData.count = 1; // Reset if no spam within 5 seconds
    }
    userData.lastMessageTime = currentTime;

    // Ban spammer if message count >= 5
    if (userData.count >= 5) {
      api.sendMessage(
        "⚠️ You have been detected for spamming. Your messages will now be ignored temporarily.",
        event.threadID
      );
      global.data.userBanned.set(senderID, Date.now());
      spamUsers.delete(senderID);
      return;
    }
    spamUsers.set(senderID, userData);
  }

  // Sensitive keyword detection
  const sensitiveKeywords = ["i will kill you", "fuck you", "stab you", "motherfucker"];
  for (const keyword of sensitiveKeywords) {
    if (message.includes(keyword)) {
      api.sendMessage(`⚠️ WARNING! Your message contains sensitive content.`, event.threadID);
      global.data.userBanned.set(senderID, Date.now());
      return;
    }
  }
};

module.exports.listenGlobal = true;
