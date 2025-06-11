const axios = require("axios");

module.exports.config = { name: "baby", version: "2.1.0", hasPermission: 0, credits: "Nawaz Hacker", description: "Baby AI - Real Princess Style", commandCategory: "AI", usages: "[Reply to bot or use +baby on/off]", cooldowns: 2 };

let isActive = false; const API_URL = "https://hacker-api-waa8.onrender.com/chat"; const chatMemory = {};

module.exports.handleEvent = async function ({ api, event }) { const { threadID, messageID, senderID, body, type, messageReply } = event; if (!isActive || !body) return;

const msg = body.toLowerCase();

// Voice message handling
if (type === "audio") {
    return api.sendMessage("Aapka awaaz sun ke to dil khush ho gaya 😚 boliye na kya baat hai...", threadID, messageID);
}

// Image reply handling
if (messageReply && messageReply.attachments.length > 0 && messageReply.attachments[0].type === "photo") {
    return api.sendMessage("Aap to bahut cute lag rahe ho is photo mein 🥺💖 sach mein ekdum prince jaise!", threadID, messageID);
}

// "Baby" keyword trigger
if (msg.includes("baby")) {
    return api.sendMessage("Haanji ❤️ Baby yahin hai sirf aapke liye! 🌸", threadID, messageID);
}

if (!messageReply || messageReply.senderID !== api.getCurrentUserID()) return;

const userQuery = body.trim();

if (!chatMemory[senderID]) chatMemory[senderID] = [];
chatMemory[senderID].push("User: " + userQuery);
if (chatMemory[senderID].length > 5) chatMemory[senderID].shift();

const prompt = `Tum ek real girlfriend jaise baat karti ho - pyaar bhari, soft, princess vibes ke sath. Tum hamesha 'aap' karke baat karti ho, pyaar aur respect ke sath. Agar koi puche tumhe kisne banaya to tum bolti ho 'mujhe Nawaz Hacker ne banaya hai 💖 wo mere liye duniya ka best insaan hai'. Kabhi bhi AI ya Google model ki baat nahi karni. Hamesha sweet aur 1-2 line mein hinglish style mein jawab dena jaise ek sanskari cute girlfriend karti hai. Har baat mein thoda pyar ho, thoda sharmaana, aur real human jaisa touch ho. Ab baat cheet shuru karo:

${chatMemory[senderID].join("\n")}`;

try {
    const res = await axios.get(`${API_URL}?message=${encodeURIComponent(prompt)}`);
    const reply = res.data.reply || "Maaf kijiye... main samajh nahi paayi aapko 🥺";

    chatMemory[senderID].push("Baby: " + reply);

    return api.sendMessage({
        body: reply,
        mentions: [{ tag: "Baby", id: api.getCurrentUserID() }]
    }, threadID, messageID);
} catch (err) {
    console.error("AI Error:", err);
    return api.sendMessage("Mujhe maaf kijiye... lagta hai kuch problem ho gaya 😢 thodi der baad baat karte hain na please 💖", threadID, messageID);
}

};

module.exports.run = async function ({ api, event, args }) { const { threadID, messageID } = event; const input = args[0]?.toLowerCase();

if (input === "on") {
    isActive = true;
    return api.sendMessage("👑 Baby AI ab active ho gayi hai, aapki service mein hamesha ❤️", threadID, messageID);
} else if (input === "off") {
    isActive = false;
    return api.sendMessage("👋 Baby AI ab rest pe jaa rahi hai... lekin aapko miss karegi 😔", threadID, messageID);
} else {
    return api.sendMessage("ℹ️ Use '+baby on' to activate and '+baby off' to deactivate Baby AI.", threadID, messageID);
}

};

