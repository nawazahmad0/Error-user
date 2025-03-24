const axios = require("axios");

module.exports.config = {
    name: "baby",
    version: "1.0.0",
    hasPermission: 0,
    credits: "Nawaz Boss",
    description: "Baby AI - स्मार्ट AI चैटबॉट",
    commandCategory: "AI",
    usages: "[बॉट के मैसेज पर रिप्लाई करें]",
    cooldowns: 5,
};

let userMemory = {};
let isActive = true;
const API_KEY = "nawaz-hacker"; // ✅ API Key Set

module.exports.handleEvent = async function ({ api, event }) {
    const { threadID, messageID, senderID, body, messageReply } = event;
    if (!isActive || !body) return;

    const lowerBody = body.toLowerCase();

    // ✅ "Baby" कहने पर बॉट जवाब देगा
    if (lowerBody.includes("baby")) {
        return api.sendMessage("हाँ, मैं यहाँ हूँ! 😊", threadID, messageID);
    }

    // ✅ अगर यूजर ने बॉट के मैसेज पर रिप्लाई नहीं किया, तो कुछ मत करो
    if (!messageReply || messageReply.senderID !== api.getCurrentUserID()) return;

    const userQuery = body.trim();

    // ✅ API कॉल (API Key जोड़ी गई)
    const apiURL = `https://nawaz-hacker-api.onrender.com/api?message=${encodeURIComponent(userQuery)}&apikey=${API_KEY}`;

    try {
        const response = await axios.get(apiURL);
        let botReply = response.data.response || "मुझे समझने में दिक्कत हो रही है। क्या आप इसे दोहरा सकते हैं?";

        return api.sendMessage({
            body: botReply,
            mentions: [{ tag: "Baby", id: api.getCurrentUserID() }]
        }, threadID, messageID);

    } catch (error) {
        console.error("API Error:", error.message);
        return api.sendMessage("❌ AI से जवाब लाने में समस्या हुई। कृपया बाद में प्रयास करें।", threadID, messageID);
    }
};

// ✅ बॉट के कमांड (on/off)
module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const command = args[0] && args[0].toLowerCase();

    if (command === "on") {
        isActive = true;
        return api.sendMessage("✅ Baby AI अब सक्रिय है।", threadID, messageID);
    } else if (command === "off") {
        isActive = false;
        return api.sendMessage("⚠️ Baby AI अब निष्क्रिय है।", threadID, messageID);
    }
};