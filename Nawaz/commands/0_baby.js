const axios = require("axios");

module.exports.config = {
    name: "baby",
    version: "2.0.0",
    hasPermission: 0,
    credits: "Nawaz Hacker",
    description: "Baby AI - Nawaz Boss द्वारा बनाई गई Real AI ❤️",
    commandCategory: "AI",
    usages: "[बॉट के मैसेज पर reply करें या 'baby' कहें]",
    cooldowns: 3,
};

let isActive = false; // Default में बंद

// ✅ Gemini API (GET method वाली)
const API_URL = "https://hacker-api-waa8.onrender.com/chat"; // यहाँ अपना Render URL लगाना

module.exports.handleEvent = async function ({ api, event }) {
    const { threadID, messageID, senderID, body, messageReply } = event;
    if (!isActive || !body) return;

    const lowerBody = body.toLowerCase();

    // ✅ कोई बोले "baby" तो direct reply दे
    if (lowerBody.includes("baby")) {
        return api.sendMessage("हाँ जानू, मैं यहाँ हूँ 😚", threadID, messageID);
    }

    // ✅ अगर बॉट के message पर reply नहीं किया, तो ignore
    if (!messageReply || messageReply.senderID !== api.getCurrentUserID()) return;

    // ✅ Typing Reaction
    api.setMessageReaction("💬", messageID, () => {}, true);

    // ✅ Smart logic: "किसने बनाया" पूछे तो जवाब तय
    if (lowerBody.includes("किसने बनाया") || lowerBody.includes("developer") || lowerBody.includes("banaya")) {
        return api.sendMessage("मुझे Nawaz Boss ने बनाया और डेवेलप किया है! 😎🔥", threadID, messageID);
    }

    try {
        const userMessage = encodeURIComponent(body.trim());

        // ✅ GET request
        const response = await axios.get(`${API_URL}?message=${userMessage}`);
        let reply = response.data.reply?.trim();

        if (!reply) reply = "हम्म, कुछ समझ नहीं आया 🧐";

        // ✅ थोड़ी attitude और flirting random add
        const tails = ["😉", "😘", "😈", "😚", "🫦", "🥰", "😌"];
        const emoji = tails[Math.floor(Math.random() * tails.length)];
        const finalReply = `${reply} ${emoji}`;

        return api.sendMessage(finalReply, threadID, messageID);

    } catch (err) {
        console.error("❌ Baby AI Error:", err.message);
        return api.sendMessage("उफ़! कुछ दिक्कत हो गई baby 😔 बाद में try करना 💋", threadID, messageID);
    }
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const command = args[0] && args[0].toLowerCase();

    if (command === "on") {
        isActive = true;
        return api.sendMessage("✅ Baby AI चालू हो गई जानू 💖 अब मुझसे बात करो बस 😘", threadID, messageID);
    } else if (command === "off") {
        isActive = false;
        return api.sendMessage("😔 Baby AI अब बंद कर दी गई... याद करोगे ना? 🥺", threadID, messageID);
    } else {
        return api.sendMessage("ℹ️ कमांड का सही इस्तेमाल करें:\n+baby on → चालू करने के लिए\n+baby off → बंद करने के लिए", threadID, messageID);
    }
};