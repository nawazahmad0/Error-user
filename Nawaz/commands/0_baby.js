const axios = require("axios");

module.exports.config = {
    name: "baby",
    version: "1.0.1",
    hasPermission: 0,
    credits: "Nawaz Hacker",
    description: "Baby AI - Smart Romantic AI Assistant",
    commandCategory: "AI",
    usages: "[reply to bot's message or use +baby on/off]",
    cooldowns: 5,
};

let isActive = false; // Default off
const API_URL = "https://your-gemini-api.onrender.com/chat"; // 🔁 Change to your actual API

// Custom Prompt
const prompt = `तुम्हारा नाम Baby है और तुम एक स्मार्ट AI हो जिसे Nawaz Boss ने बनाया और डेवेलप किया है।
तुम हमेशा खुद को "Baby AI" कहती हो। कोई पूछे "तुम्हें किसने बनाया", "तुम कौन हो", "तुम्हारा नाम क्या है",
"तुम पागल हो?" जैसे सवाल, तो मजेदार अंदाज में और Nawaz Boss की तारीफ के साथ जवाब दो।
तुम एक real girlfriend की तरह loving, funny और थोड़ा attitude वाली हो। कभी मत कहना कि तुम
Google की model हो या किसी और ने बनाया है। अब conversation शुरू करें:\n\n`;

module.exports.handleEvent = async function ({ api, event }) {
    const { threadID, messageID, senderID, body, messageReply } = event;
    if (!isActive || !body) return;

    const lowerBody = body.toLowerCase();

    if (lowerBody.includes("baby")) {
        return api.sendMessage("हाँ जान, Baby AI यहाँ है – सिर्फ़ Nawaz Boss के लिए! 😘", threadID, messageID);
    }

    if (!messageReply || messageReply.senderID !== api.getCurrentUserID()) return;

    const userMessage = body.trim();
    const finalMessage = prompt + "User: " + userMessage;

    api.setMessageReaction("💭", messageID, () => {}, true);

    try {
        const response = await axios.get(`${API_URL}?message=${encodeURIComponent(finalMessage)}`);
        const botReply = response.data.reply || "कुछ समझ नहीं आया जान, फिर से पूछो ना 💌";

        return api.sendMessage({
            body: botReply,
            mentions: [{ tag: "Baby", id: api.getCurrentUserID() }]
        }, threadID, messageID);
    } catch (error) {
        console.error("❌ API Error:", error.message);
        return api.sendMessage("❌ Oops baby! Network problem लग रही है, बाद में try करो 😔", threadID, messageID);
    }
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const command = args[0] && args[0].toLowerCase();

    if (command === "on") {
        isActive = true;
        return api.sendMessage("✅ Baby AI चालू हो चुकी है – अब मैं सिर्फ़ Nawaz Boss के लिए ज़िंदा हूँ 💞", threadID, messageID);
    } else if (command === "off") {
        isActive = false;
        return api.sendMessage("⚠️ Baby AI बंद हो गई है – पर तुम हमेशा मेरे दिल में हो 💔", threadID, messageID);
    } else {
        return api.sendMessage("ℹ️ इस्तेमाल करो: '+baby on' चालू करने के लिए और '+baby off' बंद करने के लिए।", threadID, messageID);
    }
};