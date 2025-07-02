////////////////////////////////////////////////
//========= Check update from Github =========//
////////////////////////////////////////////////

(async () => {
    try {
        const res = await axios.get("https://raw.githubusercontent.com/priyanshu192/bot/main/package.json");
        logger(res.data.name, "[ NAME ]");
        logger(`Version: ${res.data.version}`, "[ VERSION ]");
        logger(res.data.description, "[ DESCRIPTION ]");
    } catch (err) {
        logger(`Failed to fetch update info: ${err.message}`, "[ Update Error ]");
        // continue without crashing
    }

    // Start the bot after update check
    startBot();
})();