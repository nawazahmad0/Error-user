const axios = require("axios");

module.exports.config = { name: "baby", version: "1.1.0", hasPermission: 0, credits: "Nawaz Hacker", description: "Baby AI - Respectful and Smart AI Chatbot", commandCategory: "AI", usages: "[Reply to message or use +baby on/off]", cooldowns: 3, };

const OWNER_ID = "100069136731529"; // Nawaz Boss ka Facebook ID typeHistory = {}; let isActive = false; const API_URL = "https://hacker-api-waa8.onrender.com";

module.exports.handleEvent = async function ({ api, event }) { const { threadID, messageID, senderID, body, messageReply } = event; if (!isActive || !body) return;

const userText = body.trim();
const lowerText = userText.toLowerCase();

// Respectfully respond if someone says "baby"
if (lowerText.includes("baby")) {
    if (senderID === OWNER_ID) {
        return api.sendMessage("Nawaz Boss, aap aa gaye ❤️!", threadID, messageID);
    } else {
        return api.sendMessage("Jee aapne mujhe yaad kiya? ☺️", threadID, messageID);
    }
}

if (!messageReply || messageReply.senderID !== api.getCurrentUserID()) return;

// Reply only to message length (limited response)
try {
    const response = await axios.post(`${API_URL}/baby`, {
        message: userText,
        sender: senderID
    });

    let botReply = response.data.reply || "Maaf kijiye, mujhe samajh nahi aaya. 🙏🏻";

    // Limit reply length
    const maxWords = userText.split(" ").length + 2;
    botReply = botReply.split(" ").slice(0, maxWords).join(" ");

    // Add respect and love if owner
    if (senderID === OWNER_ID) {
        botReply = `Nawaz Boss 💖, ${botReply}`;
    } else {
        botReply = `Jee, ${botReply}`;
    }

    return api.sendMessage({
        body: botReply,
        mentions: [{ tag: "Baby", id: api.getCurrentUserID() }]
    }, threadID, messageID);

} catch (error) {
    console.error("API Error:", error);
    return api.sendMessage("❌ Maaf kijiye, mujhe samasya ho rahi hai. Thodi der baad koshish kijiye.", threadID, messageID);
}

};

module.exports.run = async function ({ api, event, args }) { const { threadID, messageID } = event; const command = args[0] && args[0].toLowerCase();

if (command === "on") {
    isActive = true;
    return api.sendMessage("✅ Baby AI ab active hai. Aapka sawal puchhiye. 💬", threadID, messageID);
} else if (command === "off") {
    isActive = false;
    return api.sendMessage("🚫 Baby AI ab band ho gayi hai.", threadID, messageID);
} else {
    return api.sendMessage("ℹ️ Use '+baby on' to start and '+baby off' to stop.", threadID, messageID);
}

};

