module.exports.config = {
    name: "autotranslate",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "Nawaz Boss",
    description: "Auto translates message like 'text -> hi'",
    commandCategory: "media",
    usages: "text -> lang",
    cooldowns: 3,
    usePrefix: false
};

module.exports.handleEvent = async ({ api, event }) => {
    const request = require("request");
    const msg = event.body;

    if (!msg || !msg.includes("->")) return;

    const split = msg.split("->");
    const translateThis = split[0].trim();
    const lang = split[1]?.trim();

    if (!translateThis || !lang) return;

    const url = encodeURI(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${translateThis}`);

    request(url, (err, response, body) => {
        if (err) return api.sendMessage("❌ Error during translation!", event.threadID, event.messageID);

        try {
            const data = JSON.parse(body);
            let translatedText = '';
            data[0].forEach(item => { if (item[0]) translatedText += item[0]; });

            const fromLang = (data[2] === data[8][0][0]) ? data[2] : data[8][0][0];
            api.sendMessage(`🌐 ${translatedText}\n📝 ${fromLang} ➜ ${lang.toUpperCase()}`, event.threadID, event.messageID);
        } catch (e) {
            api.sendMessage("⚠️ Translation failed. Try again later!", event.threadID, event.messageID);
        }
    });
};

module.exports.run = () => {}; // जरूरी है लेकिन खाली रहेगा