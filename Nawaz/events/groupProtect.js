const fs = require("fs-extra");
const path = __dirname + "/../../data/groupProtect.json";

module.exports.config = {
  name: "groupProtect",
  eventType: ["log:thread-name", "log:thread-image", "log:thread-color", "log:thread-emoji", "log:user-nickname"],
  version: "1.0.0",
  credits: "Nawaz Boss",
  description: "Protects group from unwanted changes",
  envConfig: {},
  dependencies: {}
};

module.exports.run = async function ({ api, event }) {
  const { threadID, logMessageType } = event;

  let protectList = {};
  if (fs.existsSync(path)) protectList = JSON.parse(fs.readFileSync(path));

  if (!protectList[threadID]) return;

  try {
    switch (logMessageType) {
      case "log:thread-name":
        return api.sendMessage("ðŸš« Group name change is protected!", threadID);

      case "log:thread-image":
        return api.sendMessage("ðŸš« Group image change is protected!", threadID);

      case "log:thread-color":
        return api.sendMessage("ðŸš« Group theme is protected!", threadID);

      case "log:thread-emoji":
        return api.sendMessage("ðŸš« Group emoji is protected!", threadID);

      case "log:user-nickname":
        return api.sendMessage("ðŸš« Nickname change is not allowed!", threadID);
    }
  } catch (err) {
    console.error("[GroupProtect Error]", err);
  }
};
