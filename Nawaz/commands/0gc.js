const axios = require("axios");
const fs = require('fs-extra');
async function getAvatarUrls(userIDs) {
    let avatarURLs = [];
    for (let userID of userIDs) {
        let url = `https://graph.facebook.com/${userID}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
        avatarURLs.push(url);
    }
    return avatarURLs;
}

module.exports = {
    config: {
        name: "gcimg",
        version: "1.0",
        credits: "ASIF",
        cooldowns: 5,
        hasPermission: 0,
        description: "𝗚𝗲𝘁 𝗚𝗿𝗼𝘂𝗽 𝗜𝗺𝗮𝗴𝗲",
        commandCategory: "𝗜𝗠𝗔𝗚𝗘",
        usePrefix: false,
        usages: "{pn} [TID/leave blank] --color [color]",
        argsRequired: true
    },

    run: async function ({ api, args, event }) {
        try {
            let tid;
            let color = "red";
            for (let i = 0; i < args.length; i++) {
                if (args[i] === "--color" && args[i + 1]) {
                    color = args[i + 1];
                    args.splice(i, 2);
                    break;
                }
            }

            if (args[0]) {
                tid = args[0];
            } else {
                tid = event.threadID;
            }

            if (!tid) {
                api.sendMessage('❎ | 𝗧𝗵𝗿𝗲𝗮𝗱𝗜𝗗 𝗡𝗼𝘁 𝗙𝗼𝘂𝗻𝗱.', event.threadID, event.messageID);
                return;
            }
            let threadInfo = await api.getThreadInfo(tid);
            let participantIDs = threadInfo.participantIDs;
            let adminIDs = threadInfo.adminIDs.map(admin => admin.id);
            let memberURLs = await getAvatarUrls(participantIDs);
            let adminURLs = await getAvatarUrls(adminIDs);

            const data2 = {
                memberURLs: memberURLs,
                groupPhotoURL: threadInfo.imageSrc,
                adminURLs: adminURLs,
                groupName: threadInfo.threadName,
                color: color
            };
            if (data2) {
                var waitingMsg = await api.sendMessage("⏳ | 𝙿𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝 𝚊 𝚠𝚑𝚒𝚕𝚎.", event.threadID);
                api.setMessageReaction("⏳", event.messageID, (err) => {}, true)
            }
            const { data } = await axios.post('https://noobs-api2.onrender.com/dipto/groupPhoto', data2);
            const filePath = __dirname + "/cache/gcimg.png";
            const imgRes = await axios.get(data.img, { responseType: 'arraybuffer' });
            fs.writeFileSync(filePath, Buffer.from(imgRes.data, 'binary'));
            api.setMessageReaction("✅", event.messageID, (err) => {}, true)
            api.sendMessage({
                body: `𝙷𝚎𝚛𝚎 𝚒𝚜 𝚢𝚘𝚞𝚛 𝚐𝚛𝚘𝚞𝚙 𝚒𝚖𝚊𝚐𝚎 <😘`,
                attachment: fs.createReadStream(filePath)
            }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);

        } catch (error) {
            console.log(error);
            api.sendMessage('Error: ', error.message, event.threadID, event.messageID);
        };
    }
};
