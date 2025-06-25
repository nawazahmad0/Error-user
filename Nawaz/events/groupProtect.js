const fs = require("fs");
const axios = require("axios");
const path = __dirname + "/../cache/groupLock.json";

module.exports.config = {
  name: "antichangeinfobox",
  eventType: ["log:thread-name", "log:thread-image"],
  version: "1.0.1",
  credits: "Nawaz Boss",
};

module.exports.run = async function ({ api, event }) {
  if (!fs.existsSync(path)) return;
  const data = JSON.parse(fs.readFileSync(path));
  const threadID = event.threadID;

  if (!data[threadID]) return;

  const { name, imageSrc } = data[threadID];

  try {
    if (event.logMessageType === "log:thread-name") {
      // console.log("⚠️ Reverting group name...");
      await api.setTitle(name, threadID);
    }

    if (event.logMessageType === "log:thread-image" && imageSrc) {
      // console.log("⚠️ Reverting group image...");
      const res = await axios.get(imageSrc, { responseType: "stream" });
      await api.changeGroupImage(res.data, threadID);
    }
  } catch (e) {
    console.log("[AntiChangeInfo Error]:", e.message);
  }
};