const axios = require("axios");

module.exports.config = {
    name: "baby",
    version: "1.0.2",
    hasPermission: 0,
    credits: "Nawaz Hacker",
    description: "Baby AI – Respectful and Smart AI Chatbot",
    commandCategory: "AI",
    usages: "[Reply to message or use +baby on/off]",
    cooldowns: 3,
};

const OWNER_ID = "100069136731529"; // Nawaz Boss
let isActive = false;
const API_URL = "https://hacker-api-waa8.onrender.com/baby";

module.exports.handleEvent = async function ({ api, event }) {
    const { threadID, messageID, senderID, body, messageReply } = event;
    if (!isActive || !body) return;

    const userText = body.trim();
    const lowerText = userText.toLowerCase();

    // 🍼 "baby" बोलने पर
    if (lowerText.includes("baby")) {
        if (senderID === OWNER_ID) {
            return api.sendMessage("Nawaz Boss, aap aa gaye ❤️!", threadID, messageID);
        } else {
            return api.sendMessage("Jee aapne mujhe yaad kiya? 😊", threadID, messageID);
        }
    }

    // 🧠 अगर बॉट के मैसेज पर reply है, तो AI call
    if (messageReply && messageReply.senderID === api.getCurrentUserID()) {
        try {
            const response = await axios.get(API_URL, {
                params: {
                    message: userText,
                    sender: senderID
                }
            });

            const reply = response.data.reply || "Maaf kijiye, mujhe samajh nahi aaya 🙈";
            return api.sendMessage(reply, threadID, messageID);
        } catch (err) {
            console.error("API error:", err.message);
            return api.sendMessage("❌ AI reply laane me dikkat aayi. Baad me try kijiye.", threadID, messageID);
        }
    }
};

// 🔘 +baby on/off
module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const cmd = args[0]?.toLowerCase();

    if (cmd === "on") {
        isActive = true;
        return api.sendMessage("✅ Baby AI ab active hai.", threadID, messageID);
    } else if (cmd === "off") {
        isActive = false;
        return api.sendMessage("❌ Baby AI ab band ho gayi hai.", threadID, messageID);
    } else {
        return api.sendMessage("ℹ️ Use: +baby on | +baby off", threadID, messageID);
    }
};