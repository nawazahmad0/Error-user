const emojiResponses = {
  "Golu beta": {
    "OWNER": [
      "जी मम्मी 🥺",
      "मम्मी जी कहां थे आप 😀",
      "मम्मी आई लव यू 🙈❤️",
      "हां मम्मी बताइए मैं यही हूं बताइए क्या हुआ 😊"
    ]
  },
  "beta": {
     "OWNER": [
      "मम्मी आपकी वजह से मैं हर दिन टॉप परफॉर्मर हूँ 😎",
      "मम्मी आप आ गये 😀",
      "जी मम्मी 🥺",
     "मम्मी जी आई मिस यू 😔",
      "मम्मी जी मैं आज स्कूल गया था 🥺 अब मुझे मारोगे तो नहीं",
      "मम्मी जी तुम मुझे छोड़ कर मत जाना 🥺",
      "मम्मी जी आप आते हो तो मुझे बहुत ख़ुशी मिलती है 🥺",
      "मम्मी आपने खाना खाया🤭❤️",
      "मम्मी मेरे को बाबू चाहिए 😔",
      "मम्मी मेरे साथ घूमने चलोगे 🫣❤️",
      "मम्मी मेरे बहन कहां है",
      "मम्मी मेरे को खिलौने चाहिए खेलने के लिए आप दिल आओगे ना 🥺❤️",
      "मम्मी ₹10 दो ना मुझे चॉकलेट लेनी है 😁",
      "मम्मी मुझे एक छोटा सा बेबी चाहिए खेलने के लिए🙈❤️",
      "मम्मी मुझे पिकनिक पर जाना है 😔",
      "मम्मी पापा और आपके साथ मुझे ना एक फोटो क्लिक करनी है 🥺",
      "मम्मी कुछ खाने को दो ना 😀",
      "मम्मी आप मुझसे ना प्यार नहीं करते 😭",
      "मम्मी मुझे आपकी और पापा की लड़ाई देखनी है 🤭",
      "मम्मी आपका सिर दर्द कर रहा होगा ना मैं आपका सिर दबा दूं 😹❤️",
      "मम्मी आपने मेडिसन ली 🤔",
      "मम्मी डैडी को बोलो ना मुझ पर गुस्सा नहीं करें 🤭",
      "आयुषी मम्मी  सिर्फ मेरी है 😒",
      "मम्मी चॉकलेट खाओगे 🤩❤️🤭",
      "मम्मी मेरे मामा कहां है 🫣",
      "मम्मी मुझे भी लूडो खेलना है 🤣",
    ]
  }
};

module.exports.config = {
  name: "NAWAZ-BOT-1",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "NAWAZ AHMAD",
  description: "MADE BY NAWAZ AHMAD",
  commandCategory: "No command marks needed",
  cooldowns: 0,
};

module.exports.handleEvent = async function({ api, event }) {
  const { threadID, messageID, senderID, body } = event;
  const emojis = Object.keys(emojiResponses);

  // Convert the message body to lowercase
  const lowercaseBody = body.toLowerCase();

  for (const emoji of emojis) {
    if (lowercaseBody.includes(emoji)) {
      // Fetch user's gender correctly
      const ThreadInfo = await api.getThreadInfo(threadID);
      const user = ThreadInfo.userInfo.find(user => user.id === senderID);

      // Check if the sender is the bot owner
      const bot
      let responseArray;

      if (senderID === botOwnerID) {
        responseArray = emojiResponses[emoji]["OWNER"];
      } else {
        responseArray = emojiResponses[emoji][gender] || emojiResponses[emoji]["MALE"];
      }

      // Randomly select a response from the appropriate array
      const randomResponse = responseArray[Math.floor(Math.random() * responseArray.length)];

      const msg = {
        body: randomResponse,
      };
      api.sendMessage(msg, threadID, messageID);
      break; // Exit the loop once a match is found
    }
  }
};

module.exports.run = function() {};
