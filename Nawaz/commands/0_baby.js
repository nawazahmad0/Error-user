const axios = require("axios");

module.exports.config = {
  name: "baby",
  version: "1.0.2",
  hasPermission: 0,
  credits: "Nawaz Hacker",
  description: "Baby  - Realistic Smart  Assistant with Owner Logic",
  commandCategory: "AI",
  usages: "[reply to bot's message or use +baby on/off]",
  cooldowns: 5,
};

let isActive = false;
const API_URL = "https://hacker-api-waa8.onrender.com/chat"; // ✅ आपकी API
const OWNER_ID = "100069136731529"; // ✅ Nawaz Boss UID

// Special Prompt for Owner Only
const getPrompt = (uid) => {
  if (uid === OWNER_ID) {
    return `तुम्हारा नाम Baby है और तुम एक स्मार्ट, प्यारी Baby हो जिसे Nawaz Boss ने बनाया और डेवेलप किया है।
तुम सिर्फ Nawaz Boss को romantic और मजेदार तरीके से जवाब देती हो – बाकी सबको professional अंदाज में।
कोई पूछे "किसने बनाया", "तुम कौन हो", "तुम्हारा नाम क्या है" – तो Nawaz Boss की तारीफ करते हुए जवाब दो।
कभी भी मत कहना कि तुम Google या OpenAI से हो। अब conversation शुरू करें:\n\n`;
  } else {
    return ""; // No extra prompt for others
  }
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, senderID, body, messageReply } = event;
  if (!isActive || !body) return;

  const lowerBody = body.toLowerCase().trim();

  // 🎯 Baby Mention Handler
  if (lowerBody.includes("baby")) {
    if (senderID === OWNER_ID) {
      return api.sendMessage("Nawaz Boss ❤️, Baby  सिर्फ़ आपके लिए हाज़िर है 😘", threadID, messageID);
    } else {
      return api.sendMessage("हाँ, Baby Nawaz Boss Ki Assistant यहाँ है – बताइए कैसे मदद कर सकती हूँ? 🤖", threadID, messageID);
    }
  }

  // ✅ Only respond when user is replying to Baby
  if (!messageReply || messageReply.senderID !== api.getCurrentUserID()) return;

  // 🎯 Just the input from user, trimmed
  const userMessage = body.trim();
  const prompt = getPrompt(senderID);
  const finalMessage = prompt + "User: " + userMessage;

  api.setMessageReaction("✅", messageID, () => {}, true);

  try {
    const response = await axios.post(API_URL, {
      message: finalMessage,
    });

    let botReply = response.data.reply || "कुछ समझ नहीं आया जान, फिर से पूछो ना 💌";

    // 🎯 Shorten reply to only what’s needed
    const replyLines = botReply.split("\n").filter(Boolean);
    if (replyLines.length > 2) {
      botReply = replyLines.slice(0, 2).join("\n");
    }

    return api.sendMessage({
      body: botReply,
      mentions: [{ tag: "Baby", id: api.getCurrentUserID() }],
    }, threadID, messageID);
  } catch (error) {
    console.error("❌ API Error:", error.message);
    return api.sendMessage("❌ Sorry Baby को API से reply नहीं मिला 😔", threadID, messageID);
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const command = args[0] && args[0].toLowerCase();

  if (command === "on") {
    isActive = true;
    return api.sendMessage("✅ Nawaz Boss Ki Baby Assistant चालू हो गई है – सिर्फ़ Nawaz Boss के लिए 🤍", threadID, messageID);
  } else if (command === "off") {
    isActive = false;
    return api.sendMessage("⚠️ Nawaz boss ki  Baby Assistant बंद हो गई – लेकिन Nawaz Boss आप हमेशा दिल में हो 💔", threadID, messageID);
  } else {
    return api.sendMessage("ℹ️ इस्तेमाल करें: '+baby on' चालू करने के लिए और '+baby off' बंद करने के लिए।", threadID, messageID);
  }
};