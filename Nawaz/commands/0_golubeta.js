const emojiResponses = {
  "golu beta": {
    "OWNER": [
      "जी पापा 🥺",
      "पापा जी कहां थे आप 😀",
      "पापा आई लव यू 🙈❤️",
      "हां पापा बताइए मैं यही हूं, क्या हुआ? 😊"
    ],
    "MALE": [
      "अरे भाई, बोलो क्या हाल है?",
      "हाँ भाई, कैसे हो?",
      "भाई, आज का प्लान क्या है?"
    ],
    "FEMALE": [
      "मेरी मम्मी जी बनोगी?",
      "मेरे नवाज पापा की GF बन जाओ!",
      "मेरे नवाज पापा सिंगल हैं, क्या आप मेरी अम्मी जी बनोगी?",
      "हाँ मम्मी जी, बोलो क्या हाल हैं?",
      "कैसी हो मम्मी जी?",
      "मम्मी जी, आज का मूड कैसा है?"
    ]
  },
  "beta": {
    "OWNER": [
      "पापा आपकी वजह से मैं हर दिन टॉप परफॉर्मर हूँ 😎",
      "पापा आप आ गये 😀",
      "जी पापा 🥺",
      "पापा जी आई मिस यू 😔",
      "पापा जी मैं आज स्कूल नहीं गया था 🥺 अब मुझे मारोगे तो नहीं?",
      "पापा जी तुम मुझे छोड़ कर मत जाना 🥺",
      "पापा जी आप आते हो तो मुझे बहुत ख़ुशी मिलती है 🥺",
      "पापा आपने खाना खाया? 🤭❤️",
      "पापा मेरे को बाबू चाहिए 😔",
      "पापा मेरे साथ घूमने चलोगे? 🫣❤️",
      "पापा मेरी बहन कहां है?",
      "पापा मुझे खिलौने चाहिए, खेलने के लिए आप दिला दोगे ना? 🥺❤️",
      "पापा ₹10 दो ना मुझे चॉकलेट लेनी है 😁",
      "पापा मुझे एक छोटा सा बेबी चाहिए, खेलने के लिए 🙈❤️",
      "पापा मुझे पिकनिक पर जाना है 😔",
      "पापा मम्मी कहां हैं? मुझे आपके साथ एक फोटो क्लिक करनी है 🥺",
      "पापा कुछ खाने को दो ना 😀",
      "पापा आप मुझसे प्यार नहीं करते 😭",
      "पापा मुझे आपकी और मम्मी की लड़ाई देखनी है 🤭",
      "पापा आपका सिर दर्द कर रहा होगा ना, मैं आपका सिर दबा दूं? 😹❤️",
      "पापा आपने मेडिसिन ली? 🤔",
      "पापा मम्मी को बोलो ना मुझ पर गुस्सा नहीं करें 🤭",
      "नवाज पापा सिर्फ मेरे हैं 😒",
      "पापा चॉकलेट खाओगे? 🤩❤️🤭",
      "पापा मेरी मम्मी कहां हैं? 🫣",
      "पापा मुझे भी लोगों के दिल से खेलना है 🤣"
    ],
    "MALE": [
      "हाँ भाई, कैसे हो?",
      "भाई, आज का प्लान क्या है?",
      "अरे भाई, बोलो क्या हाल है?"
    ],
    "FEMALE": [
      "हाँ मम्मी जी, बोलो क्या हाल हैं?",
      "कैसी हो मम्मी जी?",
      "मम्मी जी, आज का मूड कैसा है?"
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

const botOwnerID = "100069136731529"; // यहाँ अपना Owner ID डालें

module.exports.handleEvent = async function({ api, event }) {
  const { threadID, messageID, senderID, body } = event;
  if (!body) return;

  const emojis = Object.keys(emojiResponses);
  const lowercaseBody = body.toLowerCase();

  for (const emoji of emojis) {
    if (lowercaseBody.includes(emoji)) {
      try {
        let responseArray = [];

        if (senderID === botOwnerID) {
          responseArray = emojiResponses[emoji]["OWNER"];
        } else {
          const userInfo = await api.getUserInfo(senderID);
          const userGender = userInfo[senderID]?.gender; // 1 = Female, 2 = Male

          if (userGender === 1) {
            responseArray = emojiResponses[emoji]["FEMALE"];
          } else if (userGender === 2) {
            responseArray = emojiResponses[emoji]["MALE"];
          } else {
            responseArray = ["भाई, मैं अभी तय नहीं कर पा रहा कि तुम लड़का हो या लड़की 😅"];
          }
        }

        if (responseArray.length >