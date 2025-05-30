module.exports.config = {
  name: "translate",
  version: "1.1.1",
  hasPermssion: 0,
  credits: "Nawaz Boss",
  description: "Translate text using Google Translate API",
  commandCategory: "tools",
  usages: "[text] -> [en]",
  cooldowns: 2
};

module.exports.handleEvent = async ({ api, event }) => {
  const request = global.nodemodule["request"];
  const content = event.body;

  // ✅ Only trigger if '->' is present in message (normal or reply)
  if (!content || !content.includes("->")) return;

  let translateThis, lang;

  if (event.type === "message_reply") {
    translateThis = event.messageReply.body;
    lang = content.split("->")[1]?.trim() || "en";
  } else {
    translateThis = content.split("->")[0]?.trim();
    lang = content.split("->")[1]?.trim() || "en";
  }

  request(
    encodeURI(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${translateThis}`),
    (err, response, body) => {
      if (err) return api.sendMessage("❌ Error occurred while translating.", event.threadID, event.messageID);

      try {
        const data = JSON.parse(body);
        let translatedText = '';
        data[0].forEach(item => {
          if (item[0]) translatedText += item[0];
        });

        const fromLang = (data[2] === data[8][0][0]) ? data[2] : data[8][0][0];

        api.sendMessage(` ${translatedText}\n- 🍂${fromLang} to ${lang}🍂`, event.threadID, event.messageID);
      } catch (e) {
        return api.sendMessage("⚠️ Translation failed. Please check format or try again.", event.threadID, event.messageID);
      }
    }
  );
};

module.exports.run = () => {};