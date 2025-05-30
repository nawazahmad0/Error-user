module.exports.config = {
  name: "english",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝐃𝐚𝐫𝐤 𝐑𝐮𝐥𝐞𝐱 𝐊𝐢𝐧𝐠 𝐀𝐧𝐮𝐩",
  description: "Text translation",
  commandCategory: "media",
  usages: "[Text]",
  cooldowns: 5,
  dependencies: {
    "request": ""
  },
  usePrefix: false
};

module.exports.handleEvent = async ({ api, event }) => {
  const request = global.nodemodule["request"];
  const content = event.body;

  if (!content || (!content.includes("->") && event.type !== "message_reply")) return;

  let translateThis, lang;

  if (event.type === "message_reply") {
    translateThis = event.messageReply.body;
    if (content.includes("-> ")) {
      lang = content.substring(content.indexOf("-> ") + 3);
    } else {
      lang = "en"; // Default target language
    }
  } else if (content.includes(" -> ")) {
    translateThis = content.slice(0, content.indexOf(" ->"));
    lang = content.substring(content.indexOf(" -> ") + 4);
  } else {
    return;
  }

  request(
    encodeURI(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${translateThis}`),
    (err, response, body) => {
      if (err) return api.sendMessage("❌ Error occurred!", event.threadID, event.messageID);

      try {
        const retrieve = JSON.parse(body);
        let text = '';
        retrieve[0].forEach(item => {
          if (item[0]) text += item[0];
        });

        const fromLang = (retrieve[2] === retrieve[8][0][0]) ? retrieve[2] : retrieve[8][0][0];
        api.sendMessage(` ${text}\n - 🍂${fromLang} to ${lang}🍂`, event.threadID, event.messageID);
      } catch (e) {
        return api.sendMessage("⚠️ Translation failed!", event.threadID, event.messageID);
      }
    }
  );
};

module.exports.run = () => {};