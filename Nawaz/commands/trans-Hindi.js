module.exports.config = {
  name: "hindi",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
  description: "Text translation",
  commandCategory: "noPrefix",
  usages: "[Text]",
  cooldowns: 5,
  dependencies: {
      "request": ""
  }
};

module.exports.handleEvent = async function({ api, event }) {
  const request = global.nodemodule["request"];

  // Check if the message body starts with "hindi"
  if (event.body && event.body.toLowerCase().startsWith("hindi")) {
      let content = event.body.slice(4).trim(); // Remove "hindi" from the beginning
      if (!content && event.type === "message_reply") {
          content = event.messageReply.body; // Use replied message content
      }
      if (!content) {
          return api.sendMessage("Please provide text to translate.", event.threadID, event.messageID);
      }

      const translateThis = content;
      const lang = "hi"; // Target language is always hindi

      // Send request to Google Translate API
      return request(
          encodeURI(
              `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=hi&dt=t&q=${translateThis}`
          ),
          (err, response, body) => {
              if (err) {
                  return api.sendMessage("An error occurred during translation.", event.threadID, event.messageID);
              }
              const retrieve = JSON.parse(body);
              let text = "";
              retrieve[0].forEach((item) => {
                  if (item[0]) text += item[0];
              });
              const fromLang = retrieve[2] === retrieve[8][0][0] ? retrieve[2] : retrieve[8][0][0];
              api.sendMessage(
                  `🌐 ${text}\n\n- Translated from ${fromLang} to Hindi 🌐`,
                  event.threadID,
                  event.messageID
              );
          }
      );
  }
};

module.exports.run = async function() {
  // Empty run function because the command is no-prefix and handled in `handleEvent`
};