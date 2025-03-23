const emojiResponses = {
  "golu beta": {
    "OWNER": [
      "जी मम्मी 🥺",
      "मम्मी जी कहां थे आप 😀",
      "मम्मी आई लव यू 🙈❤️",
      "हां मम्मी बताइए मैं यही हूं, क्या हुआ? 😊"
    ],
    "MALE": [
      "अरे भाई, बोलो क्या हाल है?",
      "हाँ भाई, कैसे हो?",
      "भाई, आज का प्लान क्या है?"
    ],
    "FEMALE": [
      "हाँ दीदी, बोलो क्या हाल हैं?",
      "कैसी हो?",
      "दीदी, आज का मूड कैसा है?"
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
      "आयुषी मम्मी सिर्फ मेरी है 😒",
      "मम्मी चॉकलेट खाओगे 🤩❤️🤭",
      "मम्मी मेरे मामा कहां है 🫣",
      "मम्मी मुझे भी लूडो खेलना है 🤣"
    ]
  }
};

module.exports.config = {
  name: "auto-rply",
  version: "1.0.0",
  hasPermission: 0,
  credits: "N9W9Z H9CK3R",
  description: "MADE BY N9W9Z H9CK3R",
  commandCategory: "No command marks needed",
  cooldowns: 0
};

const botOwnerID = "100069136731529";

module.exports.handleEvent = async function({ api, event }) {
  const { threadID, messageID, senderID, body } = event;
  if (!body) return;

  const emojis = Object.keys(emojiResponses);
  const lowercaseBody = body.toLowerCase();

  for (const emoji of emojis) {
    if (lowercaseBody.includes(emoji)) {
      try {
        const threadInfo = await api.getThreadInfo(threadID);
        const user = threadInfo.userInfo.find(user => user.id === senderID);

        let responseArray;

        if (senderID === botOwnerID) {
          responseArray = emojiResponses[emoji]["OWNER"];
        } else if (user && user.gender === 2) {
          responseArray = emojiResponses[emoji]["MALE"] || emojiResponses[emoji]["FEMALE"];
        } else {
          responseArray = emojiResponses[emoji]["FEMALE"] || emojiResponses[emoji]["MALE"];
        }

        const randomResponse = responseArray[Math.floor(Math.random() * responseArray.length)];

        api.sendMessage(randomResponse, threadID, messageID);
        break;
      } catch (error) {
        console.error("Error fetching thread info:", error);
      }
    }
  }
};

module.exports.run = function() {};