const axios = require("axios");

module.exports.config = {
  name: "baby",
  version: "1.0.0",
  hasPermission: 0,
  credits: "Nawaz Hacker",
  description: "Baby AI – Respectful and Smart AI Chatbot",
  commandCategory: "AI",
  usages: "[Reply to message or use +baby on/off]",
  cooldowns: 3,
};

const OWNER_ID = "100069136731529";
let isActive = false;
const API_URL = "https://hacker-api-waa8.onrender.com/baby";

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, senderID, body, messageReply } = event;
  if (!isActive || !body) return;

  const userText = body.trim();
  const lowerText = userText.toLowerCase();

  // 🍼 अगर कोई "baby" बोले तो जवाब दो
  if (lowerText.includes("baby")) {
    if (senderID === OWNER_ID) {
      return api.sendMessage("Nawaz Boss, aap aa gaye ❤️!", threadID, messageID);
    } else {
      return api.sendMessage("Jee aapne mujhe yaad kiya? 😊", threadID, messageID);
    }
  }

  // 🤖 अगर किसी ने Baby AI से reply में सवाल किया
  if (messageReply && messageReply.senderID === api.getCurrentUserID()) {
    try {
      const res = await axios.get(`${API_URL}?message=${encodeURIComponent(userText)}&sender=${senderID}`);
      const reply = res.data.reply || "Maaf kijiye, main samajh nahi payi 😅";

      // Nawaz Boss को प्यारा reply
      if (senderID === OWNER_ID) {
        return api.sendMessage("💌 " + reply, threadID, messageID);
      } else {
        return api.sendMessage(reply, threadID, messageID);
      }
    } catch (error) {
      return api.sendMessage("❌ Sorry, mujhe kuch problem aa gayi API se baat karne mein.", threadID, messageID);
    }
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const cmd = args[0]?.toLowerCase();

  if (cmd === "on") {
    isActive = true;
    return api.sendMessage("✅ Baby AI ab active hai.", threadID, messageID);
  } else if (cmd === "off") {
    isActive = false;
    return api.sendMessage("❌ Baby AI band kar di gayi hai.", threadID, messageID);
  } else {
    return api.sendMessage("ℹ️ Use: +baby on | +baby off", threadID, messageID);
  }
};