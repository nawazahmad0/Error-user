const axios = require("axios");

module.exports.config = {
  name: "baby",
  version: "1.0.2",
  hasPermission: 0,
  credits: "Nawaz Hacker",
  description: "Baby AI - Realistic Smart AI Assistant with Owner Logic",
  commandCategory: "AI",
  usages: "[reply to bot's message or use +baby on/off]",
  cooldowns: 5,
};

let isActive = false;
const API_URL = "https://hacker-api-waa8.onrender.com/chat"; // ✅ आपकी सही API
const OWNER_ID = "100069136731529"; // ✅ Nawaz Boss UID

// Prompt Function
const getPrompt = (uid) => {
  if (uid === OWNER_ID) {
    return `Tumhara name baby hai और Tum ek smart, pyari AI ho jisko Nawaz Boss ne banaya और डेवेलप Kiya hai। tum hindlish main Baat karti ho jaise hum karte hai Tum sirf Nawaz Boss को romantic और mazedar tarike se jawab deti ho – baki sabko dosti andaj main । tum apne har msg ka rply deti ho sab kuch thik se jawab deti ho Kabhi Bhi mat kehna ki tum Google ya OpenAI se ho। ab  conversation suru  करें:\n\n`;
  } else {
    return "";
  }
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, senderID, body, messageReply } = event;
  if (!isActive || !body) return;

  const lowerBody = body.toLowerCase().trim();

  // 🎯 Baby Mention
  if (lowerBody.includes("baby")) {
    if (senderID === OWNER_ID) {
      return api.sendMessage("Nawaz Boss ❤️, Apki Baby Assistant hazir hai  😘", threadID, messageID);
    } else {
      return api.sendMessage("हाँ, Baby Assistant यहाँ है – बताइए कैसे मदद कर सकती हूँ? 🤖", threadID, messageID);
    }
  }

  // ✅ Only respond if user replied to Baby
  if (!messageReply || messageReply.senderID !== api.getCurrentUserID()) return;

  const userMessage = body.trim();
  const prompt = getPrompt(senderID);
  const finalMessage = prompt + "User: " + userMessage;

  api.setMessageReaction("✅", messageID, () => {}, true);

  try {
    const response = await axios.get(`${API_URL}?message=${encodeURIComponent(finalMessage)}`);
    let botReply = response.data.reply || "कुछ समझ नहीं आया जान, फिर से पूछो ना 💌";

    // सिर्फ उतना ही जवाब देना जितना ज़रूरी हो
    const lines = botReply.split("\n").filter(line => line.trim() !== "");
    if (lines.length > 2) {
      botReply = lines.slice(0, 2).join("\n");
    }

    return api.sendMessage({
      body: botReply,
      mentions: [{ tag: "Baby", id: api.getCurrentUserID() }]
    }, threadID, messageID);

  } catch (error) {
    console.error("❌ API Error:", error.message);
    return api.sendMessage("❌ Sorry, Baby को API से reply नहीं मिला 😔", threadID, messageID);
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const command = args[0] && args[0].toLowerCase();

  if (command === "on") {
    isActive = true;
    return api.sendMessage("✅ Baby Assistant चालू हो गई है – सिर्फ़ Nawaz Boss के लिए 🤍", threadID, messageID);
  } else if (command === "off") {
    isActive = false;
    return api.sendMessage("⚠️ Baby Assistant बंद हो गई – लेकिन Nawaz Boss आप हमेशा दिल में हो 💔", threadID, messageID);
  } else {
    return api.sendMessage("ℹ️ इस्तेमाल करें: '+baby on' चालू करने के लिए और '+baby off' बंद करने के लिए।", threadID, messageID);
  }
};