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

module.exports.handleEvent = async function ({ api, event }) {
    const { threadID, messageID, senderID, body, messageReply } = event;
    if (!isActive || !body) return;

    const lowerBody = body.toLowerCase();

    // अगर कोई "baby" बोले, तो बॉट जवाब देगा
    if (lowerBody.includes("baby")) {
        return api.sendMessage("हाँ, मैं यहाँ हूँ! 😊", threadID, messageID);
    }

    // अगर यूजर ने बॉट के मैसेज पर रिप्लाई नहीं किया, तो कुछ मत करो
    if (!messageReply || messageReply.senderID !== api.getCurrentUserID()) return;

    const userQuery = body.trim();

    // यूजर हिस्ट्री लोड करो
    if (!userMemory[senderID]) userMemory[senderID] = [];

    // यूजर का पिछला कन्वर्सेशन जोड़ें
    const conversationHistory = userMemory[senderID].join("\n");
    const fullQuery = `${conversationHistory}\nUser: ${userQuery}\nBot:`;

    // **AI API को कॉल करो (अब "nawaz-hacker-api" इस्तेमाल हो रहा है)**
    const apiURL = `https://nawaz-hacker-api.com/api?message=${encodeURIComponent(fullQuery)}`;

    try {
        const response = await axios.get(apiURL);
        let botReply = response.data.response || "मुझे समझने में दिक्कत हो रही है। क्या आप इसे दोहरा सकते हैं?";

        // **यूजर की हिस्ट्री स्टोर करें (अब 10 मैसेज तक)**  
        userMemory[senderID].push(`User: ${userQuery}`);  
        userMemory[senderID].push(`Bot: ${botReply}`);  
        if (userMemory[senderID].length > 10) userMemory[senderID].splice(0, 2);  

        return api.sendMessage({
            body: botReply,
            mentions: [{
                tag: "Baby",
                id: api.getCurrentUserID()
            }]
        }, threadID, messageID);

    } catch (error) {
        console.error("API Error:", error.message);
        return api.sendMessage("❌ AI से जवाब लाने में समस्या हुई। कृपया बाद में प्रयास करें।", threadID, messageID);
    }
};

// बॉट के कमांड
module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const command = args[0] && args[0].toLowerCase();

    if (command === "on") {
        isActive = true;
        return api.sendMessage("✅ Baby AI अब सक्रिय है।", threadID, messageID);
    } else if (command === "off") {
        isActive = false;
        return api.sendMessage("⚠️ Baby AI अब निष्क्रिय है।", threadID, messageID);
    } else if (command === "clear") {
        userMemory = {};
        return api.sendMessage("🧹 सभी उपयोगकर्ताओं की बातचीत की हिस्ट्री क्लियर कर दी गई है।", threadID, messageID);
    }
};
