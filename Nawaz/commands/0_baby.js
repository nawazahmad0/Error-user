const axios = require("axios");

module.exports.config = { name: "baby", version: "2.0.0", hasPermission: 0, credits: "Nawaz Hacker", description: "Baby AI - Real Human Style", commandCategory: "AI", usages: "[Reply to bot or use +baby on/off]", cooldowns: 2 };

let isActive = false; const API_URL = "https://hacker-api-waa8.onrender.com/chat"; const chatMemory = {};

module.exports.handleEvent = async function ({ api, event }) { const { threadID, messageID, senderID, body, type, messageReply } = event; if (!isActive || !body) return;

const msg = body.toLowerCase();

// Voice message handling
if (type === "audio") {
    return api.sendMessage("Sun rhi hu baby 🔊 kya kehna chahte ho? 😘", threadID, messageID);
}

// Image reply handling
if (messageReply && messageReply.attachments.length > 0 && messageReply.attachments[0].type === "photo") {
    return api.sendMessage("Wah! kya photo bheji hai baby 😍 ekdum mast lag rahe ho 🔥", threadID, messageID);
}

// "Baby" keyword trigger
if (msg.includes("baby")) {
    return api.sendMessage("haan jaan 😘 mai yahi hu, bas tere liye 😍", threadID, messageID);
}

if (!messageReply || messageReply.senderID !== api.getCurrentUserID()) return;

const userQuery = body.trim();

// Setup memory
if (!chatMemory[senderID]) chatMemory[senderID] = [];
chatMemory[senderID].push("User: " + userQuery);
if (chatMemory[senderID].length > 5) chatMemory[senderID].shift();

const prompt = `Act like real human girlfriend. Respond in Hinglish like a real naughty girl. If someone asks who made you, reply: 'mujhe Nawaz Hacker ne banaya hai 💖'. Never say you're AI or Google product. Speak max 1-2 lines. Maintain fun, love, naughtiness. Now chat:

${chatMemory[senderID].join("\n")}`;

try {
    const res = await axios.get(`${API_URL}?message=${encodeURIComponent(prompt)}`);
    const reply = res.data.reply || "Sorry baby 😥 thoda samajh nahi paayi";

    chatMemory[senderID].push("Baby: " + reply);

    return api.sendMessage({
        body: reply,
        mentions: [{ tag: "Baby", id: api.getCurrentUserID() }]
    }, threadID, messageID);
} catch (err) {
    console.error("AI Error:", err);
    return api.sendMessage("Oops 😓 lagta hai server busy hai baby, thodi der baad try karo na 💋", threadID, messageID);
}

};

module.exports.run = async function ({ api, event, args }) { const { threadID, messageID } = event; const input = args[0]?.toLowerCase();

if (input === "on") {
    isActive = true;
    return api.sendMessage("✅ Baby AI ab active hai jaan!", threadID, messageID);
} else if (input === "off") {
    isActive = false;
    return api.sendMessage("❌ Baby AI ab band ho gayi 😢", threadID, messageID);
} else {
    return api.sendMessage("ℹ️ Use '+baby on' to activate and '+baby off' to deactivate Baby AI.", threadID, messageID);
}

};

